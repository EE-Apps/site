// Создаём глобальную переменную
let globalLat = 0;
let globalLon = 0;

async function getWeatherData({ lat, lon, metric = false }) {
    if (navigator.onLine) {
        const units = metric ? "metric" : "imperial";
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto&units=${units}&forecast_days=14`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const prognozVremenno = await response.json();

            // Сохраняем данные в localStorage
            localStorage.setItem('Prognoz', JSON.stringify(prognozVremenno));
            return prognozVremenno;
        } catch (error) {
            console.error("Error fetching weather data:", error);
            // Возвращаем данные из localStorage в случае ошибки
            const savedData = localStorage.getItem('Prognoz');
            if (savedData) {
                return JSON.parse(savedData);
            }
            return { error: "Failed to fetch weather data and no saved data available." };
        }
    } else {
        // Возвращаем данные из localStorage, если нет интернета
        const savedData = localStorage.getItem('Prognoz');
        if (savedData) {
            return JSON.parse(savedData);
        }
        return { error: "No internet and no saved weather data." };
    }
}

async function updateWeather(lat, lon) {
    const metric = true; // Metric units
    return await getWeatherData({ lat, lon, metric });
}

async function updateAll(lat, lon) {
    // Обновляем погоду с переданными lat и lon
    NOWupdateWeatherData(globalLat, globalLon);
    const data = await updateWeather(globalLat, globalLon);

    console.log("updateAll");

    const temperatureElement = document.getElementById("temperature");
    const windSpeedElement = document.getElementById("wind-speed");
    const humidityElement = document.getElementById("humidity");
    const pressureElement = document.getElementById("pressure");

    if (!data || data.error) {
        console.error("Error: Weather data is unavailable or invalid.");
        return;
    }

    const weatherIcons = {
        0: "ico/clear.svg",                 // Clear sky
        1: "ico/partly_cloudy.svg",         // Partly cloudy
        2: "ico/cloudy.svg",                // Cloudy
        3: "ico/cloudy.svg",                // Cloudy
        45: "ico/fog.svg",                  // Fog
        48: "ico/fog.svg",                  // Fog
        51: "ico/light_rain.svg",           // Light rain
        53: "ico/moderate_rain.svg",        // Moderate rain
        55: "ico/moderate_rain.svg",        // Moderate rain
        56: "ico/freezing_rain.svg",        // Freezing rain
        57: "ico/freezing_rain.svg",        // Freezing rain
        61: "ico/showers.svg",              // Showers
        63: "ico/moderate_rain.svg",        // Moderate rain
        65: "ico/heavy_rain.svg",           // Heavy rain
        66: "ico/freezing_rain.svg",        // Freezing rain
        67: "ico/freezing_rain.svg",        // Freezing rain
        71: "ico/light_snow.svg",           // Light snow
        73: "ico/moderate_snow.svg",        // Moderate snow
        75: "ico/heavy_snow.svg",           // Heavy snow
        77: "ico/snow_showers.svg",         // Snow showers
        80: "ico/rain_showers.svg",         // Rain showers
        81: "ico/heavy_rain_showers.svg",   // Heavy rain showers
        82: "ico/extreme_rain_showers.svg", // Extreme rain showers
        85: "ico/light_snow_showers.svg",   // Light snow showers
        86: "ico/heavy_snow_showers.svg",   // Heavy snow showers
        95: "ico/thunderstorm.svg",         // Thunderstorm
        96: "ico/thunderstorm.svg",         // Thunderstorm
        99: "ico/thunderstorm.svg",         // Thunderstorm
    };

    const daysOfWeek = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];
    const hoursContainer = document.getElementById("hours-container");
    const daysContainer = document.getElementById("days-container");

    if (!hoursContainer || !daysContainer) {
        console.error("Error: Required containers are missing in the DOM.");
        return;
    }

    const now = new Date();

    function findClosestFutureHourIndex(times) {
        const nowTimestamp = now.getTime();
        return times.findIndex((time) => new Date(time).getTime() >= nowTimestamp);
    }

    const closestHourIndex = findClosestFutureHourIndex(data.hourly.time);
    if (closestHourIndex === -1) {
        console.error("Error: No future hours found.");
        return;
    }

    // Clear previous data
    hoursContainer.innerHTML = "";
    daysContainer.innerHTML = "";

    // Display hourly data
    data.hourly.time.slice(closestHourIndex).forEach((time, index) => {
        const actualIndex = closestHourIndex + index;
        const temperature = Math.round(data.hourly.temperature_2m?.[actualIndex]); // Rounded temperature
        const weatherCode = data.hourly.weather_code?.[actualIndex];
        const weatherIcon = weatherIcons[weatherCode] || "default.png";

        if (temperature === undefined || weatherCode === undefined) return;

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = ` 
            <a class="c-time">${new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</a>
            <img class="c-img" src="${weatherIcon}" />
            <a class="c-temp">${temperature}°C</a>
        `;

        hoursContainer.appendChild(card);
    });

    // Display daily forecast data
    data.daily.time.forEach((time, index) => {
        const dayOfWeek = daysOfWeek[new Date(time).getDay()];
        const minTemp = Math.round(data.daily.temperature_2m_min?.[index]); // Rounded min temperature
        const maxTemp = Math.round(data.daily.temperature_2m_max?.[index]); // Rounded max temperature
        const weatherCode = data.daily.weather_code?.[index];
        const weatherIcon = weatherIcons[weatherCode] || "default.png";

        if (minTemp === undefined || maxTemp === undefined || weatherCode === undefined) return;

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = ` 
            <a class="c-time">${dayOfWeek}</a>
            <img class="c-img" src="${weatherIcon}" />
            <a class="c-temp">${minTemp}°C - ${maxTemp}°C</a>
        `;

        daysContainer.appendChild(card);
    });
};

const hourscontainer = document.getElementById('hours-container');
hourscontainer.addEventListener('wheel', (evt) => {
    evt.preventDefault();
    hourscontainer.scrollLeft += evt.deltaY;
});

const dayscontainer = document.getElementById('days-container');
dayscontainer.addEventListener('wheel', (evt) => {
    evt.preventDefault();
    dayscontainer.scrollLeft += evt.deltaY;
});

document.getElementById("city-select").addEventListener("change", async function () {
    const selectElement = document.getElementById("city-select");

    // Получаем выбранный option
    const selectedOption = selectElement.options[selectElement.selectedIndex];

    // Извлекаем данные из атрибутов
    globalLat = selectedOption.getAttribute('data-lat');
    globalLon = selectedOption.getAttribute('data-lon');

    console.log(`Latitude: ${globalLat}, Longitude: ${globalLon}`);

    // Передаем lat и lon в updateAll
    await updateAll(globalLat, globalLon);
});

document.addEventListener("DOMContentLoaded", function () {
    const selectElement = document.getElementById("city-select");

    // Получаем первый город в списке
    const firstOption = selectElement.options[0];

    // Извлекаем данные первого города
    globalLat = firstOption.getAttribute('data-lat');
    globalLon = firstOption.getAttribute('data-lon');

    // Вызываем обновление погоды для выбранного города
    updateAll(globalLat, globalLon);
});



// Получаем элемент выпадающего списка
const dropdownCity = document.getElementById('city-select');

// Проверяем, если значение сохранено в localStorage, устанавливаем его в качестве выбранного
const savedCity = localStorage.getItem('selectedCity');
if (savedCity) {
    dropdownCity.value = savedCity;
}

// Слушаем изменение выбора в выпадающем списке
dropdownCity.addEventListener('change', function () {
    localStorage.setItem('selectedCity', dropdownCity.value);
    console.log("сохранён город:", dropdownCity.value)
});

function setBackground(className) {
    const divNow = document.querySelector('.div-now');
    console.log(className);

    // Удаляем все возможные фоны
    divNow.classList.remove('weather-sun', 'weather-cloudy', 'weather-rain', 'weather-snow');

    console.log(className);
    className = "weather-" + className;

    // Добавляем новый класс
    divNow.classList.add(className);
}

setBackground('rain')
const apiUrl = "https://api.open-meteo.com/v1/forecast?";

const elements = {
    temperature: document.getElementById("temperature"),
    description: document.getElementById("description"),
    windSpeed: document.getElementById("wind-speed"),
    humidity: document.getElementById("humidity"),
    pressure: document.getElementById("pressure"),
    weatherIcon: document.getElementById("weather-icon"),
};

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

function convertPressureToMmHg(hPa) {
    return (hPa * 0.75006375541921).toFixed(1);
}

function convertWindSpeedToMps(kmh) {
    return (kmh / 3.6).toFixed(1);
}

async function fetchWeather(lat, lon) {
    const queryParams = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current: "temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m", // Используем правильный параметр "current"
        timezone: "auto",
    });

    try {
        const response = await fetch(`${apiUrl}${queryParams}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log(data.current);
        console.log(`${apiUrl}${queryParams}`);
        return data.current;
    } catch (error) {
        console.error("Ошибка получения данных:", error);
        return null;
    }
}

async function updateWeather(lat, lon) {
    const weather = await fetchWeather(lat, lon);
    if (weather) {
        elements.temperature.textContent = `${Math.round(weather.temperature_2m)}°C`;
        elements.description.textContent = weather.weathercode
            ? `Код погоды: ${weather.weathercode}`
            : "Нет данных";
        elements.windSpeed.textContent = convertWindSpeedToMps(weather.wind_speed_10m);
        elements.humidity.textContent = weather.relative_humidity_2m || "--";
        console.log(weather.relative_humidity_2m);
        console.log(weather.surface_pressure);
        console.log(weather);
        elements.pressure.textContent = convertPressureToMmHg(weather.surface_pressure || "--");
        elements.weatherIcon.style.backgroundImage =
            `url('${weatherIcons[weather.weathercode] || "icons/default.png"}')`;
    }
}

// Функция для сохранения выбранного города в localStorage
function saveSelectedCity(cityIndex) {
    localStorage.setItem("selectedCity", cityIndex);
}

// Функция для восстановления выбранного города
function restoreSelectedCity() {
    const selectedCityIndex = localStorage.getItem("selectedCity");
    if (selectedCityIndex) {
        const selectElement = document.getElementById("city-select");
        selectElement.selectedIndex = selectedCityIndex; // Восстанавливаем выбранный индекс
    }
}

document.getElementById("update-weather").addEventListener("click", () => {
    const selectElement = document.getElementById("city-select");
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const lat = selectedOption.getAttribute("data-lat");
    const lon = selectedOption.getAttribute("data-lon");
    saveSelectedCity(selectElement.selectedIndex); // Сохраняем выбранный город
    updateWeather(lat, lon);
});

// Автоматическое обновление при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    restoreSelectedCity(); // Восстанавливаем выбранный город
    const selectElement = document.getElementById("city-select");
    const firstOption = selectElement.options[selectElement.selectedIndex];
    const lat = firstOption.getAttribute("data-lat");
    const lon = firstOption.getAttribute("data-lon");
    updateWeather(lat, lon);
});

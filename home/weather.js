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
    0: "weather/ico/clear.svg",                 // Clear sky
    1: "weather/ico/partly_cloudy.svg",         // Partly cloudy
    2: "weather/ico/cloudy.svg",                // Cloudy
    3: "weather/ico/cloudy.svg",                // Cloudy
    45: "weather/ico/fog.svg",                  // Fog
    48: "weather/ico/fog.svg",                  // Fog
    51: "weather/ico/light_rain.svg",           // Light rain
    53: "weather/ico/moderate_rain.svg",        // Moderate rain
    55: "weather/ico/moderate_rain.svg",        // Moderate rain
    56: "weather/ico/freezing_rain.svg",        // Freezing rain
    57: "weather/ico/freezing_rain.svg",        // Freezing rain
    61: "weather/ico/showers.svg",              // Showers
    63: "weather/ico/moderate_rain.svg",        // Moderate rain
    65: "weather/ico/heavy_rain.svg",           // Heavy rain
    66: "weather/ico/freezing_rain.svg",        // Freezing rain
    67: "weather/ico/freezing_rain.svg",        // Freezing rain
    71: "weather/ico/light_snow.svg",           // Light snow
    73: "weather/ico/moderate_snow.svg",        // Moderate snow
    75: "weather/ico/heavy_snow.svg",           // Heavy snow
    77: "weather/ico/snow_showers.svg",         // Snow showers
    80: "weather/ico/rain_showers.svg",         // Rain showers
    81: "weather/ico/heavy_rain_showers.svg",   // Heavy rain showers
    82: "weather/ico/extreme_rain_showers.svg", // Extreme rain showers
    85: "weather/ico/light_snow_showers.svg",   // Light snow showers
    86: "weather/ico/heavy_snow_showers.svg",   // Heavy snow showers
    95: "weather/ico/thunderstorm.svg",         // Thunderstorm
    96: "weather/ico/thunderstorm.svg",         // Thunderstorm
    99: "weather/ico/thunderstorm.svg",         // Thunderstorm
};

const weatherNames = {
    0: "Ясно",                              // Clear sky
    1: "Частичная облачность",              // Partly cloudy
    2: "Облачно",                           // Cloudy
    3: "Пасмурно",                          // Overcast
    45: "Туман",                            // Fog
    48: "Морозный туман",                   // Depositing rime fog
    51: "Лёгкий моросящий дождь",           // Light drizzle
    53: "Моросящий дождь",                  // Moderate drizzle
    55: "Сильный моросящий дождь",          // Dense drizzle
    56: "Лёгкий ледяной дождь",             // Light freezing drizzle
    57: "Сильный ледяной дождь",            // Dense freezing drizzle
    61: "Лёгкий дождь",                     // Slight rain
    63: "Умеренный дождь",                  // Moderate rain
    65: "Сильный дождь",                    // Heavy rain
    66: "Лёгкий ледяной дождь",             // Light freezing rain
    67: "Сильный ледяной дождь",            // Heavy freezing rain
    71: "Лёгкий снегопад",                  // Slight snowfall
    73: "Умеренный снегопад",               // Moderate snowfall
    75: "Сильный снегопад",                 // Heavy snowfall
    77: "Снежные зерна",                    // Snow grains
    80: "Лёгкий ливень",                    // Slight rain showers
    81: "Умеренный ливень",                 // Moderate rain showers
    82: "Сильный ливень",                   // Violent rain showers
    85: "Лёгкий снег",                      // Slight snow showers
    86: "Сильный снег",                     // Heavy snow showers
    95: "Гроза",                            // Thunderstorm
    96: "Гроза с небольшим градом",         // Thunderstorm with slight hail
    99: "Гроза с сильным градом",           // Thunderstorm with heavy hail
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
        current: "temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,weather_code", // Используем правильный параметр "current"
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
        elements.description.textContent = weather.weather_code
            ? ` ${getWeatherName(weather.weather_code)}`
            : "Нет данных";
        elements.windSpeed.textContent = convertWindSpeedToMps(weather.wind_speed_10m);
        elements.humidity.textContent = weather.relative_humidity_2m || "--";
        console.log(weather.relative_humidity_2m);
        console.log(weather.surface_pressure);
        console.log(weather);
//        elements.pressure.textContent = convertPressureToMmHg(weather.surface_pressure || "--");
        elements.weatherIcon.style.backgroundImage = `url('${getWeatherIcon(weather.weather_code)}')`;

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

function getWeatherIcon(weathercode) { // Функция для получения пути к иконке
    // Если weathercode есть в weatherIcons, возвращаем его; иначе — путь по умолчанию
    return weatherIcons[weathercode] || "weather/ico/default.svg";
}

function getWeatherName(weathercode) { // Функция для получения названия погоды
    // Если weathercode есть в weatherIcons, возвращаем его; иначе — путь по умолчанию
    return weatherNames[weathercode] || "Нет данных";
}
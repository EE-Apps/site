async function getWeatherData({ lat, lon, metric = false }) {
    const weatherCodes = [
        "Cloud development not observed or not observable",
        "Clouds generally dissolving or becoming less developed",
        "State of sky on the whole unchanged",
        "Clouds generally forming or developing",
        "Visibility reduced by smoke",
        "Haze",
        "Widespread dust in suspension",
        "Dust or sand raised by wind",
        "Well developed dust whirl(s) or sand whirl(s)",
        "Duststorm or sandstorm within sight",
        "Mist",
        "Patches of shallow fog or ice fog",
        "More or less continuous fog or ice fog",
        "Lightning visible, no thunder heard",
        "Precipitation within sight, not reaching the ground",
        "Precipitation within sight, reaching the ground or sea, distant",
        "Precipitation within sight, reaching the ground or sea, near",
        "Thunderstorm, no precipitation",
        "Squalls",
        "Funnel cloud (tornado cloud or water-spout)",
    ];

    const units = metric ? "metric" : "imperial";
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto&units=${units}&forecast_days=14`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return { error: "Failed to fetch weather data." };
    }
}

async function updateWeather() {
    const lat = 46.8406; // Latitude
    const lon = 29.4744; // Longitude
    const metric = true; // Metric units

    return await getWeatherData({ lat, lon, metric });
}

document.addEventListener("DOMContentLoaded", async () => {
    const temperatureElement = document.getElementById("temperature");
    const windSpeedElement = document.getElementById("wind-speed");
    const humidityElement = document.getElementById("humidity");
    const pressureElement = document.getElementById("pressure");

    const data = await updateWeather();

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

    hoursContainer.innerHTML = "";
    daysContainer.innerHTML = "";

    data.hourly.time.slice(closestHourIndex).forEach((time, index) => {
        const actualIndex = closestHourIndex + index;
        const temperature = Math.round(data.hourly.temperature_2m?.[actualIndex]); // Округление температуры
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

    data.daily.time.forEach((time, index) => {
        const dayOfWeek = daysOfWeek[new Date(time).getDay()];
        const minTemp = Math.round(data.daily.temperature_2m_min?.[index]); // Округление температуры
        const maxTemp = Math.round(data.daily.temperature_2m_max?.[index]); // Округление температуры
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

    if (data.current_weather) {
        const temperature = data.current_weather.temperature;
        const windSpeed = data.current_weather.wind_speed;
        const closestHourIndex = findClosestFutureHourIndex(data.hourly.time);
        const currentHumidity = data.hourly.relative_humidity_2m?.[closestHourIndex];
        const currentPressure = data.hourly.surface_pressure?.[closestHourIndex];

        if (temperatureElement) {
            temperatureElement.textContent = `${Math.round(temperature)}°`;
        }

        if (windSpeedElement) {
            windSpeedElement.textContent = `Скорость ветра: ${windSpeed} м/с`;
        }

        if (humidityElement && currentHumidity !== undefined) {
            humidityElement.textContent = `Влажность: ${currentHumidity}%`;
        }

        if (pressureElement && currentPressure !== undefined) {
            pressureElement.textContent = `Давление: ${Math.round(currentPressure)} гПа`;
        }
    }
});
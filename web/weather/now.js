// DOM
const NOWtemperatureElement = document.getElementById("temperature");
const NOWwindSpeedElement = document.getElementById("wind-speed");
const NOWhumidityElement = document.getElementById("humidity");
const NOWpressureElement = document.getElementById("pressure");

const backgroundWeatherIcons = {
    0: "sun", 1: "cloudy", 2: "cloudy", 3: "cloudy",
    45: "fog", 48: "fog",
    51: "rain", 53: "rain", 55: "rain",
    56: "rain", 57: "rain",
    61: "rain", 63: "rain", 65: "rain",
    66: "rain", 67: "rain",
    71: "snow", 73: "snow", 75: "snow", 77: "snow",
    80: "rain", 81: "rain", 82: "rain",
    85: "snow", 86: "snow",
    95: "thunderstorm", 96: "thunderstorm", 99: "thunderstorm",
};

const hPaToMm = hPa => (hPa * 0.75006375541921).toFixed(1);
const kmhToMs = kmh => (kmh / 3.6).toFixed(1);

/**
 * Использует объект current из общего ответа Open-Meteo
 */
function NOWrenderCurrent(current) {
    if (!current) return;

    NOWtemperatureElement.textContent = `${current.temperature_2m}°`;
    NOWwindSpeedElement.textContent = `${kmhToMs(current.wind_speed_10m)} м/с`;
    NOWhumidityElement.textContent =
        current.relative_humidity_2m != null ? `${current.relative_humidity_2m}%` : "н/д";
    NOWpressureElement.textContent =
        current.surface_pressure != null
            ? `${hPaToMm(current.surface_pressure)} мм рт. ст.`
            : "н/д";

    setBackground(backgroundWeatherIcons[current.weather_code] || "default");
}

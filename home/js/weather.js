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

        // Сохраняем данные о погоде в localStorage
        saveWeatherData(lat, lon, weather);
    }
}

// Функция для сохранения данных о погоде в localStorage
function saveWeatherData(lat, lon, weather) {
    const weatherData = {
        lat: lat,
        lon: lon,
        temperature: weather.temperature_2m,
        weather_code: weather.weather_code,
        wind_speed: weather.wind_speed_10m,
        humidity: weather.relative_humidity_2m,
        timestamp: new Date().getTime()
    };
    localStorage.setItem("weatherData", JSON.stringify(weatherData));
}

// Функция для загрузки данных о погоде из localStorage
function loadWeatherData() {
    const savedWeatherData = localStorage.getItem("weatherData");
    if (savedWeatherData) {
        try {
            const weatherData = JSON.parse(savedWeatherData);
            const now = new Date().getTime();
            // Если данные старше 1 часа, не загружаем из кеша
            if (now - weatherData.timestamp > 3600000) {
                return null;
            }
            return weatherData;
        } catch (e) {
            console.error('Error parsing saved weather data:', e);
            return null;
        }
    }
    return null;
}

// Функция для отображения загруженных данных о погоде
function displayWeatherData(weatherData) {
    if (!weatherData) return;
    elements.temperature.textContent = `${Math.round(weatherData.temperature)}°C`;
    elements.description.textContent = getWeatherName(weatherData.weather_code);
    elements.windSpeed.textContent = convertWindSpeedToMps(weatherData.wind_speed);
    elements.humidity.textContent = weatherData.humidity || "--";
    elements.weatherIcon.style.backgroundImage = `url('${getWeatherIcon(weatherData.weather_code)}')`;
}

// Функция для сохранения выбранного города в localStorage
function saveSelectedCity(lat, lon) {
    localStorage.setItem("selectedCity", JSON.stringify([lat, lon]));
}

// Функция для загрузки выбранного города из localStorage
function loadSelectedCity() {
    const savedCity = localStorage.getItem("selectedCity");
    if (savedCity) {
        try {
            return JSON.parse(savedCity);
        } catch (e) {
            console.error('Error parsing saved city:', e);
            return null;
        }
    }
    return null;
}

document.getElementById("update-weather").addEventListener("click", () => {
    const selectElement = document.getElementById("city-select");
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const lat = Number(JSON.parse(localStorage.weatherData).lat);
    const lon = Number(JSON.parse(localStorage.weatherData).lon);
    if (lat && lon) {
        saveSelectedCity(lat, lon);
        updateWeather(lat, lon);
    }
});

// Автоматическое обновление при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    // Загружаем сохранённый город
    const savedCity = loadSelectedCity();
    let lat, lon;
    
    if (savedCity && Array.isArray(savedCity) && savedCity.length === 2) {
        [lat, lon] = savedCity;
    } else {
        // Используем город по умолчанию из settings
        if (settings.weather && Array.isArray(settings.weather)) {
            [lat, lon] = settings.weather;
        } else {
            // Fallback на первый город в списке
            const selectElement = document.getElementById("city-select");
            const firstOption = selectElement.options[0];
            lat = firstOption.getAttribute("data-lat");
            lon = firstOption.getAttribute("data-lon");
        }
    }
    
    // Сначала загружаем кешированные данные
    const cachedWeatherData = loadWeatherData();
    if (cachedWeatherData) {
        displayWeatherData(cachedWeatherData);
    }
    
    // Затем обновляем погоду с сервера
    if (lat && lon) {
        updateWeather(lat, lon);
    }
});

function getWeatherIcon(weathercode) { // Функция для получения пути к иконке
    // Если weathercode есть в weatherIcons, возвращаем его; иначе — путь по умолчанию
    return weatherIcons[weathercode] || "weather/ico/default.svg";
}

function getWeatherName(weathercode) { // Функция для получения названия погоды
    // Если weathercode есть в weatherIcons, возвращаем его; иначе — путь по умолчанию
    return weatherNames[weathercode] || "Нет данных";
}

document.addEventListener('DOMContentLoaded', () => {
    let cities = [
    { value: '', label: '--- None ---' },
    { value: ['46.8406', '29.4744'], label: '[ПМР] Тирасполь', img: 'img/flag/md.svg' },
    { value: ['46.1833', '29.0833'], label: '[ПМР] Бендеры', img: 'img/flag/md.svg' },
    { value: ['47.7686', '29.0000'], label: '[ПМР] Рыбница', img: 'img/flag/md.svg' },
    { value: ['47.2656', '29.1667'], label: '[ПМР] Дубоссары', img: 'img/flag/md.svg' },
    { value: ['47.0105', '28.8638'], label: '[Молд] Кишинэу', img: 'img/flag/md.svg' },
    { value: ['47.7530', '27.9184'], label: '[Молд] Бэлць', img: 'img/flag/md.svg' },
    { value: ['45.9075', '28.1944'], label: '[Молд] Кахул', img: 'img/flag/md.svg' },
    { value: ['50.4501', '30.5236'], label: '[Укр] Київ', img: 'img/flag/ua.svg' },
    { value: ['50.5110', '30.7909'], label: '[Укр] Бровари', img: 'img/flag/ua.svg' },
    { value: ['49.9935', '36.2304'], label: '[Укр] Харків', img: 'img/flag/ua.svg' },
    { value: ['48.4647', '35.0462'], label: '[Укр] Дніпропетровськ', img: 'img/flag/ua.svg' },
    { value: ['48.0159', '37.8029'], label: '[Укр] Донецьк', img: 'img/flag/ua.svg' },
    { value: ['48.5740', '39.3078'], label: '[Укр] Луганськ', img: 'img/flag/ua.svg' },
    { value: ['47.8388', '35.1396'], label: '[Укр] Запоріжжя', img: 'img/flag/ua.svg' },
    { value: ['46.4825', '30.7233'], label: '[Укр] Одеса', img: 'img/flag/ua.svg' },
    { value: ['46.9750', '31.9946'], label: '[Укр] Миколаїв', img: 'img/flag/ua.svg' },
    { value: ['46.6354', '32.6169'], label: '[Укр] Херсон', img: 'img/flag/ua.svg' },
    { value: ['49.8397', '24.0297'], label: '[Укр] Львів', img: 'img/flag/ua.svg' },
    { value: ['49.5883', '34.5514'], label: '[Укр] Полтава', img: 'img/flag/ua.svg' },
    { value: ['51.4982', '31.2893'], label: '[Укр] Чернигів', img: 'img/flag/ua.svg' },
    { value: ['47.9105', '33.3918'], label: '[Укр] Кривий Ріг', img: 'img/flag/ua.svg' },
    { value: ['48.0708', '37.9578'], label: '[Укр] Макеївка', img: 'img/flag/ua.svg' },
    { value: ['49.2331', '28.4682'], label: '[Укр] Винниця', img: 'img/flag/ua.svg' },
    { value: ['49.4229', '26.9871'], label: '[Укр] Хмельницький', img: 'img/flag/ua.svg' },
    { value: ['48.2917', '25.9352'], label: '[Укр] Черновці', img: 'img/flag/ua.svg' },
    { value: ['50.2546', '28.6587'], label: '[Укр] Житомир', img: 'img/flag/ua.svg' },
    { value: ['50.9077', '34.7981'], label: '[Укр] Суми', img: 'img/flag/ua.svg' },
    { value: ['48.5079', '32.2623'], label: '[Укр] Кировоград', img: 'img/flag/ua.svg' },
    { value: ['49.5535', '25.5948'], label: '[Укр] Тернопіль', img: 'img/flag/ua.svg' },
    { value: ['48.9226', '24.7111'], label: '[Укр] Івано-Франківськ', img: 'img/flag/ua.svg' },
    { value: ['50.7472', '25.3254'], label: '[Укр] Луцьк', img: 'img/flag/ua.svg' },
    { value: ['48.6208', '22.2879'], label: '[Укр] Ужгород', img: 'img/flag/ua.svg' },
    { value: ['50.6199', '26.2516'], label: '[Укр] Рівне', img: 'img/flag/ua.svg' },
    { value: ['44.9521', '34.1024'], label: '[Крым] Симферополь', img: 'img/flag/ru.svg' },
    { value: ['44.6167', '33.5254'], label: '[Крым] Севастополь', img: 'img/flag/ru.svg' },
    { value: ['44.4952', '34.1663'], label: '[Крым] Ялта', img: 'img/flag/ru.svg' },
    { value: ['45.3567', '36.4744'], label: '[Крым] Керчь', img: 'img/flag/ru.svg' },
    { value: ['55.7558', '37.6173'], label: '[Рос] Москва', img: 'img/flag/ru.svg' },
    { value: ['59.9343', '30.3351'], label: '[Рос] Ленинград', img: 'img/flag/ru.svg' },
    { value: ['56.2965', '43.9361'], label: '[Рос] Горький', img: 'img/flag/ru.svg' },
    { value: ['56.8389', '60.6057'], label: '[Рос] Свердловск', img: 'img/flag/ru.svg' },
    { value: ['53.1959', '50.1002'], label: '[Рос] Куйбышев', img: 'img/flag/ru.svg' },
    { value: ['48.7080', '44.5133'], label: '[Рос] Волгоград', img: 'img/flag/ru.svg' },
    { value: ['55.7961', '49.1064'], label: '[Рос] Казань', img: 'img/flag/ru.svg' },
    { value: ['55.1644', '61.4368'], label: '[Рос] Челябинск', img: 'img/flag/ru.svg' },
    { value: ['58.0105', '56.2502'], label: '[Рос] Пермь', img: 'img/flag/ru.svg' },
    { value: ['55.0084', '82.9357'], label: '[Рос] Новосибирск', img: 'img/flag/ru.svg' },
    { value: ['54.9885', '73.3242'], label: '[Рос] Омск', img: 'img/flag/ru.svg' },
    { value: ['56.0153', '92.8932'], label: '[Рос] Красноярск', img: 'img/flag/ru.svg' },
    { value: ['52.2871', '104.2810'], label: '[Рос] Иркутск', img: 'img/flag/ru.svg' },
    { value: ['43.1155', '131.8855'], label: '[Рос] Владивосток', img: 'img/flag/ru.svg' },
    { value: ['47.2224', '39.7189'], label: '[Рос] Ростов-на-Дону', img: 'img/flag/ru.svg' },
    { value: ['54.7355', '55.9587'], label: '[Рос] Уфа', img: 'img/flag/ru.svg' },
    { value: ['45.0355', '38.9753'], label: '[Рос] Краснодар', img: 'img/flag/ru.svg' },
    { value: ['51.6608', '39.2003'], label: '[Рос] Воронеж', img: 'img/flag/ru.svg' },
    { value: ['51.5336', '46.0343'], label: '[Рос] Саратов', img: 'img/flag/ru.svg' },
    { value: ['53.5078', '49.4204'], label: '[Рос] Тольятти', img: 'img/flag/ru.svg' },
    { value: ['56.8498', '53.2045'], label: '[Рос] Ижевск', img: 'img/flag/ru.svg' },
    { value: ['57.6261', '39.8845'], label: '[Рос] Ярославль', img: 'img/flag/ru.svg' },
    { value: ['53.3548', '83.7698'], label: '[Рос] Барнаул', img: 'img/flag/ru.svg' },
    { value: ['43.0259', '44.6353'], label: '[Рос] Владикавказ', img: 'img/flag/ru.svg' },
    { value: ['68.9707', '33.0759'], label: '[Рос] Мурманск', img: 'img/flag/ru.svg' },
    { value: ['54.1930', '37.6178'], label: '[Рос] Тула', img: 'img/flag/ru.svg' },
    { value: ['55.3547', '86.0873'], label: '[Рос] Кемерово', img: 'img/flag/ru.svg' },
    { value: ['43.2389', '76.8897'], label: '[Каз] Алма-Ата', img: 'img/flag/kz.svg' },
    { value: ['51.1694', '71.4491'], label: '[Каз] Целиноград', img: 'img/flag/kz.svg' },
    { value: ['49.8060', '73.0850'], label: '[Каз] Караганда', img: 'img/flag/kz.svg' },
    { value: ['52.2873', '76.9674'], label: '[Каз] Павлодар', img: 'img/flag/kz.svg' },
    { value: ['49.9483', '82.6285'], label: '[Каз] Усть-Каменогорск', img: 'img/flag/kz.svg' },
    { value: ['42.3150', '69.5850'], label: '[Каз] Чимкент', img: 'img/flag/kz.svg' },
    { value: ['50.4230', '80.2434'], label: '[Каз] Семипалатинск', img: 'img/flag/kz.svg' },
    { value: ['51.2278', '51.3866'], label: '[Каз] Уральск', img: 'img/flag/kz.svg' },
    { value: ['54.8752', '69.1628'], label: '[Каз] Петропавловск', img: 'img/flag/kz.svg' },
    { value: ['50.3004', '57.1546'], label: '[Каз] Актюбинск', img: 'img/flag/kz.svg' },
    { value: ['53.9000', '27.5667'], label: '[Бел] Минск', img: 'img/flag/by.svg' },
    { value: ['52.4443', '30.9754'], label: '[Бел] Гомель', img: 'img/flag/by.svg' },
    { value: ['53.9168', '30.3449'], label: '[Бел] Могилёв', img: 'img/flag/by.svg' },
    { value: ['55.1848', '30.2016'], label: '[Бел] Витебск', img: 'img/flag/by.svg' },
    { value: ['53.6694', '23.8131'], label: '[Бел] Гродно', img: 'img/flag/by.svg' },
    { value: ['52.0976', '23.7341'], label: '[Бел] Брест', img: 'img/flag/by.svg' },
    { value: ['53.1384', '29.2214'], label: '[Бел] Бобруйск', img: 'img/flag/by.svg' },
    { value: ['53.1323', '26.0139'], label: '[Бел] Барановичи', img: 'img/flag/by.svg' },
    { value: ['54.2244', '28.5108'], label: '[Бел] Борисов', img: 'img/flag/by.svg' },
    { value: ['41.7151', '44.8271'], label: '[GEO] თბილისი', img: 'img/flag/ge.svg' },
    { value: ['42.2679', '42.6946'], label: '[GEO] ქუთაისი', img: 'img/flag/ge.svg' },
    { value: ['40.1792', '44.4991'], label: '[ARM] Երևան', img: 'img/flag/am.svg' },
    { value: ['40.7894', '43.8475'], label: '[ARM] Գյումրի', img: 'img/flag/am.svg' },
    { value: ['40.4093', '49.8671'], label: '[AZE] Bakı', img: 'img/flag/az.svg' },
    { value: ['40.6828', '46.3606'], label: '[AZE] Gəncə', img: 'img/flag/az.svg' },
    { value: ['56.9496', '24.1052'], label: '[LVA] Rīga', img: 'img/flag/lv.svg' },
    { value: ['55.8753', '26.5358'], label: '[LVA] Daugavpils', img: 'img/flag/lv.svg' },
    { value: ['54.6872', '25.2797'], label: '[LTU] Vilnius', img: 'img/flag/lt.svg' },
    { value: ['54.8985', '23.9036'], label: '[LTU] Kaunas', img: 'img/flag/lt.svg' },
    { value: ['55.7033', '21.1443'], label: '[LTU] Klaipėda', img: 'img/flag/lt.svg' },
    { value: ['59.4370', '24.7536'], label: '[EST] Tallinn', img: 'img/flag/ee.svg' },
    { value: ['58.3780', '26.7290'], label: '[EST] Tartu', img: 'img/flag/ee.svg' },
    { value: ['41.2995', '69.2401'], label: '[UZB] Toshkent', img: 'img/flag/uz.svg' },
    { value: ['39.6270', '66.9750'], label: '[UZB] Samarqand', img: 'img/flag/uz.svg' },
    { value: ['39.7681', '64.4556'], label: '[UZB] Buxoro', img: 'img/flag/uz.svg' },
    { value: ['38.5598', '68.7870'], label: '[TJK] Душанбе', img: 'img/flag/tj.svg' },
    { value: ['40.2833', '69.6167'], label: '[TJK] Хуҷанд', img: 'img/flag/tj.svg' },
    { value: ['37.9601', '58.3261'], label: '[TKM] Aşgabat', img: 'img/flag/tm.svg' },
    { value: ['42.8746', '74.5698'], label: '[KGZ] Бишкек', img: 'img/flag/kg.svg' },
    { value: ['40.5392', '72.7929'], label: '[KGZ] Ош', img: 'img/flag/kg.svg' },
    { value: ['52.2297', '21.0122'], label: '[Pol] Warszawa', img: 'img/flag/pl.svg' },
    { value: ['54.3520', '18.6466'], label: '[Pol] Gdańsk', img: 'img/flag/pl.svg' },
    { value: ['50.0647', '19.9450'], label: '[Pol] Kraków', img: 'img/flag/pl.svg' },
    { value: ['51.7592', '19.4559'], label: '[Pol] Łódź', img: 'img/flag/pl.svg' },
    { value: ['51.1079', '17.0385'], label: '[Pol] Wrocław', img: 'img/flag/pl.svg' },
    { value: ['52.4064', '16.9252'], label: '[Pol] Poznań', img: 'img/flag/pl.svg' },
    { value: ['50.0755', '14.4378'], label: '[Cze] Praha', img: 'img/flag/cz.svg' },
    { value: ['49.1951', '16.6068'], label: '[Cze] Brno', img: 'img/flag/cz.svg' },
    { value: ['48.1486', '17.1077'], label: '[Svk] Bratislava', img: 'img/flag/cz.svg' },
    { value: ['48.7164', '21.2611'], label: '[Svk] Košice', img: 'img/flag/cz.svg' },
    { value: ['47.4979', '19.0402'], label: '[Hun] Budapest', img: 'img/flag/hu.svg' },
    { value: ['47.5316', '21.6273'], label: '[Hun] Debrecen', img: 'img/flag/hu.svg' },
    { value: ['46.2530', '20.1414'], label: '[Hun] Szeged', img: 'img/flag/hu.svg' },
    { value: ['44.4268', '26.1025'], label: '[Rom] București', img: 'img/flag/ro.svg' },
    { value: ['46.7712', '23.6236'], label: '[Rom] Cluj-Napoca', img: 'img/flag/ro.svg' },
    { value: ['47.1585', '27.6014'], label: '[Rom] Iași', img: 'img/flag/ro.svg' },
    { value: ['45.7489', '21.2087'], label: '[Rom] Timișoara', img: 'img/flag/ro.svg' },
    { value: ['52.5200', '13.4050'], label: '[Deu] Berlin', img: 'img/flag/de.svg' },
    { value: ['53.5511', '9.9937'], label: '[Deu] Hamburg', img: 'img/flag/de.svg' },
    { value: ['48.1351', '11.5820'], label: '[Deu] München', img: 'img/flag/de.svg' },
    { value: ['50.9375', '6.9603'], label: '[Deu] Köln', img: 'img/flag/de.svg' },
    { value: ['51.3397', '12.3731'], label: '[Deu] Leipzig', img: 'img/flag/de.svg' },
    { value: ['48.2082', '16.3725'], label: '[Aut] Wien', img: 'img/flag/at.svg' },
    { value: ['47.0707', '15.4395'], label: '[Aut] Graz', img: 'img/flag/at.svg' },
    { value: ['44.7866', '20.4489'], label: '[Юго] Белград', img: 'img/flag/yu.svg' },
    { value: ['45.8150', '15.9819'], label: '[Юго] Загреб', img: 'img/flag/yu.svg' },
    { value: ['43.8563', '18.4131'], label: '[Юго] Сараево', img: 'img/flag/yu.svg' },
    { value: ['46.0569', '14.5058'], label: '[Юго] Любляна', img: 'img/flag/yu.svg' },
    { value: ['42.0038', '21.4522'], label: '[Юго] Скопье', img: 'img/flag/yu.svg' },
    { value: ['42.6977', '23.3219'], label: '[Бъл] София', img: 'img/flag/bg.svg' },
    { value: ['42.1354', '24.7453'], label: '[Бъл] Пловдив', img: 'img/flag/bg.svg' },
    { value: ['43.2141', '27.9147'], label: '[Бъл] Варна', img: 'img/flag/bg.svg' },
    { value: ['47.8863', '106.905'], label: '[Мон] Улаанбаатар', img: 'img/flag/mo.svg' },
    ];

    const cWeatherTown = createCustomDropdown(document.getElementById('town-select'), cities, { placeholder: 'Town', searchable: true });
    window.cWeatherTown = cWeatherTown;
    
    // Загружаем сохранённый город из localStorage
    const savedCity = loadSelectedCity();
    if (savedCity && Array.isArray(savedCity) && savedCity.length === 2) {
        console.log('Restoring saved city:', savedCity);
        cWeatherTown.setValue(savedCity);
    } else {
        cWeatherTown.setValue('');
    }
    
    // Обработчик события изменения выбора в кастомном dropdown
    cWeatherTown.addEventListener('change', (event) => {
        const selectedValue = event.detail.value;
        console.log('City selected:', selectedValue);
        
        if (selectedValue && Array.isArray(selectedValue) && selectedValue.length === 2) {
            const [lat, lon] = selectedValue;
            console.log('Saving and updating weather for:', lat, lon);
            // Сохраняем в localStorage
            saveSelectedCity(lat, lon);
            // Сохраняем в settings для синхронизации
            settings.weather.town = selectedValue;
            settings.weather.location = `${lat},${lon}`;
            localStorage.setItem('settings', JSON.stringify(settings));
            saveSettingsToStorage();
            // Обновляем погоду
            updateWeather(lat, lon);
        }
    });
});
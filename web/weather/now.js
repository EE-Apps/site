// URL API
let NOWapiUrl = "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=Europe%2FMoscow&forecast_days=1";

// Получение элементов DOM
const NOWtemperatureElement = document.getElementById("temperature");
const NOWwindSpeedElement = document.getElementById("wind-speed");
const NOWhumidityElement = document.getElementById("humidity");
const NOWpressureElement = document.getElementById("pressure");

// Функция для перевода давления из гПа в мм рт. ст.
function NOWconvertPressureToMmHg(hPa) {
    return (hPa * 0.75006375541921).toFixed(1);
}

// Функция для перевода скорости ветра из км/ч в м/с
function NOWconvertWindSpeedToMps(kmh) {
    return (kmh / 3.6).toFixed(1);
}

// Функция для получения данных и обновления элементов
async function NOWupdateWeatherData(lat, lon) {
    console.log("NOWupdateAll");

    // Формируем URL с координатами
    const NOWapiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=Europe%2FMoscow&forecast_days=1`;

    // Проверка наличия данных в localStorage
    const savedWeatherData = localStorage.getItem('currentWeatherData');
    console.log("load from LS");

    if (savedWeatherData && !navigator.onLine) {
        // Если данные есть в localStorage и нет интернета, показываем сохраненные данные
        const savedData = JSON.parse(savedWeatherData);
        NOWtemperatureElement.textContent = `${savedData.temperature_2m}°`;
        NOWwindSpeedElement.textContent = `${NOWconvertWindSpeedToMps(savedData.wind_speed_10m)} м/с`;
        NOWhumidityElement.textContent = `${savedData.relative_humidity_2m || "н/д"}%`;
        NOWpressureElement.textContent = `${NOWconvertPressureToMmHg(savedData.surface_pressure) || "н/д"} мм рт. ст.`;
        return; // Выходим, если данные загружены из localStorage
    }

    // Если интернет есть, выполняем запрос
    if (navigator.onLine) {
        try {
            const NOWresponse = await fetch(NOWapiUrl);
            if (!NOWresponse.ok) {
                throw new Error(`HTTP error! Status: ${NOWresponse.status}`);
            }

            const NOWdata = await NOWresponse.json();
            const NOWcurrentWeather = NOWdata.current;

            // Проверка наличия данных
            if (NOWcurrentWeather) {
                NOWtemperatureElement.textContent = `${NOWcurrentWeather.temperature_2m}°`;
                NOWwindSpeedElement.textContent = `${NOWconvertWindSpeedToMps(NOWcurrentWeather.wind_speed_10m)} м/с`;
                NOWhumidityElement.textContent = `${NOWcurrentWeather.relative_humidity_2m || "н/д"}%`;
                NOWpressureElement.textContent = `${NOWconvertPressureToMmHg(NOWcurrentWeather.surface_pressure) || "н/д"} мм рт. ст.`;

                // Сохраняем данные в localStorage
                localStorage.setItem('currentWeatherData', JSON.stringify(NOWcurrentWeather));
                console.log("save on LS");
            } else {
                console.error("Нет данных о текущей погоде");
            }
        } catch (NOWerror) {
            console.error("Ошибка при получении данных о погоде:", NOWerror);
        }
    } else {
        // Если интернет отсутствует, показываем сообщение
        console.log("Нет подключения к интернету. Показаны данные из локального хранилища.");
    }
}


// Вызов функции для обновления данных
NOWupdateWeatherData(46.8406, 29.4744);

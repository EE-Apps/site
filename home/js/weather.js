    let cities = [
        // ПМР
        { value: 'Tiraspol', label: '[ПМР] Тирасполь', img: 'img/flag/md.svg', lat: 46.8406, lon: 29.4744 },
        { value: 'Bender', label: '[ПМР] Бендеры', img: 'img/flag/md.svg', lat: 46.1833, lon: 29.0833 },
        { value: 'Rîbnița', label: '[ПМР] Рыбница', img: 'img/flag/md.svg', lat: 47.7686, lon: 29.0000 },
        { value: 'Dubăsari', label: '[ПМР] Дубоссары', img: 'img/flag/md.svg', lat: 47.2656, lon: 29.1667 },

        // Молдова
        { value: 'Chișinău', label: '[Молд] Кишинэу', img: 'img/flag/md.svg', lat: 47.0105, lon: 28.8638 },
        { value: 'Bălți', label: '[Молд] Бэлць', img: 'img/flag/md.svg', lat: 47.7530, lon: 27.9184 },
        { value: 'Cahul', label: '[Молд] Кахул', img: 'img/flag/md.svg', lat: 45.9075, lon: 28.1944 },

        // Украина
        { value: 'Kyiv', label: '[Укр] Київ', img: 'img/flag/ua.svg', lat: 50.4501, lon: 30.5236 },
        { value: 'Brovary', label: '[Укр] Бровари', img: 'img/flag/ua.svg', lat: 50.5110, lon: 30.7909 },
        { value: 'Kharkiv', label: '[Укр] Харків', img: 'img/flag/ua.svg', lat: 49.9935, lon: 36.2304 },
        { value: 'Dnipro', label: '[Укр] Дніпропетровськ', img: 'img/flag/ua.svg', lat: 48.4647, lon: 35.0462 },
        { value: 'Donetsk', label: '[Укр] Донецьк', img: 'img/flag/ua.svg', lat: 48.0159, lon: 37.8029 },
        { value: 'Luhansk', label: '[Укр] Луганськ', img: 'img/flag/ua.svg', lat: 48.5740, lon: 39.3078 },
        { value: 'Zaporizhzhia', label: '[Укр] Запоріжжя', img: 'img/flag/ua.svg', lat: 47.8388, lon: 35.1396 },
        { value: 'Odesa', label: '[Укр] Одеса', img: 'img/flag/ua.svg', lat: 46.4825, lon: 30.7233 },
        { value: 'Mykolaiv', label: '[Укр] Миколаїв', img: 'img/flag/ua.svg', lat: 46.9750, lon: 31.9946 },
        { value: 'Kherson', label: '[Укр] Херсон', img: 'img/flag/ua.svg', lat: 46.6354, lon: 32.6169 },
        { value: 'Lviv', label: '[Укр] Львів', img: 'img/flag/ua.svg', lat: 49.8397, lon: 24.0297 },
        { value: 'Poltava', label: '[Укр] Полтава', img: 'img/flag/ua.svg', lat: 49.5883, lon: 34.5514 },
        { value: 'Chernihiv', label: '[Укр] Чернигів', img: 'img/flag/ua.svg', lat: 51.4982, lon: 31.2893 },
        { value: 'Kryvyi Rih', label: '[Укр] Кривий Ріг', img: 'img/flag/ua.svg', lat: 47.9105, lon: 33.3918 },
        { value: 'Makeevka', label: '[Укр] Макеївка', img: 'img/flag/ua.svg', lat: 48.0708, lon: 37.9578 },
        { value: 'Vinnytsia', label: '[Укр] Винниця', img: 'img/flag/ua.svg', lat: 49.2331, lon: 28.4682 },
        { value: 'Khmelnytskyi', label: '[Укр] Хмельницький', img: 'img/flag/ua.svg', lat: 49.4229, lon: 26.9871 },
        { value: 'Chernivtsi', label: '[Укр] Черновці', img: 'img/flag/ua.svg', lat: 48.2917, lon: 25.9352 },
        { value: 'Zhytomyr', label: '[Укр] Житомир', img: 'img/flag/ua.svg', lat: 50.2546, lon: 28.6587 },
        { value: 'Sumy', label: '[Укр] Суми', img: 'img/flag/ua.svg', lat: 50.9077, lon: 34.7981 },
        { value: 'Kropyvnytskyi', label: '[Укр] Кировоград', img: 'img/flag/ua.svg', lat: 48.5079, lon: 32.2623 },
        { value: 'Ternopil', label: '[Укр] Тернопіль', img: 'img/flag/ua.svg', lat: 49.5535, lon: 25.5948 },
        { value: 'Ivano-Frankivsk', label: '[Укр] Івано-Франківськ', img: 'img/flag/ua.svg', lat: 48.9226, lon: 24.7111 },
        { value: 'Lutsk', label: '[Укр] Луцьк', img: 'img/flag/ua.svg', lat: 50.7472, lon: 25.3254 },
        { value: 'Uzhhorod', label: '[Укр] Ужгород', img: 'img/flag/ua.svg', lat: 48.6208, lon: 22.2879 },
        { value: 'Rivne', label: '[Укр] Рівне', img: 'img/flag/ua.svg', lat: 50.6199, lon: 26.2516 },

        // Крым
        { value: 'Simferopol', label: '[Крым] Симферополь', img: 'img/flag/ru.svg', lat: 44.9521, lon: 34.1024 },
        { value: 'Sevastopol', label: '[Крым] Севастополь', img: 'img/flag/ru.svg', lat: 44.6167, lon: 33.5254 },
        { value: 'Yalta', label: '[Крым] Ялта', img: 'img/flag/ru.svg', lat: 44.4952, lon: 34.1663 },
        { value: 'Kerch', label: '[Крым] Керчь', img: 'img/flag/ru.svg', lat: 45.3567, lon: 36.4744 },

        // Россия
        { value: 'Moscow', label: '[Рос] Москва', img: 'img/flag/ru.svg', lat: 55.7558, lon: 37.6173 },
        { value: 'Saint Petersburg', label: '[Рос] Ленинград', img: 'img/flag/ru.svg', lat: 59.9343, lon: 30.3351 },
        { value: 'Gorky', label: '[Рос] Горький', img: 'img/flag/ru.svg', lat: 56.2965, lon: 43.9361 },
        { value: 'Sverdlovsk', label: '[Рос] Свердловск', img: 'img/flag/ru.svg', lat: 56.8389, lon: 60.6057 },
        { value: 'Kuybyshev', label: '[Рос] Куйбышев', img: 'img/flag/ru.svg', lat: 53.1959, lon: 50.1002 },
        { value: 'Volgograd', label: '[Рос] Волгоград', img: 'img/flag/ru.svg', lat: 48.7080, lon: 44.5133 },
        { value: 'Kazan', label: '[Рос] Казань', img: 'img/flag/ru.svg', lat: 55.7961, lon: 49.1064 },
        { value: 'Chelyabinsk', label: '[Рос] Челябинск', img: 'img/flag/ru.svg', lat: 55.1644, lon: 61.4368 },
        { value: 'Perm', label: '[Рос] Пермь', img: 'img/flag/ru.svg', lat: 58.0105, lon: 56.2502 },
        { value: 'Novosibirsk', label: '[Рос] Новосибирск', img: 'img/flag/ru.svg', lat: 55.0084, lon: 82.9357 },
        { value: 'Omsk', label: '[Рос] Омск', img: 'img/flag/ru.svg', lat: 54.9885, lon: 73.3242 },
        { value: 'Krasnoyarsk', label: '[Рос] Красноярск', img: 'img/flag/ru.svg', lat: 56.0153, lon: 92.8932 },
        { value: 'Irkutsk', label: '[Рос] Иркутск', img: 'img/flag/ru.svg', lat: 52.2871, lon: 104.2810 },
        { value: 'Vladivostok', label: '[Рос] Владивосток', img: 'img/flag/ru.svg', lat: 43.1155, lon: 131.8855 },
        { value: 'Rostov-on-Don', label: '[Рос] Ростов-на-Дону', img: 'img/flag/ru.svg', lat: 47.2224, lon: 39.7189 },
        { value: 'Ufa', label: '[Рос] Уфа', img: 'img/flag/ru.svg', lat: 54.7355, lon: 55.9587 },
        { value: 'Krasnodar', label: '[Рос] Краснодар', img: 'img/flag/ru.svg', lat: 45.0355, lon: 38.9753 },
        { value: 'Voronezh', label: '[Рос] Воронеж', img: 'img/flag/ru.svg', lat: 51.6608, lon: 39.2003 },
        { value: 'Saratov', label: '[Рос] Саратов', img: 'img/flag/ru.svg', lat: 51.5336, lon: 46.0343 },
        { value: 'Tolyatti', label: '[Рос] Тольятти', img: 'img/flag/ru.svg', lat: 53.5078, lon: 49.4204 },
        { value: 'Izhevsk', label: '[Рос] Ижевск', img: 'img/flag/ru.svg', lat: 56.8498, lon: 53.2045 },
        { value: 'Yaroslavl', label: '[Рос] Ярославль', img: 'img/flag/ru.svg', lat: 57.6261, lon: 39.8845 },
        { value: 'Barnaul', label: '[Рос] Барнаул', img: 'img/flag/ru.svg', lat: 53.3548, lon: 83.7698 },
        { value: 'Vladikavkaz', label: '[Рос] Владикавказ', img: 'img/flag/ru.svg', lat: 43.0259, lon: 44.6353 },
        { value: 'Murmansk', label: '[Рос] Мурманск', img: 'img/flag/ru.svg', lat: 68.9707, lon: 33.0759 },
        { value: 'Tula', label: '[Рос] Тула', img: 'img/flag/ru.svg', lat: 54.1930, lon: 37.6178 },
        { value: 'Kemerovo', label: '[Рос] Кемерово', img: 'img/flag/ru.svg', lat: 55.3547, lon: 86.0873 },

        // Казахстан
        { value: 'Almaty', label: '[Каз] Алма-Ата', img: 'img/flag/kz.svg', lat: 43.2389, lon: 76.8897 },
        { value: 'Astana', label: '[Каз] Целиноград', img: 'img/flag/kz.svg', lat: 51.1694, lon: 71.4491 },
        { value: 'Karaganda', label: '[Каз] Караганда', img: 'img/flag/kz.svg', lat: 49.8060, lon: 73.0850 },
        { value: 'Pavlodar', label: '[Каз] Павлодар', img: 'img/flag/kz.svg', lat: 52.2873, lon: 76.9674 },
        { value: 'Ust-Kamenogorsk', label: '[Каз] Усть-Каменогорск', img: 'img/flag/kz.svg', lat: 49.9483, lon: 82.6285 },
        { value: 'Shymkent', label: '[Каз] Чимкент', img: 'img/flag/kz.svg', lat: 42.3150, lon: 69.5850 },
        { value: 'Semipalatinsk', label: '[Каз] Семипалатинск', img: 'img/flag/kz.svg', lat: 50.4230, lon: 80.2434 },
        { value: 'Uralsk', label: '[Каз] Уральск', img: 'img/flag/kz.svg', lat: 51.2278, lon: 51.3866 },
        { value: 'Petropavlovsk', label: '[Каз] Петропавловск', img: 'img/flag/kz.svg', lat: 54.8752, lon: 69.1628 },
        { value: 'Aktobe', label: '[Каз] Актюбинск', img: 'img/flag/kz.svg', lat: 50.3004, lon: 57.1546 },

        // Беларусь
        { value: 'Minsk', label: '[Бел] Минск', img: 'img/flag/by.svg', lat: 53.9000, lon: 27.5667 },
        { value: 'Gomel', label: '[Бел] Гомель', img: 'img/flag/by.svg', lat: 52.4443, lon: 30.9754 },
        { value: 'Mogilev', label: '[Бел] Могилёв', img: 'img/flag/by.svg', lat: 53.9168, lon: 30.3449 },
        { value: 'Vitebsk', label: '[Бел] Витебск', img: 'img/flag/by.svg', lat: 55.1848, lon: 30.2016 },
        { value: 'Grodno', label: '[Бел] Гродно', img: 'img/flag/by.svg', lat: 53.6694, lon: 23.8131 },
        { value: 'Brest', label: '[Бел] Брест', img: 'img/flag/by.svg', lat: 52.0976, lon: 23.7341 },
        { value: 'Bobruysk', label: '[Бел] Бобруйск', img: 'img/flag/by.svg', lat: 53.1384, lon: 29.2214 },
        { value: 'Baranovichi', label: '[Бел] Барановичи', img: 'img/flag/by.svg', lat: 53.1323, lon: 26.0139 },
        { value: 'Borisov', label: '[Бел] Борисов', img: 'img/flag/by.svg', lat: 54.2244, lon: 28.5108 },

        // Кавказ
        { value: 'Tbilisi', label: '[GEO] თბილისი', img: 'img/flag/ge.svg', lat: 41.7151, lon: 44.8271 },
        { value: 'Kutaisi', label: '[GEO] ქუთაისი', img: 'img/flag/ge.svg', lat: 42.2679, lon: 42.6946 },
        { value: 'Yerevan', label: '[ARM] Երևան', img: 'img/flag/am.svg', lat: 40.1792, lon: 44.4991 },
        { value: 'Gyumri', label: '[ARM] Գյումրի', img: 'img/flag/am.svg', lat: 40.7894, lon: 43.8470 },
        { value: 'Baku', label: '[AZE] Bakı', img: 'img/flag/az.svg', lat: 40.4093, lon: 49.8671 },
        { value: 'Ganja', label: '[AZE] Gəncə', img: 'img/flag/az.svg', lat: 40.6828, lon: 46.3606 },

        // Прибалтика
        { value: 'Riga', label: '[LVA] Rīga', img: 'img/flag/lv.svg', lat: 56.9496, lon: 24.1052 },
        { value: 'Daugavpils', label: '[LVA] Daugavpils', img: 'img/flag/lv.svg', lat: 55.8740, lon: 26.5362 },
        { value: 'Vilnius', label: '[LTU] Vilnius', img: 'img/flag/lt.svg', lat: 54.6872, lon: 25.2797 },
        { value: 'Kaunas', label: '[LTU] Kaunas', img: 'img/flag/lt.svg', lat: 54.8985, lon: 23.9036 },
        { value: 'Tallinn', label: '[EST] Tallinn', img: 'img/flag/ee.svg', lat: 59.4370, lon: 24.7536 },
        { value: 'Tartu', label: '[EST] Tartu', img: 'img/flag/ee.svg', lat: 58.3776, lon: 26.7290 },

        // Центральная Азия
        { value: 'Tashkent', label: '[UZB] Toshkent', img: 'img/flag/uz.svg', lat: 41.2995, lon: 69.2401 },
        { value: 'Samarkand', label: '[UZB] Samarqand', img: 'img/flag/uz.svg', lat: 39.6542, lon: 66.9597 },
        { value: 'Dushanbe', label: '[TJK] Душанбе', img: 'img/flag/tj.svg', lat: 38.5598, lon: 68.7870 },
        { value: 'Khujand', label: '[TJK] Хуҷанд', img: 'img/flag/tj.svg', lat: 40.2823, lon: 69.6223 },
        { value: 'Ashgabat', label: '[TKM] Aşgabat', img: 'img/flag/tm.svg', lat: 37.9601, lon: 58.3261 },
        { value: 'Turkmenabat', label: '[TKM] Türkmenabat', img: 'img/flag/tm.svg', lat: 39.0767, lon: 63.6105 },
        { value: 'Bishkek', label: '[KGZ] Бишкек', img: 'img/flag/kg.svg', lat: 42.8746, lon: 74.5698 },
        { value: 'Osh', label: '[KGZ] Ош', img: 'img/flag/kg.svg', lat: 40.5138, lon: 72.8161 },

        // Европа
        { value: 'Warsaw', label: '[POL] Warszawa', img: 'img/flag/pl.svg', lat: 52.2297, lon: 21.0122 },
        { value: 'Krakow', label: '[POL] Kraków', img: 'img/flag/pl.svg', lat: 50.0647, lon: 19.9450 },
        { value: 'Prague', label: '[CZE] Praha', img: 'img/flag/cz.svg', lat: 50.0755, lon: 14.4378 },
        { value: 'Brno', label: '[CZE] Brno', img: 'img/flag/cz.svg', lat: 49.1951, lon: 16.6068 },
        { value: 'Bratislava', label: '[SVK] Bratislava', img: 'img/flag/cz.svg', lat: 48.1486, lon: 17.1077 },
        { value: 'Kosice', label: '[SVK] Košice', img: 'img/flag/cz.svg', lat: 48.7164, lon: 21.2611 },
        { value: 'Budapest', label: '[HUN] Budapest', img: 'img/flag/hu.svg', lat: 47.4979, lon: 19.0402 },
        { value: 'Debrecen', label: '[HUN] Debrecen', img: 'img/flag/hu.svg', lat: 47.5316, lon: 21.6273 },
        { value: 'Bucharest', label: '[ROU] București', img: 'img/flag/ro.svg', lat: 44.4328, lon: 26.1043 },
        { value: 'Cluj-Napoca', label: '[ROU] Cluj-Napoca', img: 'img/flag/ro.svg', lat: 46.7712, lon: 23.6236 },
        { value: 'Berlin', label: '[GER] Berlin', img: 'img/flag/de.svg', lat: 52.5200, lon: 13.4050 },
        { value: 'Munich', label: '[GER] München', img: 'img/flag/de.svg', lat: 48.1351, lon: 11.5820 },
        { value: 'Vienna', label: '[AUT] Wien', img: 'img/flag/at.svg', lat: 48.2082, lon: 16.3738 },
        { value: 'Graz', label: '[AUT] Graz', img: 'img/flag/at.svg', lat: 47.0707, lon: 15.4395 },
        { value: 'Belgrade', label: '[SRB] Белград', img: 'img/flag/yu.svg', lat: 44.8176, lon: 20.4569 },
        { value: 'Zagreb', label: '[HRV] Загреб', img: 'img/flag/yu.svg', lat: 45.8150, lon: 15.9819 },
        { value: 'Ljubljana', label: '[SVN] Любляна', img: 'img/flag/yu.svg', lat: 46.0569, lon: 14.5058 },
        { value: 'Sarajevo', label: '[BIH] Сараево', img: 'img/flag/yu.svg', lat: 43.8563, lon: 18.4131 },
        { value: 'Skopje', label: '[MKD] Skopje', img: 'img/flag/yu.svg', lat: 41.9981, lon: 21.4254 },
        { value: 'Sofia', label: '[BGR] София', img: 'img/flag/bg.svg', lat: 42.6977, lon: 23.3219 },
        { value: 'Plovdiv', label: '[BGR] Пловдив', img: 'img/flag/bg.svg', lat: 42.1354, lon: 24.7453 },
        { value: 'Ulaanbaatar', label: '[MNG] Улаанбаатар', img: 'img/flag/mn.svg', lat: 47.8864, lon: 106.9057 },
        { value: 'Erdenet', label: '[MNG] Эрдэнэт', img: 'img/flag/mn.svg', lat: 49.0340, lon: 104.0567 },{ value: 'Istanbul', label: '[TR] İstanbul', img: 'img/flag/tr.svg', lat: 41.0082, lon: 28.9784 },
        { value: 'Ankara', label: '[TUR] Ankara', img: 'img/flag/tr.svg', lat: 39.9334, lon: 32.8597 },
        { value: 'Izmir', label: '[TUR] İzmir', img: 'img/flag/tr.svg', lat: 38.4192, lon: 27.1287 },
        { value: 'Bursa', label: '[TUR] Bursa', img: 'img/flag/tr.svg', lat: 40.1828, lon: 29.0660 },
        { value: 'Adana', label: '[TUR] Adana', img: 'img/flag/tr.svg', lat: 37.0017, lon: 35.3289 },
        { value: 'Gaziantep', label: '[TUR] Gaziantep', img: 'img/flag/tr.svg', lat: 37.0662, lon: 37.3833 },
        { value: 'Trabzon', label: '[TUR] Trabzon', img: 'img/flag/tr.svg', lat: 41.0027, lon: 39.7178 },
        { value: 'Carsibasi', label: '[TUR] Çarşibaşı', img: 'img/flag/tr.svg', lat: 41.1680, lon: 39.1120 },
        { value: 'Kovanli', label: '[TUR] Kovanlı', img: 'img/flag/tr.svg', lat: 37.9500, lon: 38.4500 },
        { value: 'Antalya', label: '[TUR] Antalya', img: 'img/flag/tr.svg', lat: 36.8969, lon: 30.7133 },
    ];

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

const apiUrl = "https://api.open-meteo.com/v1/forecast?";

/* ============================
   DOM элементы
============================ */
const elements = {
    temperature: document.getElementById("temperature"),
    description: document.getElementById("description"),
    windSpeed: document.getElementById("wind-speed"),
    humidity: document.getElementById("humidity"),
    pressure: document.getElementById("pressure"),
    weatherIcon: document.getElementById("weather-icon"),
};

/* ============================
   Иконки и названия погоды
============================ */
const weatherIcons = {
    0: "weather/ico/clear.svg",
    1: "weather/ico/partly_cloudy.svg",
    2: "weather/ico/cloudy.svg",
    3: "weather/ico/cloudy.svg",
    45: "weather/ico/fog.svg",
    48: "weather/ico/fog.svg",
    51: "weather/ico/light_rain.svg",
    53: "weather/ico/moderate_rain.svg",
    55: "weather/ico/moderate_rain.svg",
    56: "weather/ico/freezing_rain.svg",
    57: "weather/ico/freezingzing_rain.svg",
    61: "weather/ico/showers.svg",
    63: "weather/ico/moderate_rain.svg",
    65: "weather/ico/heavy_rain.svg",
    66: "weather/ico/freezing_rain.svg",
    67: "weather/ico/freezing_rain.svg",
    71: "weather/ico/light_snow.svg",
    73: "weather/ico/moderate_snow.svg",
    75: "weather/ico/heavy_snow.svg",
    77: "weather/ico/snow_showers.svg",
    80: "weather/ico/rain_showers.svg",
    81: "weather/ico/heavy_rain_showers.svg",
    82: "weather/ico/extreme_rain_showers.svg",
    85: "weather/ico/light_snow_showers.svg",
    86: "weather/ico/heavy_snow_showers.svg",
    95: "weather/ico/thunderstorm.svg",
    96: "weather/ico/thunderstorm.svg",
    99: "weather/ico/thunderstorm.svg",
};

const weatherNames = {
    0: "Clear / Ясно",
    1: "Partly cloudy / Частичная облачность",
    2: "Cloudy / Облачно",
    3: "Cloudy / Пасмурно",
    45: "Fog / Туман",
    48: "Frosty fog / Морозный туман",
    51: "Light drizzle / Лёгкий моросящий дождь",
    53: "Drizzling rain / Моросящий дождь",
    55: "Heavy drizzling rain / Сильный моросящий дождь",
    56: "Light freezing rain / Лёгкий ледяной дождь",
    57: "Heavy freezing rain / Сильный ледяной дождь",
    61: "Light rain / Лёгкий дождь",
    63: "Moderate rain / Умеренный дождь",
    65: "Heavy rain / Сильный дождь",
    66: "Light freezing rain / Лёгкий ледяной дождь",
    67: "Heavy freezing rain / Сильный ледяной дождь",
    71: "Light snowfall / Лёгкий снегопад",
    73: "Moderate snowfall / Умеренный снегопад",
    75: "Heavy snowfall / Сильный снегопад",
    77: "Snow grains / Снежные зерна",
    80: "Light shower / Лёгкий ливень",
    81: "Moderate shower / Умеренный ливень",
    82: "Heavy rain / Сильный ливень",
    85: "Light snow / Лёгкий снег",
    86: "Heavy snow / Сильный снег",
    95: "Thunderstorm / Гроза",
    96: "Thunderstorm with small hail / Гроза с небольшим градом",
    99: "Thunderstorm with heavy hail / Гроза с сильным градом",
};

/* ============================
   Утилиты
============================ */
function convertWindSpeedToMps(kmh) {
    return (kmh / 3.6).toFixed(1);
}

function getWeatherIcon(code) {
    return weatherIcons[code] || "weather/ico/default.svg";
}

function getWeatherName(code) {
    return weatherNames[code] || "Нет данных";
}

/* ============================
   Работа с городами
============================ */
function getCityByName(cityName) {
    return cities.find(c => c.value === cityName) || null;
}

/* ============================
   localStorage — город
============================ */
function saveSelectedCity(cityName) {
    localStorage.setItem("selectedCity", cityName);
}

function loadSelectedCity() {
    const cityName = localStorage.getItem("selectedCity");
    return cityName || null;
}

/* ============================
   localStorage — погода (кеш)
============================ */
function saveWeatherData(cityName, weather) {
    const data = {
        cityName,
        temperature: weather.temperature_2m,
        weather_code: weather.weather_code,
        wind_speed: weather.wind_speed_10m,
        humidity: weather.relative_humidity_2m,
        timestamp: Date.now()
    };
    localStorage.setItem("weatherData", JSON.stringify(data));
}

function loadWeatherData() {
    const raw = localStorage.getItem("weatherData");
    if (!raw) return null;

    try {
        const data = JSON.parse(raw);
        if (Date.now() - data.timestamp > 3600000) return null;
        return data;
    } catch {
        return null;
    }
}

function displayWeatherData(data) {
    elements.temperature.textContent = `${Math.round(data.temperature)}°C`;
    elements.description.textContent = getWeatherName(data.weather_code);
    elements.windSpeed.textContent = convertWindSpeedToMps(data.wind_speed);
    elements.humidity.textContent = data.humidity ?? "--";
    elements.weatherIcon.style.backgroundImage =
        `url('${getWeatherIcon(data.weather_code)}')`;
}

/* ============================
   API
============================ */
async function fetchWeather(lat, lon) {
    const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current: "temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,weather_code",
        timezone: "auto"
    });

    const res = await fetch(apiUrl + params);
    if (!res.ok) return null;

    const data = await res.json();
    return data.current;
}

function updateWeatherBackgrounds() {
    const mainEl = document.getElementById('main');
    const weatherEl = document.getElementById('weather');

    if (!mainEl || !weatherEl) return;

    // helper: чистим weather-* классы
    const clearWeatherClasses = el => {
        const toRemove = [...el.classList].filter(
            c => c.startsWith('weather-') && c !== 'weather-widget'
        );
        if (toRemove.length) el.classList.remove(...toRemove);
    };

    // всегда сначала чистим оба контейнера
    clearWeatherClasses(mainEl);
    clearWeatherClasses(weatherEl);

    // если фон погоды выключен полностью — выходим
    if (!settings.weather.background && !settings.weather.pageBackground) return;

    // выбираем цель
    const target = settings.weather.pageBackground
        ? mainEl
        : weatherEl;

    const icon = backgroundWeatherIcons?.[weather?.weather_code];
    if (!icon) return;

    target.classList.add(
        `weather-${icon}`,
        'weather-weather'
    );
}

async function updateWeather(lat, lon, cityName) {
    const weather = await fetchWeather(lat, lon);
    window.weather = weather;
    if (!weather) return;

    elements.temperature.textContent = `${Math.round(weather.temperature_2m)}°C`;
    elements.description.textContent = getWeatherName(weather.weather_code);
    elements.windSpeed.textContent = convertWindSpeedToMps(weather.wind_speed_10m);
    elements.humidity.textContent = weather.relative_humidity_2m ?? "--";
    elements.weatherIcon.style.backgroundImage =
        `url('${getWeatherIcon(weather.weather_code)}')`;
    
    updateWeatherBackgrounds()

    saveWeatherData(cityName, weather);
}

/* ============================
   Кнопка обновления
============================ */
document.getElementById("update-weather").addEventListener("click", () => {
    const cityName = loadSelectedCity();
    const city = getCityByName(cityName);
    if (city) updateWeather(city.lat, city.lon, city.value);
});

/* ============================
   Инициализация
============================ */
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('town-select');
    if (!container) {
        console.error('town-select not found');
        return;
    }

    const dropdown = createCustomDropdown(
        container,
        cities,
        { placeholder: 'Town', searchable: true }
    );

    window.cWeatherTown = dropdown;

    /* ============================
       settings init (ВАЖНО)
    ============================ */
    if (typeof settings !== 'object') {
        console.error('settings is not defined');
        return;
    }

    if (!settings.weather) settings.weather = {};

    /* ============================
       начальный город
    ============================ */
    let cityValue =
        settings.weather.townName ||
        loadSelectedCity() ||
        cities[0].value;

    let city = getCityByName(cityValue) || cities[0];

    // ❗ ТОЛЬКО value
    dropdown.setValue(city.value);

    saveSelectedCity(city.value);

    /* ============================
       кеш погоды
    ============================ */
    const cached = loadWeatherData();
    if (cached && cached.cityName === city.value) {
        displayWeatherData(cached);
    } else {
        updateWeather(city.lat, city.lon, city.value);
    }
        updateWeather(city.lat, city.lon, city.value);

    /* ============================
       смена города
    ============================ */
    dropdown.addEventListener('change', (e) => {
        const value = e.detail.value;   // ← value
        const cityObj = getCityByName(value);
        if (!cityObj) return;

        // localStorage
        saveSelectedCity(cityObj.value);

        // settings
        settings.weather.townName = cityObj.value;
        settings.weather.location = `${cityObj.lat},${cityObj.lon}`;

        saveSettingsToStorage();

        updateWeather(cityObj.lat, cityObj.lon, cityObj.value);
    });

    
    makeWeatherReactive(settings);
});


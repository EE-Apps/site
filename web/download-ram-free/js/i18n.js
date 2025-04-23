const translations = {
    en: {
        brand: 'DownloadRAM',
        'hero.title': 'Download More RAM Instantly!',
        'hero.subtitle': 'Upgrade your computer\'s memory with our revolutionary cloud-based RAM technology',
        'config.title': 'Configure Your RAM Download',
        'config.type': 'RAM Type:',
        'config.amount': 'Amount of RAM:',
        'config.download': 'Download RAM',
        'premium.title': 'Go Premium',
        'premium.feature1': 'Unlimited RAM Downloads',
        'premium.feature2': 'Priority Download Speed',
        'premium.feature3': 'Advanced RAM Types',
        'premium.feature4': '24/7 Support',
        'premium.button': 'Upgrade to Premium',
        'modal.downloading': 'Downloading RAM...',
        'modal.success': 'RAM successfully downloaded! Your device now has {total}GB RAM ({current}GB + {downloaded}GB)',
        'modal.device.memory': 'Current device RAM: {ram}GB',
        'modal.unsupported': 'Could not detect device RAM',
        'modal.error': 'Download failed. Please try again.',
        'premium.error': 'Premium service temporarily unavailable.',
        'premium.success': 'Welcome to Premium!',
        'modal.premium.required': 'Premium required for multiple RAM downloads'
    },
    ru: {
        brand: 'DownloadRAM',
        'hero.title': 'Скачайте больше оперативной памяти!',
        'hero.subtitle': 'Увеличьте память компьютера с помощью нашей революционной облачной технологии',
        'config.title': 'Настройка загрузки RAM',
        'config.type': 'Тип RAM:',
        'config.amount': 'Количество RAM:',
        'config.download': 'Скачать RAM',
        'premium.title': 'Премиум версия',
        'premium.feature1': 'Безлимитная загрузка RAM',
        'premium.feature2': 'Приоритетная скорость',
        'premium.feature3': 'Продвинутые типы RAM',
        'premium.feature4': 'Поддержка 24/7',
        'premium.button': 'Получить Премиум',
        'modal.downloading': 'Загрузка RAM...',
        'modal.success': 'RAM успешно загружен! Теперь у вашего устройства {total}GB RAM ({current}GB + {downloaded}GB)',
        'modal.device.memory': 'Текущая RAM устройства: {ram}GB',
        'modal.unsupported': 'Не удалось определить RAM устройства',
        'modal.error': 'Ошибка загрузки. Попробуйте снова.',
        'premium.error': 'Премиум сервис временно недоступен.',
        'premium.success': 'Добро пожаловать в Премиум!',
        'modal.premium.required': 'Требуется премиум для многократной загрузки RAM'
    },
    ua: {
        brand: 'DownloadRAM',
        'hero.title': 'Завантажте більше оперативної пам\'яті!',
        'hero.subtitle': 'Збільште пам\'ять комп\'ютера за допомогою нашої революційної хмарної технології',
        'config.title': 'Налаштування завантаження RAM',
        'config.type': 'Тип RAM:',
        'config.amount': 'Кількість RAM:',
        'config.download': 'Завантажити RAM',
        'premium.title': 'Преміум версія',
        'premium.feature1': 'Безлімітне завантаження RAM',
        'premium.feature2': 'Пріоритетна швидкість',
        'premium.feature3': 'Просунуті типи RAM',
        'premium.feature4': 'Підтримка 24/7',
        'premium.button': 'Отримати Преміум',
        'modal.downloading': 'Завантаження RAM...',
        'modal.success': 'RAM успішно завантажено! Тепер у вашого пристрою {total}GB RAM ({current}GB + {downloaded}GB)',
        'modal.device.memory': 'Поточна RAM пристрою: {ram}GB',
        'modal.unsupported': 'Не вдалося визначити RAM пристрою',
        'modal.error': 'Помилка завантаження. Спробуйте ще раз.',
        'premium.error': 'Преміум сервіс тимчасово недоступний.',
        'premium.success': 'Ласкаво просимо до Преміум!',
        'modal.premium.required': 'Потрібен преміум для багаторазового завантаження RAM'
    }
};

const i18n = {
    currentLang: 'en',
    
    init() {
        this.updateContent();
        document.getElementById('language').addEventListener('change', (e) => {
            this.currentLang = e.target.value;
            this.updateContent();
        });
    },

    t(key) {
        return translations[this.currentLang][key] || key;
    },

    updateContent() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    i18n.init();
});
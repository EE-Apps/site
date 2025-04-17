class Converter {
    constructor() {
        this.setupConverterPage();
    }

    setupConverterPage() {
        const converterPage = document.getElementById('converter');
        converterPage.innerHTML = `
            <div class="converter-container">
                <select id="converter-type">
                    <option value="length">Длина</option>
                    <option value="weight">Вес</option>
                    <option value="temperature">Температура</option>
                    <option value="time">Время</option>
                </select>
                
                <div class="converter-input">
                    <input type="number" id="from-value">
                    <select id="from-unit"></select>
                </div>
                
                <button id="swap-units">⇄</button>
                
                <div class="converter-input">
                    <input type="number" id="to-value" readonly>
                    <select id="to-unit"></select>
                </div>
            </div>
        `;

        this.setupEventListeners();
        this.updateUnitOptions('length');
    }

    setupEventListeners() {
        const converterType = document.getElementById('converter-type');
        const fromValue = document.getElementById('from-value');
        const fromUnit = document.getElementById('from-unit');
        const toUnit = document.getElementById('to-unit');
        const swapButton = document.getElementById('swap-units');

        converterType.addEventListener('change', () => {
            this.updateUnitOptions(converterType.value);
            this.convert();
        });

        fromValue.addEventListener('input', () => this.convert());
        fromUnit.addEventListener('change', () => this.convert());
        toUnit.addEventListener('change', () => this.convert());
        
        swapButton.addEventListener('click', () => {
            const tempValue = fromUnit.value;
            fromUnit.value = toUnit.value;
            toUnit.value = tempValue;
            this.convert();
        });
    }

    updateUnitOptions(type) {
        const units = this.getUnits(type);
        const fromUnit = document.getElementById('from-unit');
        const toUnit = document.getElementById('to-unit');

        fromUnit.innerHTML = '';
        toUnit.innerHTML = '';

        units.forEach(unit => {
            fromUnit.innerHTML += `<option value="${unit.value}">${unit.label}</option>`;
            toUnit.innerHTML += `<option value="${unit.value}">${unit.label}</option>`;
        });

        // Устанавливаем разные начальные значения
        if (units.length > 1) {
            toUnit.selectedIndex = 1;
        }
    }

    getUnits(type) {
        switch (type) {
            case 'length':
                return [
                    { value: 'm', label: 'Метры' },
                    { value: 'km', label: 'Километры' },
                    { value: 'cm', label: 'Сантиметры' },
                    { value: 'mm', label: 'Миллиметры' },
                    { value: 'in', label: 'Дюймы' },
                    { value: 'ft', label: 'Футы' },
                    { value: 'yd', label: 'Ярды' },
                    { value: 'mi', label: 'Мили' }
                ];
            case 'weight':
                return [
                    { value: 'kg', label: 'Килограммы' },
                    { value: 'g', label: 'Граммы' },
                    { value: 'mg', label: 'Миллиграммы' },
                    { value: 'lb', label: 'Фунты' },
                    { value: 'oz', label: 'Унции' }
                ];
            case 'temperature':
                return [
                    { value: 'c', label: 'Цельсий' },
                    { value: 'f', label: 'Фаренгейт' },
                    { value: 'k', label: 'Кельвин' }
                ];
            case 'time':
                return [
                    { value: 's', label: 'Секунды' },
                    { value: 'min', label: 'Минуты' },
                    { value: 'h', label: 'Часы' },
                    { value: 'd', label: 'Дни' },
                    { value: 'w', label: 'Недели' },
                    { value: 'mo', label: 'Месяцы' },
                    { value: 'y', label: 'Годы' }
                ];
            default:
                return [];
        }
    }

    convert() {
        const fromValue = parseFloat(document.getElementById('from-value').value) || 0;
        const fromUnit = document.getElementById('from-unit').value;
        const toUnit = document.getElementById('to-unit').value;
        const type = document.getElementById('converter-type').value;

        let result = fromValue;

        // Конвертируем в базовую единицу
        result = this.toBaseUnit(result, fromUnit, type);
        // Конвертируем из базовой единицы в целевую
        result = this.fromBaseUnit(result, toUnit, type);

        document.getElementById('to-value').value = result.toFixed(6);
    }

    toBaseUnit(value, unit, type) {
        // Конвертация в базовую единицу (метры, килограммы, цельсий, секунды)
        switch (type) {
            case 'length':
                switch (unit) {
                    case 'km': return value * 1000;
                    case 'cm': return value * 0.01;
                    case 'mm': return value * 0.001;
                    case 'in': return value * 0.0254;
                    case 'ft': return value * 0.3048;
                    case 'yd': return value * 0.9144;
                    case 'mi': return value * 1609.344;
                    default: return value;
                }
            case 'weight':
                switch (unit) {
                    case 'g': return value * 0.001;
                    case 'mg': return value * 0.000001;
                    case 'lb': return value * 0.45359237;
                    case 'oz': return value * 0.028349523125;
                    default: return value;
                }
            case 'temperature':
                switch (unit) {
                    case 'f': return (value - 32) * 5/9;
                    case 'k': return value - 273.15;
                    default: return value;
                }
            case 'time':
                switch (unit) {
                    case 'min': return value * 60;
                    case 'h': return value * 3600;
                    case 'd': return value * 86400;
                    case 'w': return value * 604800;
                    case 'mo': return value * 2592000;
                    case 'y': return value * 31536000;
                    default: return value;
                }
            default:
                return value;
        }
    }

    fromBaseUnit(value, unit, type) {
        // Конвертация из базовой единицы
        switch (type) {
            case 'length':
                switch (unit) {
                    case 'km': return value / 1000;
                    case 'cm': return value / 0.01;
                    case 'mm': return value / 0.001;
                    case 'in': return value / 0.0254;
                    case 'ft': return value / 0.3048;
                    case 'yd': return value / 0.9144;
                    case 'mi': return value / 1609.344;
                    default: return value;
                }
            case 'weight':
                switch (unit) {
                    case 'g': return value / 0.001;
                    case 'mg': return value / 0.000001;
                    case 'lb': return value / 0.45359237;
                    case 'oz': return value / 0.028349523125;
                    default: return value;
                }
            case 'temperature':
                switch (unit) {
                    case 'f': return (value * 9/5) + 32;
                    case 'k': return value + 273.15;
                    default: return value;
                }
            case 'time':
                switch (unit) {
                    case 'min': return value / 60;
                    case 'h': return value / 3600;
                    case 'd': return value / 86400;
                    case 'w': return value / 604800;
                    case 'mo': return value / 2592000;
                    case 'y': return value / 31536000;
                    default: return value;
                }
            default:
                return value;
        }
    }
}

// Инициализация конвертера
document.addEventListener('DOMContentLoaded', () => {
    window.converter = new Converter();
}); 
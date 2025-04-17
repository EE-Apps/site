class Calculator {
    constructor() {
        this.expression = '';
        this.currentNumber = '0';
        this.result = '0';
        this.system = 'DEC';
        this.isCalculated = false;
        this.currentExpression = '0';
        this.currentKeypadSize = '4x5';

        this.displayExpression = document.querySelector('.expression');
        this.displayResult = document.querySelector('.result');
        this.customBaseInput = null; // Удаляем ссылку на элемент
        
        this.initializeEventListeners();

        this.validDigits = {
            'DEC': /[0-9]/,
            'HEX': /[0-9A-Fa-f]/,
            'OCT': /[0-7]/,
            'BIN': /[0-1]/
        };

        // Добавляем математические константы
        this.constants = {
            'π': Math.PI,
            'e': Math.E
        };

        this.integralSteps = 1000; // Количество шагов для численного интегрирования
    }

    initializeEventListeners() {
        // Number buttons
        document.querySelectorAll('.calc-btn.number').forEach(button => {
            button.addEventListener('click', () => this.handleNumber(button.textContent));
        });

        // Operator buttons
        document.querySelectorAll('.calc-btn.operator').forEach(button => {
            button.addEventListener('click', () => this.handleOperator(button.textContent));
        });

        // Function buttons
        document.querySelectorAll('.calc-btn.function').forEach(button => {
            button.addEventListener('click', () => this.handleFunction(button.textContent));
        });

        // System type buttons
        document.querySelectorAll('.system-type span:not(.custom-base)').forEach(button => {
            button.addEventListener('click', () => this.switchSystem(button.textContent));
        });
    }

    handleNumber(num) {
        if (this.isCalculated) {
            this.currentExpression = '0';
            this.result = '0';
            this.isCalculated = false;
            this.displayResult.classList.remove('equals');
        }

        // Обработка констант
        if (this.constants.hasOwnProperty(num)) {
            if (this.currentExpression === '0') {
                this.currentExpression = this.constants[num].toString();
            } else {
                this.currentExpression += this.constants[num].toString();
            }
            this.updateDisplay();
            return;
        }

        // Проверка допустимости цифры для текущей системы
        if (this.system !== 'CUSTOM') {
            if (!this.validDigits[this.system].test(num)) {
                return; // Игнорируем недопустимые цифры
            }
        } else {
            const base = parseInt(this.customBaseInput.value);
            const maxDigit = base <= 10 ? base - 1 : '9';
            const validChars = base > 10 
                ? `[0-9A-${String.fromCharCode(55 + base - 10)}]`
                : `[0-${maxDigit}]`;
            if (!new RegExp(validChars, 'i').test(num)) {
                return;
            }
        }

        if (this.currentExpression === '0' && num !== '.') {
            this.currentExpression = num;
        } else {
            this.currentExpression += num;
        }
        
        this.updateDisplay();
    }

    handleOperator(operator) {
        if (operator === '=') {
            this.calculate();
            return;
        }

        if (operator === 'x!') {
            this.currentExpression += '!';
            this.updateDisplay();
            return;
        }

        const operatorMap = {
            '×': '*',
            '÷': '/',
            'mod': '%',
            '^': '**',
            'sin': 'Math.sin(',
            'cos': 'Math.cos(',
            'tan': 'Math.tan(',
            'ctan': '1/Math.tan(',
            'log': 'Math.log10(',
            'ln': 'Math.log(',
            'exp': 'Math.exp(',
            'sinh': 'Math.sinh(',
            'cosh': 'Math.cosh(',
            'tanh': 'Math.tanh(',
            'ctanh': '1/Math.tanh(',
            '√': 'Math.sqrt(',
            'y√': '**0.5',
            'x!': '!'
        };

        let opToAdd = operatorMap[operator] || operator;
        
        if (this.currentExpression !== '0') {
            // Убираем особую обработку функций, теперь все операторы добавляются как есть
            this.currentExpression += opToAdd;
            this.updateDisplay();
        } else {
            // Если выражение пустое, и это функция - добавляем её
            if (['Math.sin(', 'Math.cos(', 'Math.tan(', '1/Math.tan(', 'Math.log10(',
                'Math.log(', 'Math.exp(', 'Math.sinh(', 'Math.cosh(', 'Math.tanh(',
                '1/Math.tanh(', 'Math.sqrt('].includes(opToAdd)) {
                this.currentExpression = opToAdd;
                this.updateDisplay();
            }
        }
    }

    handleFunction(func) {
        switch (func) {
            case 'AC':
                this.clear();
                break;
            case '⌫':
                this.backspace();
                break;
            case '±':
                this.toggleSign();
                break;
            case '=':
                this.calculate();
                break;
            case '⇱':
                this.switchKeypad('up');
                break;
            case '⇲':
                this.switchKeypad('down');
                break;
        }
    }

    switchSystem(newSystem) {
        if (newSystem === this.system) return;

        // Сохраняем текущее выражение и результат в десятичной системе
        let decimalExpression = '';
        if (this.currentExpression !== '0') {
            decimalExpression = this.currentExpression.split(' ').map(part => {
                if (this.isNumber(part)) {
                    return this.toDecimal(part, this.system);
                }
                return part;
            }).join(' ');
        }

        // Обновляем UI
        document.querySelectorAll('.system-type span').forEach(span => {
            span.classList.remove('active');
        });
        if (newSystem === 'CUSTOM') {
            document.querySelector('.system-type .custom-base').classList.add('active');
        } else {
            document.querySelectorAll('.system-type span:not(.custom-base)').forEach(span => {
                if (span.textContent === newSystem) {
                    span.classList.add('active');
                }
            });
        }

        // Меняем систему и конвертируем выражение
        this.system = newSystem;
        if (decimalExpression) {
            this.currentExpression = decimalExpression.split(' ').map(part => {
                const num = parseFloat(part);
                return isNaN(num) ? part : this.fromDecimal(num, newSystem);
            }).join(' ');
        }

        // Конвертируем результат если есть
        if (this.isCalculated && this.result !== '0' && this.result !== 'Error') {
            const decimalResult = parseFloat(this.result);
            this.result = this.fromDecimal(decimalResult, newSystem);
        }

        this.updateDisplay();
    }

    switchKeypad(direction) {
        const sizes = ['4x5', '5x6', '6x7'];
        const currentIndex = sizes.indexOf(this.currentKeypadSize);
        
        if (direction === 'up' && currentIndex < sizes.length - 1) {
            this.activateKeypad(sizes[currentIndex + 1]);
        } else if (direction === 'down' && currentIndex > 0) {
            this.activateKeypad(sizes[currentIndex - 1]);
        }
    }

    activateKeypad(size) {
        document.querySelector(`#keypad-${this.currentKeypadSize}`).classList.remove('active');
        document.querySelector(`#keypad-${size}`).classList.add('active');
        this.currentKeypadSize = size;
    }

    parseNumber(num, system) {
        switch (system) {
            case 'HEX': return parseInt(num, 16);
            case 'OCT': return parseInt(num, 8);
            case 'BIN': return parseInt(num, 2);
            default: return parseFloat(num);
        }
    }

    formatNumber(num, system) {
        switch (system) {
            case 'HEX': return Math.floor(num).toString(16).toUpperCase();
            case 'OCT': return Math.floor(num).toString(8);
            case 'BIN': return Math.floor(num).toString(2);
            default: return num.toString();
        }
    }

    isNumber(str) {
        if (str === undefined || str === null) return false;
        // Расширенная проверка для разных систем счисления
        const hexRegex = /^-?[0-9A-Fa-f]+$/;
        const octRegex = /^-?[0-7]+$/;
        const binRegex = /^-?[01]+$/;
        const decRegex = /^-?\d+(\.\d+)?$/;

        switch (this.system) {
            case 'HEX': return hexRegex.test(str);
            case 'OCT': return octRegex.test(str);
            case 'BIN': return binRegex.test(str);
            default: return decRegex.test(str);
        }
    }

    toDecimal(num, fromSystem) {
        if (!num || typeof num !== 'string') return 0;
        const isNegative = num.startsWith('-');
        const absNum = isNegative ? num.slice(1) : num;

        let decimal;
        switch (fromSystem) {
            case 'HEX': decimal = parseInt(absNum, 16); break;
            case 'OCT': decimal = parseInt(absNum, 8); break;
            case 'BIN': decimal = parseInt(absNum, 2); break;
            default: decimal = parseFloat(absNum);
        }

        return isNegative ? -decimal : decimal;
    }

    fromDecimal(decimal, toSystem) {
        if (isNaN(decimal)) return '0';
        const isNegative = decimal < 0;
        const absNum = Math.abs(decimal);
        
        let result;
        switch (toSystem) {
            case 'HEX': result = Math.floor(absNum).toString(16).toUpperCase(); break;
            case 'OCT': result = Math.floor(absNum).toString(8); break;
            case 'BIN': result = Math.floor(absNum).toString(2); break;
            default: result = absNum.toString();
        }

        return isNegative ? '-' + result : result;
    }

    calculate() {
        try {
            let decimalExpression = this.currentExpression;

            // Добавляем закрывающие скобки для незакрытых функций
            const openBrackets = (decimalExpression.match(/\(/g) || []).length;
            const closeBrackets = (decimalExpression.match(/\)/g) || []).length;
            if (openBrackets > closeBrackets) {
                decimalExpression += ')'.repeat(openBrackets - closeBrackets);
            }

            // Остальная обработка остаётся той же
            decimalExpression = decimalExpression.replace(/(-?\d+)!/g, (match, num) => {
                return this.factorial(parseInt(num));
            });

            // Преобразуем в десятичную систему
            decimalExpression = decimalExpression.split(' ').map(part => {
                if (this.isNumber(part)) {
                    return this.toDecimal(part, this.system);
                }
                return part;
            }).join(' ');

            const result = eval(decimalExpression);
            this.result = this.fromDecimal(result, this.system);
            this.isCalculated = true;
            this.displayResult.classList.add('equals');
        } catch (error) {
            console.error('Calculation error:', error);
            this.result = 'Error';
        }
        this.updateDisplay();
    }

    evaluateExpression(expr) {
        try {
            return eval(expr);
        } catch {
            return 0;
        }
    }

    factorial(n) {
        if (isNaN(n) || n < 0) return NaN;
        if (n === 0) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    clear() {
        this.currentExpression = '0';
        this.result = '0';
        this.isCalculated = false;
        this.displayResult.classList.remove('equals');
        this.updateDisplay();
    }

    backspace() {
        if (this.currentExpression.length > 1) {
            this.currentExpression = this.currentExpression.slice(0, -1);
        } else {
            this.currentExpression = '0';
        }
        this.updateDisplay();
    }

    toggleSign() {
        if (this.currentExpression === '0') return;

        // Разбиваем выражение на части, сохраняя разделители
        const parts = this.currentExpression.split(/([+\-*/()^])/);
        
        // Находим последнее число
        let lastNumberIndex = parts.length - 1;
        while (lastNumberIndex >= 0 && !this.isNumber(parts[lastNumberIndex].trim())) {
            lastNumberIndex--;
        }

        if (lastNumberIndex >= 0) {
            const num = parts[lastNumberIndex].trim();
            // Переключаем знак числа
            parts[lastNumberIndex] = num.startsWith('-') ? num.slice(1) : '-' + num;
            // Собираем выражение обратно
            this.currentExpression = parts.join('');
            this.updateDisplay();
        }
    }

    updateDisplay() {
        this.displayExpression.textContent = this.currentExpression;
        this.displayResult.textContent = this.isCalculated ? this.result : '';
    }
}

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.calculator = new Calculator();
});

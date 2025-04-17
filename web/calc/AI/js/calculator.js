class Calculator {
    constructor() {
        this.currentSystem = 10;
        this.expression = '';
        this.result = '0';
        this.history = [];
        this.memory = 0;
        this.isEquals = false;
        this.keypadLayouts = {
            '4x5': {
                columns: 4,
                rows: 5,
                buttons: [
                    { text: 'AC', class: 'function' },
                    { text: '⌫', value: 'backspace', class: 'function' },
                    { text: '±', class: 'function' },
                    { text: '÷', value: '/', class: 'operator' },
                    { text: '7', class: 'number' },
                    { text: '8', class: 'number' },
                    { text: '9', class: 'number' },
                    { text: '×', value: '*', class: 'operator' },
                    { text: '4', class: 'number' },
                    { text: '5', class: 'number' },
                    { text: '6', class: 'number' },
                    { text: '-', class: 'operator' },
                    { text: '1', class: 'number' },
                    { text: '2', class: 'number' },
                    { text: '3', class: 'number' },
                    { text: '+', class: 'operator' },
                    { text: '⇱', value: 'size-up', class: 'function' },
                    { text: '0', class: 'number' },
                    { text: '.', class: 'number' },
                    { text: '=', class: 'operator' }
                ]
            },
            '5x6': {
                columns: 5,
                rows: 6,
                buttons: [
                    { text: 'xⁿ', value: 'pow', class: 'function' },
                    { text: '%', class: 'function' },
                    { text: 'ⁿ√', value: 'nroot', class: 'function' },
                    { text: '(', class: 'function' },
                    { text: ')', class: 'function' },
                    { text: '√', value: 'sqrt', class: 'function' },
                    { text: 'AC', class: 'function' },
                    { text: '⌫', value: 'backspace', class: 'function' },
                    { text: '±', class: 'function' },
                    { text: '÷', value: '/', class: 'operator' },
                    { text: '∫', value: 'integral', class: 'function' },
                    { text: '7', class: 'number' },
                    { text: '8', class: 'number' },
                    { text: '9', class: 'number' },
                    { text: '×', value: '*', class: 'operator' },
                    { text: 'mod', class: 'operator' },
                    { text: '4', class: 'number' },
                    { text: '5', class: 'number' },
                    { text: '6', class: 'number' },
                    { text: '-', class: 'operator' },
                    { text: 'x', class: 'function' },
                    { text: '1', class: 'number' },
                    { text: '2', class: 'number' },
                    { text: '3', class: 'number' },
                    { text: '+', class: 'operator' },
                    { text: '⇱', value: 'size-up', class: 'function' },
                    { text: '⇲', value: 'size-down', class: 'function' },
                    { text: '0', class: 'number' },
                    { text: '.', class: 'number' },
                    { text: '=', class: 'operator' }
                ]
            },
            '6x7': {
                columns: 6,
                rows: 7,
                buttons: [
                    { text: 'sin', class: 'function' },
                    { text: 'cos', class: 'function' },
                    { text: 'tan', class: 'function' },
                    { text: 'ctan', class: 'function' },
                    { text: 'log', class: 'function' },
                    { text: 'exp', class: 'function' },
                    { text: 'sinh', class: 'function' },
                    { text: 'cosh', class: 'function' },
                    { text: 'tanh', class: 'function' },
                    { text: 'ctanh', class: 'function' },
                    { text: '(', class: 'function' },
                    { text: ')', class: 'function' },
                    { text: '√', value: 'sqrt', class: 'function' },
                    { text: 'ⁿ√', value: 'nroot', class: 'function' },
                    { text: 'AC', class: 'function' },
                    { text: '⌫', value: 'backspace', class: 'function' },
                    { text: '±', class: 'function' },
                    { text: '÷', value: '/', class: 'operator' },
                    { text: '∫', value: 'integral', class: 'function' },
                    { text: '%', class: 'function' },
                    { text: '7', class: 'number' },
                    { text: '8', class: 'number' },
                    { text: '9', class: 'number' },
                    { text: '×', value: '*', class: 'operator' },
                    { text: 'mod', class: 'operator' },
                    { text: 'xⁿ', value: 'pow', class: 'function' },
                    { text: '4', class: 'number' },
                    { text: '5', class: 'number' },
                    { text: '6', class: 'number' },
                    { text: '-', class: 'operator' },
                    { text: 'x', class: 'function' },
                    { text: 'y', class: 'function' },
                    { text: '1', class: 'number' },
                    { text: '2', class: 'number' },
                    { text: '3', class: 'number' },
                    { text: '+', class: 'operator' },
                    { text: '⇲', value: 'size-down', class: 'function' },
                    { text: 'e', class: 'function' },
                    { text: 'π', value: 'pi', class: 'function' },
                    { text: '0', class: 'number' },
                    { text: '.', class: 'number' },
                    { text: '=', class: 'operator' }
                ]
            }
        };
        this.setupKeypad();
        this.setupEventListeners();
    }

    setupKeypad(size = '4x5') {
        const keypad = document.getElementById('keypad-4x5');
        const layout = this.keypadLayouts[size];
        
        keypad.innerHTML = '';
        keypad.style.gridTemplateColumns = `repeat(${layout.columns}, 1fr)`;
        keypad.style.gridTemplateRows = `repeat(${layout.rows}, 1fr)`;
        
        layout.buttons.forEach(btn => {
            const button = document.createElement('button');
            button.textContent = btn.text;
            button.className = `calc-btn ${btn.class}`;
            button.addEventListener('click', () => this.handleInput(btn.value || btn.text));
            keypad.appendChild(button);
        });
    }

    setupEventListeners() {
        // Системы счисления
        document.querySelectorAll('.system-type span').forEach(span => {
            span.addEventListener('click', () => {
                const systems = { 'BIN': 2, 'DEC': 10, 'OCT': 8, 'HEX': 16 };
                document.querySelector('.system-type span.active').classList.remove('active');
                span.classList.add('active');
                this.currentSystem = systems[span.textContent];
                this.updateDisplay();
            });
        });

        // Быстрые действия
        document.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.textContent;
                switch (action) {
                    case 'MC':
                        this.memory = 0;
                        break;
                    case 'MR':
                        if (this.memory !== 0) {
                            this.expression = this.expression + this.memory.toString();
                            this.updateDisplay();
                        }
                        break;
                    case 'M+':
                        try {
                            const currentValue = this.expression ? eval(this.expression) : 0;
                            this.memory += currentValue;
                        } catch (err) {
                            console.error('Error in M+ operation:', err);
                        }
                        break;
                    case 'M-':
                        try {
                            const currentValue = this.expression ? eval(this.expression) : 0;
                            this.memory -= currentValue;
                        } catch (err) {
                            console.error('Error in M- operation:', err);
                        }
                        break;
                }
            });
        });

        // Клавиатура
        document.addEventListener('keydown', (e) => {
            const key = e.key;
            const validKeys = '0123456789.+-*/()=Enter Backspace'.split('');
            if (validKeys.includes(key)) {
                e.preventDefault();
                if (key === 'Enter') {
                    this.handleInput('=');
                } else if (key === 'Backspace') {
                    this.handleInput('⌫');
                } else {
                    this.handleInput(key);
                }
            }
        });

        // Размер клавиатуры
        document.getElementById('keypad-size-select')?.addEventListener('change', (e) => {
            this.setupKeypad(e.target.value);
        });
    }

    calculateResult() {
        try {
            let evalExpression = this.expression;
            if (this.currentSystem !== 10) {
                evalExpression = evalExpression.replace(/[0-9A-Fa-f]+/g, match => 
                    parseInt(match, this.currentSystem).toString()
                );
            }
            const result = eval(evalExpression);
            return this.currentSystem !== 10 ? 
                parseInt(result).toString(this.currentSystem).toUpperCase() : 
                result.toString();
        } catch (err) {
            return 'Ошибка';
        }
    }

    handleInput(value) {
        this.isEquals = false;
        
        switch (value) {
            case 'AC':
                this.expression = '';
                this.result = '0';
                break;
            case '⌫':
                this.expression = this.expression.slice(0, -1);
                break;
            case '±':
                try {
                    if (this.expression === '') {
                        this.expression = '-';
                    } else {
                        const lastNumber = this.expression.match(/-?\d*\.?\d+$/);
                        if (lastNumber) {
                            const start = this.expression.slice(0, lastNumber.index);
                            const number = lastNumber[0];
                            this.expression = start + (number.startsWith('-') ? number.slice(1) : '-' + number);
                        }
                    }
                } catch (err) {
                    console.error('Error in ± operation:', err);
                }
                break;
            case '=':
                this.result = this.calculateResult();
                if (this.result !== 'Ошибка') {
                    this.history.push({ expression: this.expression, result: this.result });
                    this.expression = this.result;
                    this.isEquals = true;
                }
                break;
            default:
                if (/[0-9A-Fa-f.]/.test(value)) {
                    const validChars = {
                        2: /[0-1]/,
                        8: /[0-7]/,
                        10: /[0-9.]/,
                        16: /[0-9A-Fa-f]/
                    };
                    
                    if (validChars[this.currentSystem].test(value)) {
                        if (value === '.') {
                            const numbers = this.expression.split(/[+\-*/]/);
                            const lastNumber = numbers[numbers.length - 1];
                            if (!lastNumber.includes('.')) {
                                this.expression += value;
                            }
                        } else {
                            this.expression += value;
                        }
                    }
                } else {
                    this.expression += value;
                }
        }

        // Всегда вычисляем результат
        if (!this.isEquals && this.expression) {
            this.result = this.calculateResult();
        }

        this.updateDisplay();
    }

    updateDisplay() {
        const expressionEl = document.querySelector('.expression');
        const resultEl = document.querySelector('.result');
        
        expressionEl.textContent = this.expression || '0';
        resultEl.textContent = this.result;
        
        if (this.isEquals) {
            resultEl.classList.add('equals');
        } else {
            resultEl.classList.remove('equals');
        }
    }
}

// Инициализация калькулятора
document.addEventListener('DOMContentLoaded', () => {
    window.calculator = new Calculator();
});
document.addEventListener('DOMContentLoaded', () => {
    const keypadSizeSelect = document.getElementById('keypad-size-select');
    const keypad = document.getElementById('keypad-4x5');

    const keypadLayouts = {
        '4x5': {
            columns: 4,
            rows: 5,
            buttons: [
                '7', '8', '9', '/',
                '4', '5', '6', '*',
                '1', '2', '3', '-',
                '0', '.', '=', '+',
                'C', '(', ')', 'DEL'
            ]
        },
        '5x6': {
            columns: 5,
            rows: 6,
            buttons: [
                'sin', 'cos', 'tan', '^', '√',
                '7', '8', '9', '/', '%',
                '4', '5', '6', '*', 'π',
                '1', '2', '3', '-', 'e',
                '0', '.', '=', '+', '!',
                'C', '(', ')', 'DEL', 'log'
            ]
        },
        '6x7': {
            columns: 6,
            rows: 7,
            buttons: [
                'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
                'sinh', 'cosh', 'tanh', '^', '√', 'ln',
                '7', '8', '9', '/', '%', 'π',
                '4', '5', '6', '*', '!', 'e',
                '1', '2', '3', '-', 'log', '|x|',
                '0', '.', '=', '+', '(', ')',
                'C', 'DEL', 'AND', 'OR', 'XOR', 'NOT'
            ]
        }
    };

    keypadSizeSelect.addEventListener('change', () => {
        const size = keypadSizeSelect.value;
        const layout = keypadLayouts[size];

        // Очищаем текущую клавиатуру
        keypad.innerHTML = '';
        
        // Устанавливаем новый размер сетки
        keypad.style.gridTemplateColumns = `repeat(${layout.columns}, 1fr)`;
        keypad.style.gridTemplateRows = `repeat(${layout.rows}, 1fr)`;
        
        // Добавляем новые кнопки
        layout.buttons.forEach(btn => {
            const button = document.createElement('button');
            button.textContent = btn;
            button.addEventListener('click', () => window.calculator.handleInput(btn));
            keypad.appendChild(button);
        });

        // Обновляем ID клавиатуры
        keypad.id = `keypad-${size}`;
    });
}); 
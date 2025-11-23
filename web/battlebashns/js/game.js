
/* --- Инициализация данных (взят ваш первоначальный вид, но преобразован в объекты) --- */
let initial = [
    ["","","","","","","","","","","","",""],
    ["","","","","","","","","","","","one",""],
    ["","","castle","","","","","","","","","",""],
    ["","","","","","","","","","","","",""],
    ["","","","","","","","","","","","",""],
    ["","","","","","","","","","","","",""],
    ["","","","","","", "castle","","","","","",""],
    ["","","","","","","","","","","","",""],
    ["","","","","","","","","","","","",""],
    ["","","","","","","","","","","","",""],
    ["","","","","","","","","","", "castle","",""],
    ["","two","","","","","","","","","","",""],
    ["","","","","","","","","","","","",""]
];

let isDev = false;
let player = 'two';
let secondPlayer = 'one';
let score = 4;
let scores = { one: 4, two: 0 }; // начальные очки у каждого игрока — можно поменять
        const params = new URLSearchParams(window.location.search);

let cells = []; // будет массив объектов { token: "", castle: bool, fortress: bool }
const place = document.getElementById('gametable');
function use() {
    if (document.getElementById('use').checked) return('fortress')
        else return('own');
}

function gameStart() {
    cells = initial.map(row => row.map(cell => {
        let obj = { token: "", castle: false, fortress: false, fortressRadiusOne: false, fortressRadiusTwo: false };
        if (cell === "one" || cell === "two") obj.token = cell;
        if (cell === "castle") obj.castle = true;
        if (cell === "fortress") obj.fortress = true;
        return obj;
    }));

    // гарантируем булевые поля у каждой клетки (на случай, если объекты будут приходить извне)
    for (let r = 0; r < cells.length; r++) {
      for (let c = 0; c < cells[r].length; c++) {
        if (!cells[r][c].hasOwnProperty('fortressRadiusOne')) cells[r][c].fortressRadiusOne = false;
        if (!cells[r][c].hasOwnProperty('fortressRadiusTwo')) cells[r][c].fortressRadiusTwo = false;
      }
    }
}


/* --- Рисует таблицу на основе cells --- */
function drawPlace() {
    // раньше: document.getElementById('scoreCount').textContent = score;
    document.getElementById('scoreCount').textContent = String(scores[player] ?? 0);
    let html = "<tbody>";
    for (let r = 1; r < cells.length - 1; r++) {
        html += "<tr>";
        for (let c = 1; c < cells[r].length - 1; c++) {
            const cell = cells[r][c];
            // Составляем класс(ы) для td
            let classes = [];
            if (cell.token) classes.push(cell.token); // "one" или "two"
            if (cell.castle) classes.push("castle");
            if (cell.fortress) classes.push("fortress");
            if (cell.fortressRadiusOne) classes.push("fortressRadiusOne");
            if (cell.fortressRadiusTwo) classes.push("fortressRadiusTwo");
            const classAttr = classes.length ? ` class="${classes.join(' ')}"` : "";
            // добавляем data-координаты для обработки клика
            html += `<td${classAttr} data-row="${r}" data-col="${c}"></td>`;
        }
        html += "</tr>";
    }
    html += "</tbody>";
    place.innerHTML = html;

    // После перерисовки — повесим обработчики клика по ячейкам
    place.querySelectorAll('td').forEach(td => {
        td.addEventListener('click', onCellClick);
    });
}

/* --- МОДАЛЬНОЕ ОКНО --- */
const modal = document.getElementById('cellModal');
const modalClose = document.getElementById('modalClose');
const saveBtn = document.getElementById('saveCell');
const cancelBtn = document.getElementById('cancelCell');

let activeCell = null; // {row, col}

function onCellClick(e) {
    const td = e.currentTarget;
    const row = Number(td.dataset.row);
    const col = Number(td.dataset.col);
    activeCell = { row, col };

    // предзаполним форму значениями из cells
    const data = cells[row][col];
    // token -> radio
    const radios = document.getElementsByName('token');
    radios.forEach(r => r.checked = (r.value === data.token));
    if (!data.token) radios.forEach(r => { if (r.value === "") r.checked = true; });

    // чекбоксы
    document.getElementById('chkCastle').checked = !!data.castle;
    document.getElementById('chkFortress').checked = !!data.fortress;

  if(isDev) showModal()
    else {
        const currentCell = cells[row][col];
        if (!currentCell.castle && !currentCell.fortress &&
            !(player === 'one' ? currentCell.fortressRadiusTwo : currentCell.fortressRadiusOne)) {

            if (scores[player] < 1 
                || (scores[player] < 4 && use() === 'fortress' && currentCell.token != player) 
                || (scores[player] < 3 && use() === 'fortress' && currentCell.token == player) 
                || !checklength(row, col, '4'))
                 return;

            if (currentCell.token !== player) scores[player] -= 1;
            currentCell.token = player || "";

            if (use() === 'fortress') { 
                scores[player] -= 3;
                currentCell.fortress = true;

                const setFortressRadius = (r, c) => {
                    if (!cells[r] || !cells[r][c]) return;
                    if (player === 'one') cells[r][c].fortressRadiusOne = true;
                    else cells[r][c].fortressRadiusTwo = true;
                };

                setFortressRadius(row - 1, col);
                setFortressRadius(row - 1, col + 1);
                setFortressRadius(row, col + 1);
                setFortressRadius(row + 1, col + 1);
                setFortressRadius(row + 1, col);
                setFortressRadius(row + 1, col - 1);
                setFortressRadius(row, col - 1);
                setFortressRadius(row - 1, col - 1);
            }

            drawPlace();
        }
    };
}

function checklength(row, col, mode) {
    // смещения для 8 соседей
    let deltas
    if (mode == '8') {
        deltas = [
            [-1,-1], [-1,0], [-1,1],
            [ 0,-1],         [ 0,1],
            [ 1,-1], [ 1,0], [ 1,1]
        ]; 
    } else {
        deltas = [
                    [-1,0],
            [ 0,-1],         [ 0,1],
                    [ 1,0]
        ];
    }

    for (let [dr, dc] of deltas) {
        const nr = row + dr;
        const nc = col + dc;
        // проверка границ и существования клетки
        if (!cells[nr] || !cells[nr][nc]) continue;
        if (cells[nr][nc].token === player) return true;
    }

    return false;
}

function showModal() { modal.style.display = 'flex'; }
function hideModal() { modal.style.display = 'none'; activeCell = null; }

modalClose.addEventListener('click', hideModal);
cancelBtn.addEventListener('click', hideModal);

// сохранить изменения
saveBtn.addEventListener('click', () => {
    if (!activeCell) return hideModal();
    const { row, col } = activeCell;

    // получить выбранный токен (radio)
    const radios = document.getElementsByName('token');
    let tokenVal = "";
    radios.forEach(r => { if (r.checked) tokenVal = r.value; });

    // чекбоксы
    const castle = document.getElementById('chkCastle').checked;
    const fortress = document.getElementById('chkFortress').checked;

    // обновляем модель и перерисовываем поле
    cells[row][col].token = tokenVal || "";
    cells[row][col].castle = !!castle;
    cells[row][col].fortress = !!fortress;

    drawPlace();
    hideModal();
});

// закрывать модал по клику вне содержимого
modal.addEventListener('click', (ev) => {
    if (ev.target === modal) hideModal();
});

// Если в URL есть ?player=one или ?player=two — установим player и secondPlayer
function initPlayersFromUrl() {
    try {
        const p = params.get('player');
        if (!p) return; // ничего не указано
        const val = String(p).toLowerCase();
        if (val === 'one' || val === 'two') {
            player = val;
            secondPlayer = (val === 'one') ? 'two' : 'one';
        }

        const devParam = params.get('dev');
        if (devParam) document.getElementById('gamePage').classList.add('active');
    } catch (e) {
        // безопасно игнорируем ошибки парсинга
        console.warn('initPlayersFromUrl:', e);
    }
}

// Возвращает количество клеток, принадлежащих указанному игроку ("one" или "two")
function countCellsOf(playerName) {
    let total = 0;
    for (let r = 1; r < cells.length - 1; r++) {
        for (let c = 1; c < cells[r].length - 1; c++) {
            if (cells[r][c].token === playerName) total++;
        }
    }
    return total;
}

/* --- Запуск --- */
window.addEventListener("load", () => {
    initPlayersFromUrl();
    gameStart();
    drawPlace();
});

// Инициализация при загрузке
window.addEventListener('load', () => {
  // убедимся, что players из URL проинициализированы раньше
  if (typeof initPlayersFromUrl === 'function') initPlayersFromUrl();

  // начальные значения turn/turnCount: можно задать исходя из player
  // Если хотите, можно взять turn из URL или из начальной логики
  // По умолчанию пусть ход начнёт 'one'
  if (!window.turn) turn = 'one';
  turnCount = 0;

  // Инициализируем контролы peer
  initPeerControls();
});

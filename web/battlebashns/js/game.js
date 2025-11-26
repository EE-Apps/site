
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
let turn = 'one';
let turnCount = 0;
let waitingForOpponent = false;
const params = new URLSearchParams(window.location.search);

// флаг, чтобы бонусы для одного конкретного хода применялись лишь однажды
let lastBonusAppliedFor = { turn: null, turnCount: null };

// P2P соединение и синхронизация
let peerConnection = null;
let isConnected = false;
let gameStarted = false;

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
            
            // Отправляем ход сопернику через P2P
            //sendMove(row, col, cells[row][col]);
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

/**
 * Обработчик нажатия кнопки "NEXT" для завершения хода
 */
function setupNextTurnButton() {
    const nextTurnBtn = document.getElementById('nextTurn');
    if (!nextTurnBtn) {
        console.warn('[Game] nextTurn button not found');
        return;
    }
    
    nextTurnBtn.addEventListener('click', () => {
        console.log('[Game] nextTurn clicked, turn:', turn, 'player:', player, 'isConnected:', isConnected);
        
        // Проверка: это наш ход?
        if (turn !== player) {
            console.warn('[Game] Not your turn! turn:', turn, 'player:', player);
            return;
        }
        
        // Проверка: уже в ожидании?
        if (waitingForOpponent) {
            console.warn('[Game] Already waiting for opponent');
            return;
        }
        
        // Проверка: соединение установлено?
        if (!isConnected) {
            console.warn('[Game] Cannot end turn: not connected (isConnected=false)');
            return;
        }
        
        if (!peerConnection) {
            console.warn('[Game] Cannot end turn: no peer connection');
            return;
        }
        
        try {
            // Отправляем состояние игры и завершаем ход
            const endTurnMsg = {
                type: 'endTurn',
                cells: cells,
                turn: secondPlayer, // Теперь ход противника
                turnCount: turn === 'one' ? turnCount + 1 : turnCount,
                scores: scores,
                timestamp: Date.now()
            };
            
            peerConnection.send(JSON.stringify(endTurnMsg));
            console.log('[Game] End turn sent to opponent');
            
            // Локально переключаем ход
            turn = secondPlayer;
            waitingForOpponent = true;
            console.log('[Game] Turn switched to:', turn, 'waiting for opponent...');
            
            // Отправляем бонусы сопернику при его ходе
            applyTurnBonuses();
        } catch (e) {
            console.error('[Game] Error ending turn:', e);
        }
    });
    
    console.log('[Game] nextTurn button handler registered');
}

/**
 * Применяем +4 и +4 за каждую полностью окружённую castle
 */
function applyTurnBonuses() {
    // защита: если уже применяли бонусы для текущей комбинации turn+turnCount — не применять снова
    if (lastBonusAppliedFor.turn === turn && lastBonusAppliedFor.turnCount === turnCount) return;
    lastBonusAppliedFor.turn = turn;
    lastBonusAppliedFor.turnCount = turnCount;

    const playerAtTurn = turn; // 'one' или 'two'

    // +4 базово игроку, чей ход начался
    scores[playerAtTurn] = (scores[playerAtTurn] || 0) + 4;

    // для каждой клетки с castle проверить 8 соседей и, при выполнении условия,
    // начислять дополнительные +4 именно этому игроку
    for (let r = 1; r < cells.length - 1; r++) {
        for (let c = 1; c < cells[r].length - 1; c++) {
            const cell = cells[r][c];
            if (!cell || !cell.castle) continue;

            let surroundedByPlayer = true;
            const deltas = [
                [-1,-1], [-1,0], [-1,1],
                [ 0,-1],         [ 0,1],
                [ 1,-1], [ 1,0], [ 1,1]
            ];

            for (let [dr, dc] of deltas) {
                const nr = r + dr, nc = c + dc;
                const neigh = (cells[nr] && cells[nr][nc]) ? cells[nr][nc] : null;
                if (!neigh || !neigh.token) { surroundedByPlayer = false; break; }
                if (neigh.token !== playerAtTurn) { surroundedByPlayer = false; break; }
            }

            if (surroundedByPlayer) {
                scores[playerAtTurn] += 4;
            }
        }
    }

    // если ход 'one', инкрементируем turnCount
    if (turn === 'one') turnCount += 1;
    
    console.log('[Game] Bonuses applied. Scores:', scores, 'turnCount:', turnCount);
}

// Обновляем UI при изменении статуса игры
function updateGameUI() {
    const turnInfo = document.getElementById('turnInfo');
    const turnCountEl = document.getElementById('turnCountEl');
    const redCountEl = document.getElementById('redCountEl');
    const blueCountEl = document.getElementById('blueCountEl');
    const scoreCount = document.getElementById('scoreCount');
    
    if (turnInfo) {
        turnInfo.textContent = `Turn: ${turn} (${turn === player ? '✅ YOUR turn' : '⌛ OPPONENT'})`;
    }
    if (turnCountEl) turnCountEl.textContent = String(turnCount);
    if (redCountEl) redCountEl.textContent = countCellsOf('one');
    if (blueCountEl) blueCountEl.textContent = countCellsOf('two');
    if (scoreCount) scoreCount.textContent = String(scores[player] ?? 0);
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
    updateGameUI(); // Обновляем UI при загрузке
    
    // Подписываемся на события P2P соединения
    setupPeerConnectionListener();
    
    // Устанавливаем обработчик кнопки завершения хода
    setupNextTurnButton();
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
  if (typeof initPeerControls === 'function') {
      initPeerControls();
  }
});

/**
 * Настроить слушатель событий P2P соединения от лобби
 */
function setupPeerConnectionListener() {
    console.log('[Game] Starting peer connection listener...');
    
    // Ждём, пока в глобальном контексте появится объект peer из lobby.js
    const checkPeer = setInterval(() => {
        console.log('[Game] Checking for peer connection... window.peer:', !!window.peer);
        
        if (window.peer && window.peer !== peerConnection) {
            console.log('[Game] Peer found!');
            peerConnection = window.peer;
            console.log('[Game] peerConnection assigned:', !!peerConnection);
            console.log('[Game] Peer _connected flag:', peerConnection._connected);
            console.log('[Game] Peer connected property:', peerConnection.connected);
            
            // Проверяем текущий статус соединения
            // SimplePeer может быть уже подключен до регистрации обработчика
            if (peerConnection.connected) {
                isConnected = true;
                console.log('[Game] Peer is ALREADY connected!');
                updateGameUI(); // Обновляем UI
            }
            
            // Регистрируем обработчики для будущих событий
            peerConnection.on('connect', () => {
                isConnected = true;
                console.log('[Game] P2P connection event: CONNECTED');
                updateGameUI(); // Обновляем UI при подключении
            });
            
            peerConnection.on('close', () => {
                isConnected = false;
                console.log('[Game] P2P connection event: CLOSED');
                updateGameUI(); // Обновляем UI при отключении
            });
            
            console.log('[Game] P2P connection received from lobby');
            
            // Устанавливаем правильного игрока на основе создателя комнаты
            if (window.currentRoom && window.cloud) {
                const isCreator = window.currentRoom.author === window.cloud.user;
                player = isCreator ? 'one' : 'two';
                secondPlayer = isCreator ? 'two' : 'one';
                console.log('[Game] Set player to:', player, '(creator:', isCreator, ')');
                console.log('[Game] Room author:', window.currentRoom.author);
                console.log('[Game] Current user:', window.cloud.user);
                
                // Переиницализируем игру с правильными игроками
                gameStart();
                drawPlace();
                updateGameUI(); // Обновляем UI с правильным игроком
                console.log('[Game] Game reinitialized');
            } else {
                console.error('[Game] Missing currentRoom or cloud:', !!window.currentRoom, !!window.cloud);
            }
            
            clearInterval(checkPeer);
            
            // Слушаем данные от соперника
            setupPeerDataListener();
            
            console.log('[Game] Setup complete. isConnected:', isConnected, 'peerConnection:', !!peerConnection);
        }
    }, 100);
    
    // Таймаут на случай, если соединение не установится
    setTimeout(() => {
        clearInterval(checkPeer);
        if (!isConnected) {
            console.warn('[Game] Peer connection not established after 10 seconds');
        }
    }, 10000);
}

/**
 * Слушать входящие данные от соперника через P2P
 */
function setupPeerDataListener() {
    if (!peerConnection) {
        console.error('[Game] No peer connection to setup listener');
        return;
    }
    
    console.log('[Game] Setting up peer data listener');
    
    // Убеждаемся, что слушатель еще не установлен
    if (peerConnection._dataListenerSetup) {
        console.log('[Game] Data listener already setup, skipping');
        return;
    }
    
    peerConnection._dataListenerSetup = true;
    
    peerConnection.on('data', (raw) => {
        try {
            const msg = JSON.parse(raw.toString());
            console.log('[Game] Received message type:', msg.type);
            
            // Обрабатываем игровые сообщения
            if (msg.type === 'gameState') {
                console.log('[Game] Received game state from opponent');
                // Применяем состояние от соперника
                if (msg.data && msg.data.cells) {
                    cells = JSON.parse(JSON.stringify(msg.data.cells)); // Глубокая копия
                    scores = msg.data.scores ? JSON.parse(JSON.stringify(msg.data.scores)) : scores;
                    drawPlace();
                    console.log('[Game] Game state updated from opponent');
                }
            } else if (msg.type === 'move') {
                console.log('[Game] Received move from opponent:', msg.data);
                // Применяем ход соперника
                if (msg.data && msg.data.row !== undefined && msg.data.col !== undefined) {
                    const { row, col, cellState } = msg.data;
                    if (cells[row] && cells[row][col]) {
                        // Применяем полное состояние клетки
                        cells[row][col] = JSON.parse(JSON.stringify(cellState));
                        drawPlace();
                        console.log('[Game] Move applied at', row, col);
                    }
                }
            } else if (msg.type === 'endTurn') {
                console.log('[Game] Received endTurn from opponent');
                // Применяем состояние перед переключением хода
                if (msg.cells) cells = JSON.parse(JSON.stringify(msg.cells));
                if (msg.scores) scores = JSON.parse(JSON.stringify(msg.scores));
                if (typeof msg.turnCount === 'number') turnCount = msg.turnCount;
                
                // Теперь наш ход
                turn = player;
                waitingForOpponent = false;
                
                // Локально начисляем бонусы при начале хода
                applyTurnBonuses();
                
                console.log('[Game] Turn switched to:', turn, 'New scores:', scores);
                drawPlace();
                updateGameUI(); // Обновляем UI при смене хода
            }
        } catch (e) {
            console.error('[Game] Error processing peer data:', e, 'raw:', raw.toString());
        }
    });
}

/**
 * Отправить состояние игры сопернику
 */
function syncGameState() {
    if (!peerConnection || !isConnected) {
        console.warn('[Game] Cannot sync: no peer connection');
        return;
    }
    
    try {
        const gameState = {
            type: 'gameState',
            data: {
                cells: cells,
                scores: scores,
                currentPlayer: player,
                timestamp: Date.now()
            }
        };
        peerConnection.send(JSON.stringify(gameState));
        console.log('[Game] Game state sent to opponent');
    } catch (e) {
        console.error('[Game] Error syncing game state:', e);
    }
}

/**
 * Отправить ход сопернику
 */
function sendMove(row, col, cellState) {
    console.log('[Game] sendMove called, peerConnection:', !!peerConnection, 'isConnected:', isConnected);
    
    if (!isConnected) {
        console.warn('[Game] Cannot send move: not connected (isConnected=false)');
        return;
    }
    
    if (!peerConnection) {
        console.warn('[Game] Cannot send move: peerConnection is null');
        return;
    }
    
    try {
        const move = {
            type: 'move',
            data: {
                row: row,
                col: col,
                token: player,
                cellState: JSON.parse(JSON.stringify(cellState)), // Глубокая копия
                timestamp: Date.now()
            }
        };
        peerConnection.send(JSON.stringify(move));
        console.log('[Game] Move sent to opponent:', row, col);
    } catch (e) {
        console.error('[Game] Error sending move:', e);
    }
}

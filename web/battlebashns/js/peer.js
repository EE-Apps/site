// ---------- SimplePeer + turn logic ----------
let peer = null;
let connected = false;
let waitingForOpponent = false;
let turn = 'one';
let turnCount = 0;

// вместо одного score — хранит по игрокам
//let scores = { one: 4, two: 4 };

// флаг, чтобы бонусы для одного конкретного хода применялись лишь однажды
let lastBonusAppliedFor = { turn: null, turnCount: null };

    // применяем +4 и +4 за каждую полностью окружённую castle
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

        // если ход 'one', инкрементируем turnCount (поведение сохранил как у тебя было)
        if (turn === 'one') turnCount += 1;
    }

// Инициализация (попробуйте вызвать initPlayersFromUrl до этого)
function initPeerControls() {
  const isInitiatorCheckbox = document.getElementById('isInitiator');
  const btnCreateSignal = document.getElementById('btnCreateSignal');
  const btnAcceptRemote = document.getElementById('btnAcceptRemote');
  const localSignalEl = document.getElementById('localSignal');
  const remoteSignalEl = document.getElementById('remoteSignal');
  const connStatus = document.getElementById('connStatus');
  const nextTurnBtn = document.getElementById('nextTurn');
  const turnInfo = document.getElementById('turnInfo');
  const turnCountEl = document.getElementById('turnCountEl');

  function updateStatus(txt) { connStatus.textContent = 'Status: ' + txt; }
function updateTurnUI() {
  turnInfo.textContent = `Turn: ${turn} (${turn === player ? '✅ YOUR turn' : '⌛ OPPONENT'})`;
  turnCountEl.textContent = String(turnCount);
  // отображаем локальный счёт игрока
  document.getElementById('scoreCount').textContent = String(scores[player] ?? 0);
}


  function createPeer() {
    // if peer exists, destroy
    if (peer) {
      try { peer.destroy(); } catch (e) {}
      peer = null;
      connected = false;
      updateStatus('recreated');
    }

    const initiator = !!isInitiatorCheckbox.checked;
    peer = new SimplePeer({ initiator, trickle: false });

    peer.on('signal', data => {
      // выводим локальный сигнал (JSON)
      localSignalEl.value = JSON.stringify(data);
    });

    peer.on('connect', () => {
      connected = true;
      updateStatus('connected');
      console.log('peer connected');
      // сразу отправляем initial sync so both sides share same state
      document.getElementById('connectPage').classList.remove('active');
      document.getElementById('gamePage').classList.add('active');
      sendFullSync();
    });

    peer.on('data', raw => {
      // поступили данные от партнёра
      try {
        const msg = JSON.parse(raw.toString());
        handlePeerMessage(msg);
      } catch (e) {
        console.warn('Invalid peer data', e, raw);
      }
    });

    peer.on('error', err => {
      console.error('peer error', err);
      updateStatus('error');
    });

    peer.on('close', () => {
      connected = false;
      updateStatus('closed');
    });
  }

  btnCreateSignal.addEventListener('click', () => {
    createPeer();
    // когда peer создаст сигнал — он попадёт в localSignal textarea через обработчик 'signal'
    updateStatus('signal created (copy it)');
  });

  btnAcceptRemote.addEventListener('click', () => {
    if (!peer) {
      // если peer не создан — создаём (режим определяет checkbox initiator)
      createPeer();
    }
    const remote = remoteSignalEl.value.trim();
    if (!remote) return alert('Вставьте удалённый сигнал в поле Remote signal');
    try {
      const obj = JSON.parse(remote);
      peer.signal(obj);
      updateStatus('signal accepted');
    } catch (e) {
      alert('Ошибка разбора remote signal: ' + e.message);
    }
  });

    // Отправка полной синхронизации (по подключению)
    function sendFullSync() {
    if (!peer || !connected) return;
    const payload = {
        type: 'fullSync',
        cells,
        turn,
        turnCount,
        scores
    };
    peer.send(JSON.stringify(payload));
    }

    // Отправка окончания хода (endTurn)
    function sendEndTurn() {
    if (!peer || !connected) {
        alert('Not connected to peer');
        return;
    }

    const payload = {
        type: 'endTurn',
        cells,
        turn,
        turnCount,
        scores
    };

    peer.send(JSON.stringify(payload));
    waitingForOpponent = true;
    updateStatus('waiting opponent...');
    updateTurnUI();
    }

    // Обработка приходящих сообщений
    function handlePeerMessage(msg) {
        if (!msg || !msg.type) return;

        if (msg.type === 'fullSync') {
            try {
            cells = msg.cells || cells;
            turn = msg.turn || turn;
            turnCount = (typeof msg.turnCount === 'number') ? msg.turnCount : turnCount;
            if (msg.scores && typeof msg.scores === 'object') scores = msg.scores;
            drawPlace();
            updateTurnUI();
            } catch (e) { console.warn('fullSync error', e); }
            return;
        }

        if (msg.type === 'endTurn') {
            try {
            cells = msg.cells || cells;
            if (typeof msg.turnCount === 'number') turnCount = msg.turnCount;

            // После получения endTurn — теперь наш ход
            turn = player;
            waitingForOpponent = false;

            // Локально начисляем бонусы при начале хода
            applyTurnBonuses();

            drawPlace();
            updateTurnUI();
            updateStatus('✅ your turn');
            } catch (e) { console.warn('endTurn handling error', e); }
            return;
        }
    }

  // NextTurn click -> отправляем endTurn
  nextTurnBtn.addEventListener('click', () => {
    // проверка: можно ли заканчивать ход (только если это наш ход и не в ожидании)
    if (turn !== player) return alert('Сейчас не ваш ход');
    if (waitingForOpponent) return alert('Уже ожидание соперника');

    // Завершаем текущий ход локально (например, фиксируем какие-то изменения уже сделанные)
    // В данной реализации предполагаем, что модель cells уже изменена действиями игрока.
    // Отправляем данные сопернику
    sendEndTurn();

    // После отправки переключаем локальный turn на opponent (т. к. теперь ход соперника)
    turn = secondPlayer;
    updateTurnUI();

    if (params.get('bot')) {
        turn = params.get('bot');
        applyTurnBonuses();

        const botResult = Bot.playUntilExhausted(cells, 'two', 'one', scores[params.get('bot')], {
        allowFortress: true,
        logger: console.log,
        maxMoves: 100 // по умолчанию 1000, можно сократить
        });

        scores[params.get('bot')] = botResult.finalScore;

        turn = 'one';
        applyTurnBonuses();
        drawPlace();
    }
  });

  // обновляем UI по стартовому состоянию
  updateTurnUI();
  updateStatus('not connected');
}

// отправка полной синхронизации вручную
function sendFullSyncIfConnected() {
  if (peer && connected) {
    peer.send(JSON.stringify({
      type: 'fullSync',
      cells,
      score,
      turn,
      turnCount
    }));
  }
}
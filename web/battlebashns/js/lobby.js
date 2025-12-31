// Константы для облачных переменных
const CLOUD_ROOMS_VAR = 'varible';
const CLOUD_SIGNALS_VAR = 'signals';
const CLOUD_ROOMS_LIST_VAR = 'roomsList';

// Локальное хранилище комнат
let roomsCache = [];
let currentRoom = null;
let peer = null;
let connected = false;
let signalListeners = [];
let messageQueue = []; // Буфер сообщений до подключения
let pendingSignal = null; // Буфер сигнала, если хост ждёт второго игрока

/**
 * Отправить информацию о новой комнате в облако
 * @param {CloudWebSocket} cloud
 * @param {string} roomName - название комнаты
 * @param {string} author - автор (имя пользователя)
 */
function createRoom(cloud, roomName, author) {
    const roomInfo = {
        id: generateRoomId(),
        name: roomName,
        author: author,
        createdAt: new Date().toISOString(),
        players: 1,
        settings: {
            filedSize: 11,
            resourcePoints: 4,
            resourcesPerTurn: 4,
            resourcesPerPoint: 4,
            gameMode: 'classic'
        }
    };

    // Добавляем в локальный кеш
    roomsCache.push(roomInfo);
    let roomNumber = roomsCache.length - 1;
    console.log('[Lobby] Room created locally:', roomInfo);
    
    // Отправляем весь список комнат в облако
    try {
        const roomsListData = JSON.stringify(roomsCache);
        cloud.sendSet(CLOUD_ROOMS_LIST_VAR, roomsListData, { encode: true });
        console.log('[Lobby] Rooms list sent to cloud:', roomsCache.length, 'rooms');
        updateRoomsList(cloud);
    } catch (e) {
        console.error('[Lobby] Error sending rooms list:', e);
    }

    document.querySelectorAll('.roomSettingInpt').forEach(element => {
    // Назначаем обработчик клика каждому элементу
    element.onclick = (e) => {
        console.log(roomsCache);
        roomsCache[roomNumber].name = document.getElementById('roomNameInput').value;
        roomsCache[roomNumber].settings.filedSize = parseInt(document.getElementById('roomFiledSizeInput').value) || 11;
        roomsCache[roomNumber].settings.resourcesPerTurn = parseInt(document.getElementById('roomResourcesPerTurnInput').value) || 4;
        roomsCache[roomNumber].settings.resourcesPerPoint = parseInt(document.getElementById('roomResourcesPerPointInput').value) || 4;
        const roomsListData = JSON.stringify(roomsCache);
        cloud.sendSet(CLOUD_ROOMS_LIST_VAR, roomsListData, { encode: true });
        console.log('[Lobby] Rooms list updated to cloud:', roomsCache.length, 'rooms');
    }});

    joinRoom(roomInfo.id);
}

/**
 * Получить список комнат из облака и отобразить их
 * @param {CloudWebSocket} cloud
 */
function renderRooms(cloud) {
    // Экспортируем cloud в глобальный контекст
    window.cloud = cloud;
    
    const roomsList = document.getElementById('roomsList');
    if (!roomsList) {
        console.error('[Lobby] Element #roomsList not found');
        return;
    }

    // Инициализируем обработчик кнопки создания комнаты один раз
    const btnCreateRoom = document.getElementById('btnCreateRoom');
    if (btnCreateRoom && !btnCreateRoom._initialized) {
        btnCreateRoom._initialized = true;
        btnCreateRoom.onclick = () => {
            const roomName = prompt('Введите название комнаты:', 'Комната ' + Math.floor(Math.random() * 1000));
            if (roomName) {
                createRoom(cloud, roomName, cloud.user);
            }
        };
    }

    // Регистрируем глобальный слушатель облака
    // Используем флаг чтобы не регистрировать дважды
    if (!window._cloudSetListenerInitialized) {
        window._cloudSetListenerInitialized = true;
        
        cloud.on('set', (data) => {
            console.log('[Lobby] Cloud event received:', data.name);
            
            // Слушаем обновления списка комнат из облака
            if (data.name === `☁ ${CLOUD_ROOMS_LIST_VAR}` || data.name === `☁ ${CLOUD_ROOMS_VAR}`) {
                console.log('[Lobby] Received rooms data:', data.value);
                try {
                    // Декодируем текст
                    const decodedText = cloud.decodeText(data.value);
                    console.log('[Lobby] Decoded:', decodedText);
                    
                    // Проверяем, это валидный JSON
                    let roomData;
                    try {
                        roomData = JSON.parse(decodedText);
                    } catch (e) {
                        console.log('[Lobby] Not JSON, treating as plain text');
                        return;
                    }
                    
                    // Проверяем, это массив или объект
                    if (Array.isArray(roomData)) {
                        roomsCache = roomData;
                        console.log('[Lobby] Updated rooms list from cloud:', roomsCache.length, 'rooms');
                    } else if (roomData.id) {
                        // Это одна комната, добавляем или обновляем её
                        const existingIndex = roomsCache.findIndex(r => r.id === roomData.id);
                        const oldPlayersCount = existingIndex >= 0 ? roomsCache[existingIndex].players : 0;
                        
                        if (existingIndex >= 0) {
                            roomsCache[existingIndex] = roomData;
                        } else {
                            roomsCache.push(roomData);
                        }
                        console.log('[Lobby] Added/Updated room:', roomData.name, 'players:', roomData.players);
                        
                        // Если это текущая комната и число игроков увеличилось
                        if (currentRoom && currentRoom.id === roomData.id) {
                            console.log('[Lobby] Current room updated. Old players:', oldPlayersCount, 'New players:', roomData.players);
                            
                            // Обновляем информацию о текущей комнате
                            const oldPlayerCount = currentRoom.players;
                            currentRoom = roomData;
                            
                            // Если второй игрок только что присоединился и у нас есть буферизованный сигнал
                            if (oldPlayerCount < 2 && roomData.players >= 2 && pendingSignal && peer) {
                                console.log('[Lobby] Second player joined! Sending buffered offer signal');
                                sendPeerSignal(cloud, pendingSignal);
                                pendingSignal = null;
                            }
                        }
                    }
                    
                    updateRoomsList(cloud);
                } catch (e) {
                    console.error('[Lobby] Error parsing room data:', e);
                }
            }
            
            // Слушаем сигналы для P2P
            if (data.name === `☁ ${CLOUD_SIGNALS_VAR}`) {
                console.log('[Lobby] Signal event received in renderRooms');
                handleCloudSignal(cloud, data.value);
            }
        });
    }

    // Если уже есть начальные сообщения от сервера, обработаем их
    if (cloud.initialMessages && cloud.initialMessages.length > 0) {
        console.log('[Lobby] Processing', cloud.initialMessages.length, 'initial messages');
        
        for (const msgData of cloud.initialMessages) {
            try {
                const parsed = JSON.parse(typeof msgData === 'string' ? msgData : String(msgData));
                
                if (parsed && parsed.method === 'set' && parsed.name === `☁ ${CLOUD_ROOMS_LIST_VAR}`) {
                    console.log('[Lobby] Initial roomsList found in messages');
                    const decodedText = cloud.decodeText(parsed.value);
                    console.log('[Lobby] Decoded initial roomsList:', decodedText);
                    
                    try {
                        const roomData = JSON.parse(decodedText);
                        if (Array.isArray(roomData)) {
                            roomsCache = roomData;
                            console.log('[Lobby] Loaded initial rooms from hello:', roomsCache.length, 'rooms');
                            updateRoomsList(cloud);
                        }
                    } catch (e) {
                        console.error('[Lobby] Error parsing initial roomsList:', e);
                    }
                    break; // Выходим после первого найденного roomsList
                }
            } catch (e) {
                console.log('[Lobby] Could not parse initial message');
            }
        }
    }

    // Если уже есть начальное сообщение от сервера (hello), обработаем его
    if (cloud.helloRecive) {
        console.log('[Lobby] Processing initial server message from hello');
        try {
            const parsed = JSON.parse(typeof cloud.helloRecive === 'string' ? cloud.helloRecive : String(cloud.helloRecive));
            
            // Если это сообщение содержит данные о комнатах, загружаем их
            if (parsed && parsed.method === 'set' && parsed.name === `☁ ${CLOUD_ROOMS_LIST_VAR}`) {
                console.log('[Lobby] Initial roomsList found in hello message');
                const decodedText = cloud.decodeText(parsed.value);
                console.log('[Lobby] Decoded initial roomsList:', decodedText);
                
                try {
                    const roomData = JSON.parse(decodedText);
                    if (Array.isArray(roomData)) {
                        roomsCache = roomData;
                        console.log('[Lobby] Loaded initial rooms from hello:', roomsCache.length, 'rooms');
                        updateRoomsList(cloud);
                    }
                } catch (e) {
                    console.error('[Lobby] Error parsing initial roomsList:', e);
                }
            }
        } catch (e) {
            console.log('[Lobby] Could not parse initial hello message');
        }
    }

    // Первоначальное обновление списка (если нет данных в hello)
    if (roomsCache.length === 0) {
        updateRoomsList(cloud);
    }
}

/**
 * Обновить список комнат в DOM
 * @param {CloudWebSocket} cloud
 */
function updateRoomsList(cloud) {
    const roomsList = document.getElementById('roomsList');
    if (!roomsList) return;

    // Очищаем список
    roomsList.innerHTML = '';

    if (roomsCache.length === 0) {
        roomsList.innerHTML = '<p style="color: #999;">Нет комнат</p>';
        return;
    }

    // Создаём элементы для каждой комнаты
    roomsCache.forEach((room) => {
        const roomEl = createRoomElement(room);
        roomsList.appendChild(roomEl);
    });
}

/**
 * Создать DOM элемент комнаты
 * @param {Object} room
 * @returns {HTMLElement}
 */
function createRoomElement(room) {
    const div = document.createElement('div');
    div.className = 'room';

    const createdDate = new Date(room.createdAt).toLocaleTimeString('ru-RU');

    div.innerHTML = `
        <div style="font-weight: bold">${room.name}</div>
        <div style="font-size: 12px; color: #666;">
            Автор: <strong>${room.author}</strong> | 
            Игроков: <strong>${room.players}</strong> | 
            Создано: <strong>${createdDate}</strong>
        </div>
    `;

    div.onclick = () => joinRoom(room.id);

    return div;
}

/**
 * Присоединиться к комнате
 * @param {string} roomId
 */
function joinRoom(roomId) {
    console.log('[Lobby] Joining room:', roomId);
    const room = roomsCache.find(r => r.id === roomId);
    if (room) {
        console.log('[Lobby] Room details:', room);
        currentRoom = room;
        
        // Экспортируем currentRoom в глобальный контекст
        window.currentRoom = currentRoom;
        
        // Если это не моя комната (не я автор), увеличиваем количество игроков
        if (currentRoom.author !== window.cloud.user) {
            currentRoom.players = (currentRoom.players || 1) + 1;
            console.log('[Lobby] Joined as guest, updated players count to:', currentRoom.players);
            
            // Обновляем информацию о комнате в облаке
            try {
                const updatedRoom = JSON.stringify(currentRoom);
                window.cloud.sendSet(CLOUD_ROOMS_VAR, updatedRoom, { encode: true });
                console.log('[Lobby] Updated room info in cloud with players:', currentRoom.players);
            } catch (e) {
                console.error('[Lobby] Error updating room in cloud:', e);
            }
        }
        
        // Переходим на страницу чата
        switchPage('chatPage');
        clearChatMessages();
        addChatMessage('[System]', 'Waiting for peer connection...', 'system');
        
        // Инициируем peer подключение
        initiatePeerConnection(window.cloud);
        addChatMessage('[System]', 'P2P initiated: ' + (currentRoom.author === window.cloud.user ? 'initiator' : 'non-initiator'), 'system');
    }
}

/**
 * Отправить P2P сигнал в облако
 * @param {CloudWebSocket} cloud
 * @param {Object} data - сигнал от SimplePeer
 */
function sendPeerSignal(cloud, data) {
    // Проверяем состояние облака перед отправкой
    if (!cloud.ws) {
        console.error('[Lobby] Cloud WebSocket is null!');
        return;
    }
    
    if (cloud.ws.readyState !== 1) {
        console.error('[Lobby] Cloud WebSocket is not open! State:', cloud.ws.readyState);
        return;
    }
    
    // Отправляем сигнал в облако
    const signal = {
        roomId: currentRoom.id,
        from: cloud.user,
        to: currentRoom.author === cloud.user ? 'guest' : currentRoom.author,
        timestamp: Date.now(),
        signal: data,
        type: data.type // 'offer' или 'answer'
    };
    
    console.log('[Lobby] Sending peer signal from', cloud.user, 'type:', data.type, 'in room', currentRoom.id);
    
    try {
        cloud.sendSet(CLOUD_SIGNALS_VAR, JSON.stringify(signal), { encode: true });
        console.log('[Lobby] Signal sent successfully');
    } catch (e) {
        console.error('[Lobby] Error sending signal:', e);
    }
}

/**
 * Инициировать P2P подключение через облако
 * @param {CloudWebSocket} cloud
 */
function initiatePeerConnection(cloud) {
    if (!currentRoom) {
        console.error('[Lobby] No current room set');
        return;
    }
    
    console.log('[Lobby] Initiating peer connection for room:', currentRoom.id);
    console.log('[Lobby] Cloud connection state:', cloud.ws ? cloud.ws.readyState : 'No WS');
    
    // Создаём SimplePeer с флагом initiator (создатель комнаты инициирует)
    const isInitiator = currentRoom.author === cloud.user;
    console.log('[Lobby] Is initiator:', isInitiator);
    console.log('[Lobby] Current user:', cloud.user);
    console.log('[Lobby] Room author:', currentRoom.author);

    // Заполняем данные комнаты
    document.getElementById('roomNameInput').value = currentRoom.name;
    document.getElementById('roomFiledSizeInput').value = currentRoom.settings?.filedSize || 11;
    document.getElementById('roomResourcesPerTurnInput').value = currentRoom.settings?.resourcesPerTurn || 11;
    document.getElementById('roomResourcesPerPointInput').value = currentRoom.settings?.resourcesPerPoint || 11;

    // Работа с SimplePeer
    
    peer = new SimplePeer({ 
        initiator: isInitiator, 
        trickle: false,
        config: {
            iceServers: [
                { urls: ['stun:stun.l.google.com:19302'] },
                { urls: ['stun:stun1.l.google.com:19302'] }
            ]
        }
    });
    
    peer.on('signal', (data) => {
        console.log('[Lobby] SIGNAL EVENT TRIGGERED, type:', data.type);
        
        // Если я инициатор (хост), проверяем, присоединился ли второй игрок
        const isInitiator = currentRoom.author === cloud.user;
        if (isInitiator && data.type === 'offer') {
            // Хост может отправить offer только если второй игрок уже в комнате
            // Проверяем количество игроков в комнате
            if (currentRoom.players < 2) {
                console.log('[Lobby] Waiting for second player before sending offer. Current players:', currentRoom.players);
                // Буферируем сигнал, отправим позже
                pendingSignal = data;
                return;
            }
        }
        
        // Отправляем сигнал
        sendPeerSignal(cloud, data);
    });
    
    peer.on('connect', () => {
        connected = true;
        peer._connected = true; // Флаг для game.js
        console.log('[Lobby] Peer connected!');
        
        // Обновляем статус в чате
        const statusEl = document.getElementById('chatStatus');
        if (statusEl) {
            statusEl.textContent = 'Connected!';
            statusEl.style.color = '#0a0';
        }
        
        // Включаем кнопку отправки
        const btnSend = document.getElementById('btnSendMessage');
        if (btnSend) btnSend.disabled = false;
        
        // Отправляем все буферизованные сообщения
        while (messageQueue.length > 0) {
            const msg = messageQueue.shift();
            peer.send(JSON.stringify(msg));
        }
        
        // Экспортируем peer в глобальный контекст для игры
        window.peer = peer;
        
        // Удаляем комнату из списка (игра начинается)
        if (currentRoom && window.cloud) {
            deleteRoom(currentRoom.id, window.cloud);
            console.log('[Lobby] Room deleted from list - game started');
        }
        
        // Переходим в игру
        if (typeof window.startMultiplayerGame === 'function') {
            window.startMultiplayerGame(peer, currentRoom);
        } else {
            // Если игра загружена, переключаемся на страницу игры
            const gamePage = document.getElementById('gamePage');
            if (gamePage) {
                switchPage('gamePage');
                console.log('[Lobby] Switched to game page');
            }
        }
    });
    
    peer.on('data', (raw) => {
        try {
            const msg = JSON.parse(raw.toString());
            if (typeof window.handlePeerMessage === 'function') {
                window.handlePeerMessage(msg);
            }
        } catch (e) {
            console.warn('[Lobby] Invalid peer data', e);
        }
    });
    
    peer.on('error', (err) => {
        console.error('[Lobby] Peer error:', err);
        addChatMessage('[System]', 'P2P Error: ' + err.message, 'system');
    });
    
    peer.on('close', () => {
        connected = false;
        console.log('[Lobby] Peer connection closed');
        
        const statusEl = document.getElementById('chatStatus');
        if (statusEl) {
            statusEl.textContent = 'Disconnected';
            statusEl.style.color = '#f00';
        }
        
        const btnSend = document.getElementById('btnSendMessage');
        if (btnSend) btnSend.disabled = true;
    });
}

/**
 * Обработать входящий сигнал из облака
 * @param {CloudWebSocket} cloud
 * @param {string} encodedSignal
 */
function handleCloudSignal(cloud, encodedSignal) {
    try {
        // Декодируем сигнал
        const decodedText = cloud.decodeText(encodedSignal);
        console.log('[Lobby] Raw decoded signal:', decodedText);
        
        const signalData = JSON.parse(decodedText);
        
        console.log('[Lobby] ===== SIGNAL RECEIVED FROM CLOUD =====');
        console.log('[Lobby] Signal room:', signalData.roomId);
        console.log('[Lobby] Current room:', currentRoom ? currentRoom.id : 'NO CURRENT ROOM');
        console.log('[Lobby] Signal from:', signalData.from);
        console.log('[Lobby] Current user:', cloud.user);
        console.log('[Lobby] Signal type:', signalData.type);
        console.log('[Lobby] Peer exists:', !!peer);
        console.log('[Lobby] =========================================');
        
        // Проверяем, это сигнал для нашей комнаты и не от нас самих
        if (!currentRoom) {
            console.log('[Lobby] ❌ No current room, ignoring signal');
            return;
        }
        
        if (signalData.roomId !== currentRoom.id) {
            console.log('[Lobby] ❌ Signal is for different room, ignoring');
            return;
        }
        
        if (signalData.from === cloud.user) {
            console.log('[Lobby] ❌ Signal is from ourselves, ignoring');
            return;
        }
        
        if (!peer) {
            console.log('[Lobby] ❌ Peer not initialized yet, ignoring signal');
            return;
        }
        
        console.log('[Lobby] ✅ Processing signal, type:', signalData.signal.type);
        peer.signal(signalData.signal);
        console.log('[Lobby] ✅ Signal accepted and processed');
        addChatMessage('[System]', 'Signal received: ' + signalData.type, 'system');
        
    } catch (e) {
        console.error('[Lobby] Error handling cloud signal:', e);
        console.error('[Lobby] Signal data was:', encodedSignal);
    }
}

/**
 * Удалить комнату из списка комнат (локально и на сервере)
 * @param {string} roomId - ID комнаты для удаления
 * @param {CloudWebSocket} cloud - облако для синхронизации
 */
function deleteRoom(roomId, cloud) {
    console.log('[Lobby] Deleting room:', roomId);
    
    // Удаляем из локального кеша
    roomsCache = roomsCache.filter(room => room.id !== roomId);
    console.log('[Lobby] Room removed from cache. Remaining rooms:', roomsCache.length);
    
    // Обновляем список на сервере
    try {
        const roomsListData = JSON.stringify(roomsCache);
        cloud.sendSet(CLOUD_ROOMS_LIST_VAR, roomsListData, { encode: true });
        console.log('[Lobby] Updated rooms list on server');
    } catch (e) {
        console.error('[Lobby] Error updating rooms list on server:', e);
    }
    
    // Обновляем список в UI для других игроков (если они еще смотрят список)
    updateRoomsList(cloud);
}

/**
 * Сгенерировать уникальный ID комнаты
 * @returns {string}
 */
function generateRoomId() {
    return 'room_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
}

/**
 * Переключить страницу
 * @param {string} pageName
 */
function switchPage(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    const newPage = document.getElementById(pageName);
    if (newPage) newPage.classList.add('active');
}

/**
 * Добавить сообщение в чат
 * @param {string} sender
 * @param {string} message
 * @param {string} type - 'local', 'remote', 'system'
 */
function addChatMessage(sender, message, type = 'remote') {
    const chatDiv = document.getElementById('chatMessages');
    if (!chatDiv) return;
    
    const msgEl = document.createElement('div');
    msgEl.style.cssText = `padding:6px; margin:4px 0; border-radius:4px; word-wrap:break-word; color: black;`;
    
    switch (type) {
        case 'local':
            msgEl.style.background = '#e3f2fd';
            msgEl.style.borderLeft = '3px solid #2196F3';
            break;
        case 'system':
            msgEl.style.background = '#f5f5f5';
            msgEl.style.color = '#666';
            msgEl.style.fontStyle = 'italic';
            msgEl.style.borderLeft = '3px solid #999';
            break;
        case 'remote':
        default:
            msgEl.style.background = '#f1f8e9';
            msgEl.style.borderLeft = '3px solid #4CAF50';
    }
    
    const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    msgEl.innerHTML = `<strong>${sender}</strong> [${time}]: ${escapeHtml(message)}`;
    
    chatDiv.appendChild(msgEl);
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

/**
 * Очистить чат
 */
function clearChatMessages() {
    const chatDiv = document.getElementById('chatMessages');
    if (chatDiv) chatDiv.innerHTML = '';
}

/**
 * Отправить сообщение в чат
 */
function sendChatMessage() {
    const input = document.getElementById('chatInput');
    if (!input || !input.value.trim()) return;
    
    const message = input.value.trim();
    input.value = '';
    
    // Добавляем в локальный чат
    addChatMessage(window.cloud.user, message, 'local');
    
    // Подготавливаем данные сообщения
    const msgData = {
        from: window.cloud.user,
        message: message,
        timestamp: Date.now(),
        type: 'chat'
    };
    
    if (peer && connected) {
        // Отправляем через P2P
        peer.send(JSON.stringify(msgData));
        console.log('[Chat] Message sent via P2P:', message);
    } else {
        // Буферизуем если нет соединения
        messageQueue.push(msgData);
        console.log('[Chat] Message queued (waiting for connection):', message);
        addChatMessage('[System]', 'Message queued - waiting for connection', 'system');
    }
}

/**
 * Вернуться в лобби
 */
function backToLobby() {
    if (peer) {
        peer.destroy();
        peer = null;
        connected = false;
    }
    messageQueue = [];
    switchPage('lobbyPage');
}

/**
 * Экранировать HTML символы
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Обработать входящее сообщение из P2P
 * @param {Object} msg
 */
function handlePeerMessage(msg) {
    if (msg.type === 'chat') {
        console.log('[Chat] Message received from', msg.from, ':', msg.message);
        addChatMessage(msg.from, msg.message, 'remote');
    }
}

// Экспортируем функции в глобальный контекст
window.handlePeerMessage = handlePeerMessage;
window.sendChatMessage = sendChatMessage;
window.backToLobby = backToLobby;
window.deleteRoom = deleteRoom;
window.currentRoom = currentRoom;
window.cloud = cloud;
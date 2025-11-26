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
        players: 1
    };

    // Добавляем в локальный кеш
    roomsCache.push(roomInfo);
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
                        // Это одна комната, добавляем её
                        const existingIndex = roomsCache.findIndex(r => r.id === roomData.id);
                        if (existingIndex >= 0) {
                            roomsCache[existingIndex] = roomData;
                        } else {
                            roomsCache.push(roomData);
                        }
                        console.log('[Lobby] Added room:', roomData.name);
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

    // Первоначальное обновление списка
    updateRoomsList(cloud);
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
    div.style.cssText = `
        padding: 10px;
        margin: 5px 0;
        background: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
    `;

    const createdDate = new Date(room.createdAt).toLocaleTimeString('ru-RU');

    div.innerHTML = `
        <div style="font-weight: bold; color: #333;">${room.name}</div>
        <div style="font-size: 12px; color: #666;">
            Автор: <strong>${room.author}</strong> | 
            Игроков: <strong>${room.players}</strong> | 
            Создано: <strong>${createdDate}</strong>
        </div>
    `;

    div.onmouseover = () => div.style.background = '#e8e8e8';
    div.onmouseout = () => div.style.background = '#f0f0f0';
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
window.currentRoom = currentRoom;
window.cloud = cloud;
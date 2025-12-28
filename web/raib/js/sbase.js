import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const supabase = createClient(
    'https://vakkrkysnsvrjriraaho.supabase.co',
    'sb_publishable_ESBaZPQSc3b-cDdXqv_FBw_gk6xvwSO'
)
export { supabase }

// тест
const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .limit(1)

console.log(data, error)

window.supabase = supabase;

// window.userid = 4;
if (localStorage.getItem('raib-user')) window.userid = Number(localStorage.getItem('raib-user'));
else window.userid = null;
window.admin = false;

window.usersList;
window.historyList;

async function loadUsers() {
    const { data, error } = await supabase
        .from('accounts')
        .select('*')    // выбираем все колонки
        .order('id', { ascending: true })

    if (error) {
        console.error('Ошибка при получении пользователей:', error)
        return
    }

    window.usersList = {};
    data.forEach(user => {
        window.usersList[user.id] = user;
    });

    const ul = document.getElementById('users')
    ul.innerHTML = ''

    data.forEach(user => {
        const li = document.createElement('li')
        li.textContent = `ID: ${user.id}, Name: ${user.name}, Discord: ${user.discord_id}, Balance: ${user.balance}`
        ul.appendChild(li)
    })

    if (window.userid) {
        const currentUser = data.find(u => u.id === window.userid)
        if (currentUser) {
            document.getElementById('username').textContent = currentUser.name
            const balanceElem = document.getElementById('homeBalanceValue')
            balanceElem.textContent = currentUser.balance
            const balanceElemH = document.getElementById('homeBalanceValueHome')
            balanceElemH.textContent = currentUser.balance
        }
    }

    window.initTransferPage();
}

async function loadHistory() {
    const { data, error } = await supabase
        .from('transfers')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error('Ошибка при получении транзакций:', error);
        notification.error('Load History', 'Failed to load transfer history');
        return;
    }
    
    window.historyList = data;

    const container = document.getElementById('historys');
    container.innerHTML = '';

    // 🔐 фильтрация по правам
    const visibleTransfers = window.admin === true
        ? data
        : data.filter(t =>
            t.from_account === window.userid ||
            t.to_account === window.userid
        );

    if (!visibleTransfers.length) {
        const empty = document.createElement('div');
        empty.className = 'history-empty';
        empty.textContent = 'No transfers available';
        container.appendChild(empty);
        return;
    }

    visibleTransfers.forEach(t => {
        const item = document.createElement('div');
        item.className = 'history-item';

        item.innerHTML = `
            <div class="history-row history-header">
                <span class="history-id">#${t.id}</span>
                <span class="history-date">
                    ${new Date(t.created_at).toLocaleString()}
                </span>
            </div>

            <div class="history-row">
                <div class="history-col">
                    <span class="label">From</span>
                    <span class="value">${usersList[t.from_account].name}</span>
                </div>
                <div class="history-col">
                    <span class="label">To</span>
                    <span class="value">${usersList[t.to_account].name}</span>
                </div>
            </div>

            <div class="history-row">
                <div class="history-amount ${t.from_account === window.userid ? 'out' : 'in'}">
                    ${t.from_account === window.userid ? '-' : '+'}${t.amount}
                </div>
            </div>

            ${t.comment ? `
                <div class="history-row history-comment">
                    ${t.type ? `${t.type} - ${t.comment}` : t.comment}
                </div>
            ` : ''}
        `;

        container.appendChild(item);
    });
}

window.loadUsers = loadUsers;
window.loadHistory = loadHistory;

// Загружаем при старте
loadUsers()
loadHistory()

// пример вызова
async function sendTransfer(fromId, toId, amount, comment, password, type) {
    try {
        // 1. Проверяем существование получателя
        const { data: receiver, error: receiverError } = await window.supabase
            .from('accounts')
            .select('id')
            .eq('id', toId)
            .single();

        if (receiverError || !receiver) {
            notification.error('Transfer', 'Receiver does not exist');
            return;
        }

        // 3. Отправляем перевод
        const { error } = await window.supabase.rpc(
            'make_transfer_with_password',
            {
                p_from: fromId,
                p_to: toId,
                p_amount: amount,
                p_comment: comment,
                p_password: password,
                p_type: type
            }
        );

        if (error) {
            // ❗ неправильный пароль
            if (error.code === 'P0001' && error.message === 'Invalid password') {
                notification.error('Transfer failed', 'Invalid password');
                return;
            }

            // ❗ любая другая ошибка
            notification.error('Transfer error', JSON.stringify(error, null, 2));
            return;
        }

        // ✅ успех
        notification.success('Transfer', 'Money sent successfully');

    } catch (e) {
        notification.error('Transfer error', String(e));
        console.log(e);
    }
}

window.sendTransfer = sendTransfer;

function getUserIdByNameCI(name) {
    if (!window.usersList || !name) return null;
    const searchName = name.toLowerCase();

    for (const [id, user] of Object.entries(window.usersList)) {
        if (user.name?.toLowerCase() === searchName) {
            return Number(id);
        }
    }
    return null;
}
window.getUserIdByNameCI = getUserIdByNameCI;

document.getElementById('login-btn').addEventListener('click', async (e) => {
    window.login();
});

window.login = async function() {
    const name = document.getElementById('login-username').value;
    const pw = document.getElementById('login-password').value;
    if (!name) {
        notification.warning('Login', 'Username required');
        return;
    }
    if (!pw) {
        notification.warning('Login', 'Password required');
        return;
    }
    const id = await getUserIdByNameCI(name);
    if (!id) {
        notification.error('Login', 'User not found');
        return;
    }
    const { data, error } = await supabase.rpc(
        'check_account_password',
        {
            p_account_id: id,
            p_password: pw
        }
    );

    if (error) {
        console.error(error);
        notification.error('Login', 'Password check failed');
        return;
    }

    if (data === true) {
        notification.success('Login', 'Password correct');
    } else {
        notification.error('Login', 'Invalid password');
        return;
    }
    window.userName = name
    window.userid = id
    localStorage.setItem('raib-user', Number(id));
    location.reload();
}
import { supabase } from '../sbase.js';

// Ждём пока bcrypt будет доступен
function waitForBcrypt() {
    return new Promise((resolve, reject) => {
        const maxWaitTime = 5000; // 5 секунд максимум
        const startTime = Date.now();

        const checkBcrypt = () => {
            // Проверяем различные возможные имена
            if (window.dcodeIO && window.dcodeIO.bcrypt) {
                resolve(window.dcodeIO.bcrypt);
                return;
            }
            if (window.bcrypt) {
                resolve(window.bcrypt);
                return;
            }
            if (window.dcryptjs) {
                resolve(window.dcryptjs);
                return;
            }
            if (typeof bcryptjs !== 'undefined') {
                resolve(bcryptjs);
                return;
            }

            // Проверяем timeout
            if (Date.now() - startTime > maxWaitTime) {
                reject(new Error('bcrypt library failed to load'));
                return;
            }

            setTimeout(checkBcrypt, 50);
        };

        checkBcrypt();
    });
}

async function hashPassword(password) {
    const bcrypt = await waitForBcrypt();
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
}

async function registerAccount(name, discordId, password) {
    const passwordHash = await hashPassword(password);

    const { data, error } = await supabase
        .rpc('register_account', {
            p_name: name,
            p_discord_id: discordId,
            p_password_hash: passwordHash
        });

    if (error) {
        throw new Error(error.message);
    }

    return {
        success: true,
        account_id: data
    };
}
window.registerAccount = registerAccount;

document.addEventListener('DOMContentLoaded', () => {
    const registerBtn = document.getElementById('register-btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', handleRegister);
    }
});

async function handleRegister(e) {
    if (e && e.preventDefault) {
        e.preventDefault();
    }

    const username = document.getElementById('register-username').value.trim();
    let discordId = document.getElementById('register-discord').value.trim();
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById('register-password-confirm').value;
    const state = document.getElementById('register-state').value;

    // Валидация
    if (!username) {
        notification.warning('Registration', 'Username is required');
        return;
    }

    if (username.length < 3) {
        notification.warning('Registration', 'Username must be at least 3 characters');
        return;
    }

    if (!password) {
        notification.warning('Registration', 'Password is required');
        return;
    }

    if (!discordId) {
        discordId = 0;
    }

    if (password.length < 4) {
        notification.warning('Registration', 'Password must be at least 4 characters');
        return;
    }

    if (password !== passwordConfirm) {
        notification.error('Registration', 'Passwords do not match');
        return;
    }

    const registerBtn = document.getElementById('register-btn');
    registerBtn.disabled = true;
    registerBtn.textContent = 'Creating account...';

    try {
        const result = await registerAccount(username, discordId, password, state);
        
        notification.success('Registration', `Account created! ID: ${result.account_id}`);
        
        // Очищаем форму
        document.getElementById('register-username').value = '';
        document.getElementById('register-discord').value = '';
        document.getElementById('register-password').value = '';
        document.getElementById('register-password-confirm').value = '';

        // Переходим на страницу логина
        setTimeout(() => {
            pages.switch('plogin');
        }, 1000);

    } catch (e) {
        console.error('Registration failed:', e.message);
        notification.error('Registration', e.message || 'Registration failed');
    } finally {
        const registerBtn = document.getElementById('register-btn');
        registerBtn.disabled = false;
        registerBtn.textContent = 'Create Account';
    }
}

window.handleRegister = handleRegister;
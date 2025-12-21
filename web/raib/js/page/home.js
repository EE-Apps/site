const track = document.querySelector('.slider-track');
const slides = document.querySelectorAll('.slider-track img');
let index = 0;

function nextSlide() {
    index++;
    
    // Если дошли до конца — возвращаемся в начало
    if (index >= slides.length) {
    index = 0;
    }
    
    updateSlide();
}

function updateSlide() {
    // Сдвигаем трек на (номер слайда * 100) процентов
    track.style.transform = `translateX(-${index * 100}%)`;
}

// Запускаем автопрокрутку каждые 3 секунды
let autoPlay = setInterval(nextSlide, 3000);

// Остановка при наведении (полезно для пользователя)
const container = document.querySelector('.slider-container');
container.addEventListener('mouseenter', () => clearInterval(autoPlay));
container.addEventListener('mouseleave', () => autoPlay = setInterval(nextSlide, 3000));

document.addEventListener('DOMContentLoaded', () => {
    const amountInput = document.getElementById('homeTransAmount');
    const passwordInput = document.getElementById('homeTransPassword');
    const receiverInput = document.getElementById('homeTransReciver');
    const sendBtn = document.getElementById('homeTransSend');

    sendBtn.addEventListener('click', async () => {
        const amount = parseInt(amountInput.value);
        const password = passwordInput.value;
        const receiverId = await getUserIdByNameCI(receiverInput.value);
        const type = 'quick';

        if (!amount || amount <= 0) {
            notification.warning('Transfer', 'Invalid amount');
            return;
        }

        if (!password) {
            notification.warning('Transfer', 'Password required');
            return;
        }

        if (!receiverId) {
            notification.warning('Transfer', 'Receiver ID required');
            return;
        }

        await sendTransfer(window.userid, receiverId, amount, 'Web transfer', password, type);

        amountInput.value = '';
        passwordInput.value = '';
        receiverInput.value = '';
    });
});

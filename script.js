document.addEventListener('DOMContentLoaded', function() {
    // Получаем элементы
    const modal = document.getElementById('modal');
    const successModal = document.getElementById('successModal');
    const overlay = document.getElementById('overlay');
    const openModalBtn = document.getElementById('openModal');
    const closeModalBtn = document.getElementById('closeModal');
    const continueBtn = document.getElementById('continueButton');
    const form = document.getElementById('interviewForm');

    // Конфигурация Telegram бота
    const TELEGRAM_BOT_TOKEN = '8175033959:AAFmjxoe_D3322G5StmKF9hS7NAon3iBJfc';
    const TELEGRAM_CHAT_ID = '-1002455597065';

    // Функции открытия/закрытия
    function showModal(modalElement) {
        modalElement.style.display = 'block';
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function hideModal(modalElement) {
        modalElement.style.display = 'none';
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    }

    // Обработчики событий
    openModalBtn.addEventListener('click', () => showModal(modal));
    closeModalBtn.addEventListener('click', () => hideModal(modal));
    overlay.addEventListener('click', () => {
        hideModal(modal);
        hideModal(successModal);
    });
    continueBtn.addEventListener('click', () => hideModal(successModal));

    // Функция для отправки сообщения в Telegram
    async function sendToTelegram(formData) {
        const message = `
🎯 Новая заявка на тестирование!

👤 Имя: ${formData.get('name')}
📱 Телефон: ${formData.get('phone')}
📅 Дата: ${formData.get('date')}
⏰ Время: ${formData.get('time')}
`;

        try {
            const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'HTML'
                })
            });

            if (!response.ok) {
                throw new Error('Ошибка отправки в Telegram');
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    // Обработка отправки формы
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        
        // Отправляем данные в Telegram
        await sendToTelegram(formData);
        
        // Показываем сообщение об успехе
        hideModal(modal);
        showModal(successModal);
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideModal(modal);
            hideModal(successModal);
        }
    });
});
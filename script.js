const modal = document.getElementById('modal');
const successModal = document.getElementById('successModal');
const overlay = document.getElementById('overlay');
const openModalBtn = document.getElementById('openModal');
const closeModalBtn = document.getElementById('closeModal');
const continueBtn = document.getElementById('continueButton');
const form = document.getElementById('interviewForm');

// Telegram Bot configuration
const TELEGRAM_BOT_TOKEN = '8175033959:AAFmjxoe_D3322G5StmKF9hS7NAon3iBJfc';
const TELEGRAM_CHAT_ID = '-1002455597065';

// Валидация телефона
function formatPhoneNumber(input) {
    let phone = input.value.replace(/\D/g, '');
    if (phone.length > 0) {
        phone = '+' + phone;
        if (phone.length > 2) {
            phone = phone.slice(0, 2) + ' (' + phone.slice(2);
        }
        if (phone.length > 7) {
            phone = phone.slice(0, 7) + ') ' + phone.slice(7);
        }
        if (phone.length > 12) {
            phone = phone.slice(0, 12) + '-' + phone.slice(12);
        }
        if (phone.length > 15) {
            phone = phone.slice(0, 15) + '-' + phone.slice(15);
        }
    }
    input.value = phone;
}

// Модальные окна
function showModal(modalElement) {
    modalElement.style.display = 'block';
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Запрет прокрутки фона
}

function hideModal(modalElement) {
    modalElement.style.display = 'none';
    overlay.style.display = 'none';
    document.body.style.overflow = ''; // Возвращаем прокрутку
}

function formatDateTime(date, time) {
    return new Date(`${date}T${time}`).toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// События
openModalBtn.addEventListener('click', () => showModal(modal));
closeModalBtn.addEventListener('click', () => hideModal(modal));
continueBtn.addEventListener('click', () => hideModal(successModal));

// Обработка формы
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        date: formData.get('date'),
        time: formData.get('time')
    };
    
    // Добавим отладочную информацию
    console.log('Отправляемые данные:', data);
    
    // Улучшенная валидация
    if (!data.name?.trim()) {
        alert('Пожалуйста, введите имя');
        return;
    }
    if (!data.phone?.trim()) {
        alert('Пожалуйста, введите телефон');
        return;
    }
    if (!data.date) {
        alert('Пожалуйста, выберите дату');
        return;
    }
    if (!data.time) {
        alert('Пожалуйста, выберите время');
        return;
    }
    
    try {
        const formattedDateTime = formatDateTime(data.date, data.time);
        
        const message = `
🎯 *Новая заявка на тестирование!*

👤 *Имя:* ${data.name}
📱 *Телефон:* ${data.phone}
📅 *Дата и время:* ${formattedDateTime}
        `.trim();
        
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Ошибка Telegram:', errorData);
            throw new Error('Ошибка отправки в Telegram');
        }

        hideModal(modal);
        showModal(successModal);
        form.reset();
        
    } catch (error) {
        console.error('Ошибка при отправке формы:', error);
        alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.');
    }
});

// Маска для телефона
const phoneInput = form.querySelector('input[type="tel"]');
phoneInput.addEventListener('input', (e) => formatPhoneNumber(e.target));

// Закрытие по overlay
overlay.addEventListener('click', () => {
    hideModal(modal);
    hideModal(successModal);
});

// Закрытие по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideModal(modal);
        hideModal(successModal);
    }
});

// Удаляем ограничение на дату
const dateInput = form.querySelector('input[type="date"]');
dateInput.removeAttribute('min'); // Убираем атрибут min
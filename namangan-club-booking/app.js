// ===== Тарифы и цены =====
const TARIFFS = {
    main: { name: 'Main', price: 15000 },
    top: { name: 'Top', price: 23000 },
    vip: { name: 'VIP', price: 30000 }
};

// ===== Инициализация =====
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    setMinDateTime();
    initPhoneMask();
    initFormSubmit();
    initDurationChange();
    loadTheme();
    updatePackages();
    updateTotalPrice();
});

// ===== Навигация =====
function toggleMenu() {
    const menu = document.getElementById('navMenu');
    if (menu) menu.classList.toggle('active');
}

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav-link').forEach(function(link) {
    link.addEventListener('click', function() {
        const menu = document.getElementById('navMenu');
        if (menu) menu.classList.remove('active');
    });
});

// ===== Тема =====
function toggleTheme() {
    const html = document.documentElement;
    const icon = document.getElementById('themeIcon');
    
    if (html.getAttribute('data-theme') === 'dark') {
        html.removeAttribute('data-theme');
        if (icon) icon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    } else {
        html.setAttribute('data-theme', 'dark');
        if (icon) icon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const icon = document.getElementById('themeIcon');
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (icon) icon.className = 'fas fa-sun';
    }
}

// ===== Карта =====
function initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    try {
        const clubLat = 41.005;
        const clubLng = 71.642;
        
        const map = L.map('map', {
            attributionControl: false
        }).setView([clubLat, clubLng], 16);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: ''
        }).addTo(map);
        
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: '<div style="background:linear-gradient(135deg,#8b5cf6,#06b6d4);width:40px;height:40px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 15px rgba(139,92,246,0.4);"><i class="fas fa-gamepad" style="color:white;font-size:16px;transform:rotate(45deg);"></i></div>',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });
        
        const marker = L.marker([clubLat, clubLng], { icon: customIcon }).addTo(map);
        
        marker.bindPopup('<div style="text-align:center;padding:10px;"><h3 style="margin:0 0 5px;color:#8b5cf6;">🎮 Major Gaming</h3><p style="margin:0;color:#666;">ул. Центральная, 12</p><p style="margin:5px 0 0;color:#666;">Работаем 24/7</p></div>').openPopup();
    } catch (e) {
        console.log('Map error:', e);
    }
}

// ===== Форма =====
function setMinDateTime() {
    const datetimeInput = document.getElementById('datetimeInput');
    if (!datetimeInput) return;
    
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    const offset = now.getTimezoneOffset();
    now.setMinutes(now.getMinutes() - offset);
    datetimeInput.min = now.toISOString().slice(0, 16);
}

function initPhoneMask() {
    const phoneInput = document.getElementById('phoneInput');
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0 && !value.startsWith('998')) {
            value = '998' + value;
        }
        if (value.length > 12) {
            value = value.slice(0, 12);
        }
        
        let formatted = '';
        if (value.length > 0) formatted = '+' + value.slice(0, 3);
        if (value.length > 3) formatted += ' ' + value.slice(3, 5);
        if (value.length > 5) formatted += ' ' + value.slice(5, 8);
        if (value.length > 8) formatted += ' ' + value.slice(8, 10);
        if (value.length > 10) formatted += ' ' + value.slice(10, 12);
        
        e.target.value = formatted;
    });
}

function initFormSubmit() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        try {
            submitBooking();
        } catch (error) {
            console.log('Submit error:', error);
            showToast('Ошибка отправки: ' + error.message, 'error');
        }
    });
}

function submitBooking() {
    const name = document.getElementById('nameInput').value.trim();
    const phone = document.getElementById('phoneInput').value.trim();
    const datetime = document.getElementById('datetimeInput').value;
    const duration = document.getElementById('durationSelect').value;
    const pcs = document.getElementById('pcsSelect').value;
    const tariff = document.getElementById('tariffInput').value;
    const comment = document.getElementById('commentInput').value.trim();
    
    // Валидация
    if (!name || name.length < 2) {
        showToast('Введите ваше имя', 'error');
        return;
    }
    
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 12) {
        showToast('Введите полный номер телефона', 'error');
        return;
    }
    
    if (!datetime) {
        showToast('Выберите дату и время', 'error');
        return;
    }
    
    if (new Date(datetime) < new Date()) {
        showToast('Выберите время в будущем', 'error');
        return;
    }
    
    if (!tariff) {
        showToast('Выберите тариф', 'error');
        return;
    }
    
    // Названия тарифов
    const tariffNames = {
        'main': 'Main (15 000 сум/час)',
        'top': 'Top (23 000 сум/час)',
        'vip': 'VIP (30 000 сум/час)'
    };
    
    // Создаем бронирование
    const booking = {
        id: Date.now(),
        name: name,
        phone: phone,
        datetime: datetime,
        duration: duration,
        pcs: parseInt(pcs),
        tariff: tariffNames[tariff] || tariff,
        comment: comment,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    // Форматируем дату
    const dateObj = new Date(datetime);
    const formattedDate = dateObj.toLocaleDateString('ru-RU') + ' в ' + dateObj.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'});
    
    // Сохраняем в Firebase
    if (typeof db !== 'undefined' && db) {
        try {
            db.collection('bookings').add(booking)
                .then(function() {
                    console.log('Бронирование сохранено в Firebase');
                })
                .catch(function(error) {
                    console.log('Firebase error:', error);
                });
        } catch (e) {
            console.log('Firebase exception:', e);
        }
    }
    
    // Отправляем в Telegram
    sendToTelegram(booking, formattedDate);
    
    // Показываем успех
    showSuccessModal(booking, formattedDate);
    
    // Очищаем форму
    document.getElementById('bookingForm').reset();
    document.getElementById('tariffInput').value = '';
    document.getElementById('pcsSelect').value = '1';
    document.querySelectorAll('.tariff-option').forEach(function(el) {
        el.classList.remove('selected');
    });
    document.querySelectorAll('.price-card').forEach(function(el) {
        el.classList.remove('selected');
    });
    setMinDateTime();
    updatePackages();
    updateTotalPrice();
}

// ===== Telegram =====
function sendToTelegram(booking, formattedDate) {
    // НАСТРОЙТЕ ЗДЕСЬ:
    const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN';
    const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID';
    
    if (TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN') {
        console.log('Telegram не настроен. Бронирование сохранено локально.');
        return;
    }
    
    const message = '🎮 НОВАЯ БРОНЬ #' + booking.id + '\n\n' +
        '👤 Клиент: ' + booking.name + '\n' +
        '📱 Телефон: ' + booking.phone + '\n' +
        '📅 Дата: ' + formattedDate + '\n' +
        '⏱ Длительность: ' + booking.duration + ' ч.\n' +
        '🖥 Компьютеров: ' + booking.pcs + ' шт.\n' +
        '💎 Тариф: ' + booking.tariff + '\n' +
        (booking.comment ? '💬 Комментарий: ' + booking.comment + '\n' : '') +
        '\n✅ Позвоните клиенту!';

    fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message
        })
    }).catch(function(err) {
        console.log('Telegram error:', err);
    });
}

// ===== Toast =====
function showToast(message, type) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = 'toast ' + (type || 'success') + ' show';
    
    setTimeout(function() {
        toast.classList.remove('show');
    }, 4000);
}

// ===== Модальное окно успеха =====
function showSuccessModal(booking, formattedDate) {
    const oldModal = document.getElementById('successModal');
    if (oldModal) oldModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'successModal';
    modal.innerHTML = 
        '<div class="modal-overlay" onclick="closeModal()"></div>' +
        '<div class="modal-content">' +
            '<div class="modal-icon">✅</div>' +
            '<h2>Заявка отправлена!</h2>' +
            '<p>Мы свяжемся с вами для подтверждения</p>' +
            '<div class="modal-details">' +
                '<p><strong>Имя:</strong> ' + booking.name + '</p>' +
                '<p><strong>Телефон:</strong> ' + booking.phone + '</p>' +
                '<p><strong>Дата:</strong> ' + formattedDate + '</p>' +
                '<p><strong>Компьютеров:</strong> ' + booking.pcs + ' шт.</p>' +
                '<p><strong>Тариф:</strong> ' + booking.tariff + '</p>' +
            '</div>' +
            '<button class="btn btn-primary" onclick="closeModal()">Отлично!</button>' +
            '<a href="status.html" class="modal-status-link">🔍 Проверить статус брони</a>' +
        '</div>';
    
    const style = document.createElement('style');
    style.textContent = '#successModal{position:fixed;inset:0;z-index:2000;display:flex;align-items:center;justify-content:center;padding:1rem}.modal-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(5px)}.modal-content{position:relative;background:var(--bg-card,#fff);padding:2.5rem;border-radius:20px;text-align:center;max-width:400px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3);animation:modalIn 0.3s ease}@keyframes modalIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}.modal-icon{font-size:4rem;margin-bottom:1rem}.modal-content h2{margin-bottom:0.5rem}.modal-content>p{color:#64748b;margin-bottom:1.5rem}.modal-details{background:var(--bg,#f8fafc);padding:1rem;border-radius:12px;margin-bottom:1.5rem;text-align:left}.modal-details p{margin:0.5rem 0}.modal-status-link{display:block;margin-top:1rem;color:#8b5cf6;text-decoration:none;font-size:0.9rem}.modal-status-link:hover{text-decoration:underline}';
    document.head.appendChild(style);
    document.body.appendChild(modal);
}

function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) modal.remove();
}

// ===== Выбор тарифа в форме =====
function chooseTariff(tariff) {
    // Убираем выделение со всех в форме
    document.querySelectorAll('.tariff-option').forEach(function(el) {
        el.classList.remove('selected');
    });
    
    // Выделяем выбранный в форме
    const selected = document.querySelector('.tariff-option[data-value="' + tariff + '"]');
    if (selected) {
        selected.classList.add('selected');
    }
    
    // Сохраняем значение
    const input = document.getElementById('tariffInput');
    if (input) {
        input.value = tariff;
    }
    
    // Также выделяем карточку в секции цен
    document.querySelectorAll('.price-card').forEach(function(el) {
        el.classList.remove('selected');
    });
    const priceCard = document.querySelector('.price-card[data-tariff="' + tariff + '"]');
    if (priceCard) {
        priceCard.classList.add('selected');
    }
    
    // Обновляем пакеты и итоговую сумму
    updatePackagesForTariff(tariff);
    updateTotalPrice();
}

// ===== Обновление пакетов =====
function updatePackages() {
    // Ничего не выбрано по умолчанию - показываем пустые значения
    const packageName = document.getElementById('packageTariffName');
    const pkg3h = document.getElementById('package3h');
    const pkg5h = document.getElementById('package5h');
    const pkgNight = document.getElementById('packageNight');
    const save3hEl = document.getElementById('package3hSave');
    const save5hEl = document.getElementById('package5hSave');
    
    if (packageName) packageName.textContent = '';
    if (pkg3h) pkg3h.textContent = '— сум';
    if (pkg5h) pkg5h.textContent = '— сум';
    if (pkgNight) pkgNight.textContent = '— сум';
    if (save3hEl) save3hEl.textContent = 'Выберите тариф';
    if (save5hEl) save5hEl.textContent = 'Выберите тариф';
}

function updatePackagesForTariff(tariff) {
    const tariffData = TARIFFS[tariff];
    if (!tariffData) return;
    
    const price = tariffData.price;
    const name = tariffData.name;
    
    // Расчет цен пакетов (со скидкой)
    const price3h = Math.round(price * 3 * 0.9); // 10% скидка
    const price5h = Math.round(price * 5 * 0.87); // 13% скидка
    const priceNight = Math.round(price * 10 * 0.78); // 22% скидка (ночь)
    
    // Экономия
    const save3h = (price * 3) - price3h;
    const save5h = (price * 5) - price5h;
    
    // Форматирование чисел
    function formatNum(n) {
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
    
    // Обновляем DOM
    const packageName = document.getElementById('packageTariffName');
    const pkg3h = document.getElementById('package3h');
    const pkg5h = document.getElementById('package5h');
    const pkgNight = document.getElementById('packageNight');
    const save3hEl = document.getElementById('package3hSave');
    const save5hEl = document.getElementById('package5hSave');
    
    if (packageName) packageName.textContent = '(' + name + ')';
    if (pkg3h) pkg3h.textContent = formatNum(price3h) + ' сум';
    if (pkg5h) pkg5h.textContent = formatNum(price5h) + ' сум';
    if (pkgNight) pkgNight.textContent = formatNum(priceNight) + ' сум';
    if (save3hEl) save3hEl.textContent = 'Экономия ' + formatNum(save3h);
    if (save5hEl) save5hEl.textContent = 'Экономия ' + formatNum(save5h);
}


// ===== Выбор карточки тарифа в секции цен =====
function selectPriceCard(tariff) {
    // Убираем выделение со всех карточек
    document.querySelectorAll('.price-card').forEach(function(el) {
        el.classList.remove('selected');
    });
    
    // Выделяем выбранную карточку
    const selectedCard = document.querySelector('.price-card[data-tariff="' + tariff + '"]');
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Также выбираем тариф в форме бронирования
    chooseTariff(tariff);
    
    // Обновляем пакеты
    updatePackagesForTariff(tariff);
}


// ===== Расчёт итоговой суммы =====
function initDurationChange() {
    const durationSelect = document.getElementById('durationSelect');
    const pcsSelect = document.getElementById('pcsSelect');
    if (durationSelect) {
        durationSelect.addEventListener('change', updateTotalPrice);
    }
    if (pcsSelect) {
        pcsSelect.addEventListener('change', updateTotalPrice);
    }
}

function updateTotalPrice() {
    const tariffInput = document.getElementById('tariffInput');
    const durationSelect = document.getElementById('durationSelect');
    const pcsSelect = document.getElementById('pcsSelect');
    
    if (!tariffInput || !durationSelect) return;
    
    const tariff = tariffInput.value;
    const duration = parseInt(durationSelect.value);
    const pcs = pcsSelect ? parseInt(pcsSelect.value) : 1;
    
    // Обновляем отображение
    const durationText = {
        1: '1 час',
        2: '2 часа',
        3: '3 часа (пакет)',
        5: '5 часов (пакет)',
        10: 'Ночь (10 часов)'
    };
    
    const totalDuration = document.getElementById('totalDuration');
    const totalTariff = document.getElementById('totalTariff');
    const totalPcs = document.getElementById('totalPcs');
    const totalAmount = document.getElementById('totalAmount');
    const totalDiscount = document.getElementById('totalDiscount');
    
    if (totalDuration) totalDuration.textContent = durationText[duration] || duration + ' ч.';
    if (totalPcs) totalPcs.textContent = pcs + ' ПК';
    
    if (!tariff || !TARIFFS[tariff]) {
        if (totalTariff) totalTariff.textContent = '—';
        if (totalAmount) totalAmount.textContent = '— сум';
        if (totalDiscount) totalDiscount.classList.remove('show');
        return;
    }
    
    const tariffData = TARIFFS[tariff];
    const basePrice = tariffData.price;
    
    if (totalTariff) totalTariff.textContent = tariffData.name + ' (' + formatPrice(basePrice) + ' сум/час)';
    
    // Расчёт цены с учётом скидок на пакеты
    let pricePerPc = basePrice * duration;
    let discount = 0;
    let discountText = '';
    
    if (duration === 3) {
        discount = 0.10;
        discountText = '🎁 Скидка 10% на пакет 3 часа!';
    } else if (duration === 5) {
        discount = 0.13;
        discountText = '🎁 Скидка 13% на пакет 5 часов!';
    } else if (duration === 10) {
        discount = 0.22;
        discountText = '🎁 Скидка 22% на ночной пакет!';
    }
    
    if (discount > 0) {
        const savedPerPc = Math.round(pricePerPc * discount);
        pricePerPc = pricePerPc - savedPerPc;
    }
    
    // Умножаем на количество ПК
    const finalPrice = pricePerPc * pcs;
    const totalSaved = Math.round(basePrice * duration * discount * pcs);
    
    if (discount > 0 && totalSaved > 0) {
        discountText += ' (экономия ' + formatPrice(totalSaved) + ' сум)';
    }
    
    if (totalAmount) totalAmount.textContent = formatPrice(Math.round(finalPrice)) + ' сум';
    
    if (totalDiscount) {
        if (discount > 0) {
            totalDiscount.textContent = discountText;
            totalDiscount.classList.add('show');
        } else {
            totalDiscount.classList.remove('show');
        }
    }
}

function formatPrice(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

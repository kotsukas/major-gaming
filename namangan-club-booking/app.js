// ===== Major Gaming v2.1 - Seasonal Effects =====
// ===== Тарифы и цены =====
const TARIFFS = {
    main: { name: 'Main', price: 15000 },
    top: { name: 'Top', price: 23000 },
    vip: { name: 'VIP', price: 30000 }
};

// ===== LocalStorage функции =====
function getBookingsFromLocal() {
    const data = localStorage.getItem('majorgaming_bookings');
    return data ? JSON.parse(data) : [];
}

function saveBookingToLocal(booking) {
    const bookings = getBookingsFromLocal();
    bookings.push(booking);
    localStorage.setItem('majorgaming_bookings', JSON.stringify(bookings));
}

function updateBookingInLocal(id, updates) {
    const bookings = getBookingsFromLocal();
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
        bookings[index] = { ...bookings[index], ...updates };
        localStorage.setItem('majorgaming_bookings', JSON.stringify(bookings));
    }
}

function deleteBookingFromLocal(id) {
    const bookings = getBookingsFromLocal();
    const filtered = bookings.filter(b => b.id !== id);
    localStorage.setItem('majorgaming_bookings', JSON.stringify(filtered));
}

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
    initSeasonalEffects();
});

// ===== Сезонные эффекты =====
function getSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring'; // Март-Май
    if (month >= 5 && month <= 7) return 'summer'; // Июнь-Август
    if (month >= 8 && month <= 10) return 'autumn'; // Сентябрь-Ноябрь
    return 'winter'; // Декабрь-Февраль
}

function initSeasonalEffects() {
    const season = getSeason();
    document.body.setAttribute('data-season', season);
    
    if (season === 'winter') {
        createSnowfall();
    } else if (season === 'autumn') {
        createFallingLeaves();
    } else if (season === 'spring') {
        createPetals();
    }
    // Лето - без эффектов, просто яркие цвета
}

function createSnowfall() {
    const snowContainer = document.createElement('div');
    snowContainer.className = 'snow-container';
    snowContainer.innerHTML = '';
    
    // Создаём 50 снежинок
    for (let i = 0; i < 50; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.innerHTML = '❄';
        snowflake.style.left = Math.random() * 100 + '%';
        snowflake.style.animationDuration = (Math.random() * 3 + 5) + 's';
        snowflake.style.animationDelay = Math.random() * 5 + 's';
        snowflake.style.fontSize = (Math.random() * 10 + 10) + 'px';
        snowflake.style.opacity = Math.random() * 0.6 + 0.4;
        snowContainer.appendChild(snowflake);
    }
    
    document.body.appendChild(snowContainer);
}

function createFallingLeaves() {
    const leavesContainer = document.createElement('div');
    leavesContainer.className = 'leaves-container';
    
    const leafEmojis = ['🍂', '🍁', '🍃'];
    
    for (let i = 0; i < 30; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'falling-leaf';
        leaf.innerHTML = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];
        leaf.style.left = Math.random() * 100 + '%';
        leaf.style.animationDuration = (Math.random() * 5 + 8) + 's';
        leaf.style.animationDelay = Math.random() * 8 + 's';
        leaf.style.fontSize = (Math.random() * 15 + 15) + 'px';
        leavesContainer.appendChild(leaf);
    }
    
    document.body.appendChild(leavesContainer);
}

function createPetals() {
    const petalsContainer = document.createElement('div');
    petalsContainer.className = 'petals-container';
    
    for (let i = 0; i < 25; i++) {
        const petal = document.createElement('div');
        petal.className = 'falling-petal';
        petal.innerHTML = '🌸';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (Math.random() * 5 + 7) + 's';
        petal.style.animationDelay = Math.random() * 7 + 's';
        petal.style.fontSize = (Math.random() * 10 + 12) + 'px';
        petal.style.opacity = Math.random() * 0.5 + 0.5;
        petalsContainer.appendChild(petal);
    }
    
    document.body.appendChild(petalsContainer);
}

// ===== Навигация =====
function toggleMenu() {
    const menu = document.getElementById('navMenu');
    const toggle = document.getElementById('navToggle');
    const overlay = document.getElementById('menuOverlay');
    
    if (menu) menu.classList.toggle('active');
    if (toggle) toggle.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
    
    // Блокируем скролл при открытом меню
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
}

// ===== Активный пункт меню при скролле =====
function initActiveMenuOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const menuLinks = document.querySelectorAll('.menu-link');
    
    function updateActiveLink() {
        const scrollPos = window.scrollY + 150;
        
        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                menuLinks.forEach(function(link) {
                    link.classList.remove('active-link');
                    const href = link.getAttribute('href');
                    if (href === '#' + sectionId) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Вызываем сразу при загрузке
}

// При клике на пункт меню - сразу делаем его активным
function setActiveMenuLink(clickedLink) {
    document.querySelectorAll('.menu-link').forEach(function(link) {
        link.classList.remove('active-link');
    });
    clickedLink.classList.add('active-link');
}

document.addEventListener('DOMContentLoaded', function() {
    initActiveMenuOnScroll();
    
    // Добавляем обработчик клика на все пункты меню
    document.querySelectorAll('.menu-link').forEach(function(link) {
        link.addEventListener('click', function() {
            setActiveMenuLink(this);
        });
    });
});

// ===== Language Dropdown =====
function toggleLangDropdown() {
    const dropdown = document.getElementById('langDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

function selectLang(lang) {
    // Закрываем dropdown
    const dropdown = document.getElementById('langDropdown');
    if (dropdown) dropdown.classList.remove('active');
    
    // Обновляем текст кнопки и опции
    const langText = document.getElementById('langText');
    const langOption = document.querySelector('.lang-option');
    
    if (langText && langOption) {
        langText.textContent = lang.toUpperCase();
        // В dropdown показываем другой язык
        const otherLang = lang === 'ru' ? 'uz' : 'ru';
        langOption.textContent = otherLang.toUpperCase();
        langOption.dataset.lang = otherLang;
    }
    
    // Применяем язык
    currentLang = lang;
    localStorage.setItem('lang', lang);
    applyTranslations();
}

// Закрытие dropdown при клике вне его
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('langDropdown');
    if (dropdown && !dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});

// ===== Анимации при скролле - Colizeum style (повторяющиеся) =====
function initScrollAnimations() {
    const elements = document.querySelectorAll('.scroll-animate');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    // Элемент виден - запускаем анимацию
                    entry.target.classList.add('visible');
                } else {
                    // Элемент не виден - сбрасываем анимацию для повторного запуска
                    entry.target.classList.remove('visible');
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        });
        
        elements.forEach(function(el) {
            observer.observe(el);
        });
    } else {
        elements.forEach(function(el) {
            el.classList.add('visible');
        });
    }
}

// ===== Navbar scroll effect =====
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const currentScrollY = window.scrollY;
                
                // Добавляем фон при скролле
                if (currentScrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                
                // Скрываем при скролле вниз, показываем при скролле вверх
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    navbar.classList.add('hidden');
                } else {
                    navbar.classList.remove('hidden');
                }
                
                lastScrollY = currentScrollY;
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ===== Counter animation =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-num, .stat-item .number');
    
    counters.forEach(function(counter) {
        const target = counter.textContent;
        const numMatch = target.match(/[\d,]+/);
        if (!numMatch) return;
        
        const num = parseInt(numMatch[0].replace(/,/g, ''));
        const suffix = target.replace(numMatch[0], '');
        let current = 0;
        const increment = num / 50;
        const duration = 2000;
        const stepTime = duration / 50;
        
        const updateCounter = function() {
            current += increment;
            if (current < num) {
                counter.textContent = Math.floor(current).toLocaleString() + suffix;
                setTimeout(updateCounter, stepTime);
            } else {
                counter.textContent = target;
            }
        };
        
        const observer = new IntersectionObserver(function(entries) {
            if (entries[0].isIntersecting) {
                updateCounter();
                observer.disconnect();
            }
        });
        
        observer.observe(counter);
    });
}

// Запуск анимаций
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initNavbarScroll();
    animateCounters();
});

// ===== Тема (всегда тёмная) =====
function loadTheme() {
    // Сайт всегда в тёмной теме
}

// ===== Карта =====
function initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    try {
        const clubLat = 40.99417386464675;
        const clubLng = 71.60342322702259;
        
        const map = L.map('map').setView([clubLat, clubLng], 16);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap, © CARTO',
            maxZoom: 20
        }).addTo(map);
        
        map.attributionControl.setPrefix(false);
        
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: '<div style="background:linear-gradient(135deg,#8b5cf6,#06b6d4);width:40px;height:40px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 15px rgba(139,92,246,0.4);"><i class="fas fa-gamepad" style="color:white;font-size:16px;transform:rotate(45deg);"></i></div>',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });
        
        const marker = L.marker([clubLat, clubLng], { icon: customIcon }).addTo(map);
        
        marker.bindPopup('<div style="text-align:center;padding:10px;"><h3 style="margin:0 0 5px;color:#8b5cf6;">🎮 Major Gaming</h3><p style="margin:0;color:#666;">ул. Галаба, 64</p><p style="margin:5px 0 0;color:#666;">Работаем 24/7</p></div>').openPopup();
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
    
    // Сохраняем в localStorage
    saveBookingToLocal(booking);
    
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
    
    const currency = currentLang === 'ru' ? 'сум' : 'so\'m';
    const selectText = TRANSLATIONS[currentLang].pkg_select || 'Выберите тариф';
    
    if (packageName) packageName.textContent = '';
    if (pkg3h) pkg3h.textContent = '— ' + currency;
    if (pkg5h) pkg5h.textContent = '— ' + currency;
    if (pkgNight) pkgNight.textContent = '— ' + currency;
    if (save3hEl) save3hEl.textContent = selectText;
    if (save5hEl) save5hEl.textContent = selectText;
}

function updatePackagesForTariff(tariff) {
    const tariffData = TARIFFS[tariff];
    if (!tariffData) return;
    
    const price = tariffData.price;
    const name = tariffData.name;
    
    // Расчет цен пакетов (без скидок)
    const price3h = price * 3;
    const price5h = price * 5;
    const priceNight = price * 8;
    
    // Форматирование чисел
    function formatNum(n) {
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
    
    const currency = currentLang === 'ru' ? 'сум' : 'so\'m';
    const savingText = TRANSLATIONS[currentLang].pkg_saving || 'Экономия';
    
    // Обновляем DOM
    const packageName = document.getElementById('packageTariffName');
    const pkg3h = document.getElementById('package3h');
    const pkg5h = document.getElementById('package5h');
    const pkgNight = document.getElementById('packageNight');
    const save3hEl = document.getElementById('package3hSave');
    const save5hEl = document.getElementById('package5hSave');
    
    if (packageName) packageName.textContent = '(' + name + ')';
    if (pkg3h) pkg3h.textContent = formatNum(price3h) + ' ' + currency;
    if (pkg5h) pkg5h.textContent = formatNum(price5h) + ' ' + currency;
    if (pkgNight) pkgNight.textContent = formatNum(priceNight) + ' ' + currency;
    if (save3hEl) save3hEl.style.display = 'none';
    if (save5hEl) save5hEl.style.display = 'none';
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
        8: 'Ночь (8 часов)'
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
    
    // Расчёт цены (без скидок)
    const pricePerPc = basePrice * duration;
    const finalPrice = pricePerPc * pcs;
    
    if (totalAmount) totalAmount.textContent = formatPrice(Math.round(finalPrice)) + ' сум';
    
    if (totalDiscount) {
        totalDiscount.classList.remove('show');
    }
}

function formatPrice(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}


// ===== Мультиязычность =====
const TRANSLATIONS = {
    ru: {
        // Навигация
        nav_home: 'Главная',
        nav_about: 'О нас',
        nav_pricing: 'Цены',
        nav_gallery: 'Галерея',
        nav_booking: 'Бронирование',
        nav_contact: 'Контакты',
        nav_status: 'Статус брони',
        nav_bonus: 'Бонусы',
        nav_games: 'Игры',
        
        // Games
        games_badge: 'Игры',
        games_title: 'Популярные игры',
        games_desc: 'Все топовые игры уже установлены и готовы к запуску',
        
        // Hero
        hero_badge: '🎮 Лучший клуб в Намангане',
        hero_desc: 'Современный компьютерный клуб с мощными ПК, комфортной атмосферой и турнирами',
        hero_book: 'Забронировать',
        hero_more: 'Узнать больше',
        hero_subtitle: 'ЛУЧШИЙ КИБЕРСПОРТИВНЫЙ',
        hero_subtitle_accent: 'КЛУБ В НАМАНГАНЕ',
        hero_cta: 'ЗАБРОНИРОВАТЬ',
        hero_bottom_1: 'ИГРА',
        hero_bottom_2: 'НАЧИНАЕТСЯ',
        hero_bottom_3: 'ЗДЕСЬ',
        stat_pcs: 'Мощных ПК',
        stat_work: 'Работаем',
        stat_clients: 'Клиентов',
        
        // About
        about_badge: 'О клубе',
        about_title: 'Почему выбирают нас?',
        about_desc: 'Major Gaming — это не просто компьютерный клуб, это место где рождаются чемпионы',
        feat1_title: 'Мощное железо',
        feat1_desc: 'RTX 4080, Intel i9, 32GB RAM — играй на максималках без лагов',
        feat2_title: '240Hz мониторы',
        feat2_desc: 'Плавная картинка для киберспорта и комфортной игры',
        feat3_title: 'Про периферия',
        feat3_desc: 'HyperX, Logitech, SteelSeries — только лучшее оборудование',
        feat4_title: 'Быстрый интернет',
        feat4_desc: '1 Гбит/с — минимальный пинг в любых онлайн играх',
        feat5_title: 'VIP зона',
        feat5_desc: 'Отдельные комнаты для команд и стримеров',
        feat6_title: 'Кафе-бар',
        feat6_desc: 'Напитки, снеки и горячая еда прямо в клубе',
        
        // Pricing
        pricing_badge: 'Тарифы',
        pricing_title: 'Наши цены',
        pricing_desc: 'Выберите подходящий тариф для игры',
        
        // Gallery
        gallery_badge: 'Галерея',
        gallery_title: 'Наш клуб',
        gallery_desc: 'Посмотрите как выглядит Major Gaming изнутри',
        gal_hall: 'Игровой зал',
        gal_vip: 'VIP комната',
        gal_cafe: 'Кафе-бар',
        gal_tournaments: 'Турниры',
        gal_periphery: 'Периферия',
        
        // Booking
        booking_badge: 'Бронирование',
        booking_title: 'Забронируйте место',
        booking_desc: 'Заполните форму и мы свяжемся с вами для подтверждения',
        
        // Contact
        contact_badge: 'Контакты',
        contact_title: 'Как нас найти',
        contact_desc: 'Приходите к нам в гости!',
        c_address: 'Адрес',
        c_address_val: 'г. Наманган, ул. Галаба, 64, махаллинский сход граждан',
        c_phone: 'Телефон',
        c_hours: 'Режим работы',
        c_hours_val: 'Круглосуточно, 24/7',
        
        // Footer
        footer_desc: 'Лучший игровой клуб в Намангане. Мощные ПК, комфортная атмосфера, честные цены.',
        footer_nav: 'Навигация',
        footer_contacts: 'Контакты',
        footer_address: 'ул. Галаба, 64',
        footer_copy: '© 2025 Major Gaming. Все права защищены.',
        
        // Referral
        referral_badge: 'Реферальная программа',
        referral_title: 'Приведи друга — получи бонус!',
        referral_desc: 'Делитесь кодом с друзьями и получайте скидки',
        ref_step1_title: '1. Поделитесь кодом',
        ref_step1_desc: 'Отправьте свой реферальный код другу',
        ref_step2_title: '2. Друг приходит',
        ref_step2_desc: 'Друг называет код при первом визите',
        ref_step3_title: '3. Оба получают бонус',
        ref_step3_desc: 'Вы — 1 час бесплатно, друг — скидка 20%',
        your_code: 'Ваш реферальный код:',
        generate_code: 'Получить код',
        copy_code: 'Скопировать',
        
        // Booking form
        info_title: 'Информация',
        info_247: 'Работаем 24/7',
        info_30min: 'Бронь за 30 минут до визита',
        info_confirm: 'Подтверждение по телефону',
        info_discount: 'Скидка 10% при онлайн-брони',
        info_call: 'Или позвоните нам:',
        form_name: 'Ваше имя',
        form_name_ph: 'Введите имя',
        form_phone: 'Телефон',
        form_datetime: 'Дата и время',
        form_pcs: 'Кол-во ПК',
        form_duration: 'Длительность',
        form_tariff: 'Выберите тариф',
        form_comment: 'Комментарий (необязательно)',
        form_comment_ph: 'Особые пожелания...',
        form_submit: 'Отправить заявку',
        total_tariff: 'Тариф:',
        total_pcs: 'Компьютеров:',
        total_duration: 'Длительность:',
        total_sum: 'Итого:',
        pc_1: '1 компьютер',
        pc_2: '2 компьютера',
        pc_3: '3 компьютера',
        pc_4: '4 компьютера',
        pc_5: '5 компьютеров',
        pc_6: '6 компьютеров',
        pc_7: '7 компьютеров',
        pc_8: '8 компьютеров',
        pc_9: '9 компьютеров',
        pc_10: '10 компьютеров',
        dur_1: '1 час',
        dur_2: '2 часа',
        dur_3: '3 часа (пакет)',
        dur_5: '5 часов (пакет)',
        dur_10: 'Ночь (10 часов)',
        
        // Packages
        packages_title: 'Выгодные пакеты',
        pkg_3h: '3 часа',
        pkg_5h: '5 часов',
        pkg_night: 'Ночь (00:00-08:00)',
        pkg_night_hours: '8 часов игры!',
        pkg_select: 'Выберите тариф',
        pkg_saving: 'Экономия',
        
        // Chatbot
        bot_online: 'Онлайн',
        bot_greeting: 'Привет! 👋 Я бот Major Gaming. Чем могу помочь?',
        q_prices: '💰 Цены',
        q_hours: '🕐 Часы работы',
        q_address: '📍 Адрес',
        q_booking: '📅 Бронь',
        q_specs: '🖥 Характеристики',
        chat_placeholder: 'Напишите сообщение...',
        
        // Bot answers
        bot_prices: '💰 Наши цены:\n\n• Main — 15 000 сум/час\n• Top — 23 000 сум/час\n• VIP — 30 000 сум/час\n\nЕсть пакеты со скидками!',
        bot_hours: '🕐 Мы работаем круглосуточно, 24/7! Приходите в любое время 🎮',
        bot_address: '📍 Мы находимся по адресу:\nг. Наманган, ул. Галаба, 64\n(махаллинский сход граждан)',
        bot_booking: '📅 Забронировать место можно:\n\n1. Через форму на сайте\n2. По телефону: +998 90 123 45 67\n3. В Telegram: @major_gaming',
        bot_specs: '🖥 Характеристики ПК:\n\n• Main: RTX 3060, 144Hz\n• Top: RTX 4080, 240Hz\n• VIP: RTX 4090, 360Hz\n\nВсе ПК с Intel i9 и 32GB RAM!',
        bot_default: 'Извините, я не понял вопрос 😅\n\nВы можете:\n• Позвонить: +998 90 123 45 67\n• Написать в Telegram: @major_gaming'
    },
    uz: {
        // Навигация
        nav_home: 'Bosh sahifa',
        nav_about: 'Biz haqimizda',
        nav_pricing: 'Narxlar',
        nav_gallery: 'Galereya',
        nav_booking: 'Bron qilish',
        nav_contact: 'Kontaktlar',
        nav_status: 'Bron holati',
        nav_bonus: 'Bonuslar',
        nav_games: 'O\'yinlar',
        
        // Games
        games_badge: 'O\'yinlar',
        games_title: 'Mashhur o\'yinlar',
        games_desc: 'Barcha top o\'yinlar o\'rnatilgan va ishga tayyor',
        
        // Hero
        hero_badge: '🎮 Namangandagi eng yaxshi klub',
        hero_desc: 'Kuchli kompyuterlar, qulay muhit va turnirlar bilan zamonaviy kompyuter klubi',
        hero_book: 'Bron qilish',
        hero_more: 'Batafsil',
        hero_subtitle: 'ENG YAXSHI KIBERSPORT',
        hero_subtitle_accent: 'KLUBI NAMANGANDA',
        hero_cta: 'BRON QILISH',
        hero_bottom_1: 'O\'YIN',
        hero_bottom_2: 'BOSHLANADI',
        hero_bottom_3: 'BU YERDA',
        stat_pcs: 'Kuchli PK',
        stat_work: 'Ishlaymiz',
        stat_clients: 'Mijozlar',
        
        // About
        about_badge: 'Klub haqida',
        about_title: 'Nega bizni tanlashadi?',
        about_desc: 'Major Gaming — bu oddiy kompyuter klubi emas, bu chempionlar tug\'iladigan joy',
        feat1_title: 'Kuchli qurilma',
        feat1_desc: 'RTX 4080, Intel i9, 32GB RAM — maksimal sozlamalarda o\'yna',
        feat2_title: '240Hz monitorlar',
        feat2_desc: 'Kibersport va qulay o\'yin uchun silliq tasvir',
        feat3_title: 'Pro periferiya',
        feat3_desc: 'HyperX, Logitech, SteelSeries — faqat eng yaxshi uskunalar',
        feat4_title: 'Tez internet',
        feat4_desc: '1 Gbit/s — barcha onlayn o\'yinlarda minimal ping',
        feat5_title: 'VIP zona',
        feat5_desc: 'Jamoalar va strimerlar uchun alohida xonalar',
        feat6_title: 'Kafe-bar',
        feat6_desc: 'Ichimliklar, gazaklar va issiq taomlar klubda',
        
        // Pricing
        pricing_badge: 'Tariflar',
        pricing_title: 'Bizning narxlar',
        pricing_desc: 'O\'yin uchun mos tarifni tanlang',
        
        // Gallery
        gallery_badge: 'Galereya',
        gallery_title: 'Bizning klub',
        gallery_desc: 'Major Gaming ichkaridan qanday ko\'rinishini ko\'ring',
        gal_hall: 'O\'yin zali',
        gal_vip: 'VIP xona',
        gal_cafe: 'Kafe-bar',
        gal_tournaments: 'Turnirlar',
        gal_periphery: 'Periferiya',
        
        // Booking
        booking_badge: 'Bron qilish',
        booking_title: 'Joy bron qiling',
        booking_desc: 'Formani to\'ldiring va biz siz bilan bog\'lanamiz',
        
        // Contact
        contact_badge: 'Kontaktlar',
        contact_title: 'Bizni qanday topish mumkin',
        contact_desc: 'Bizga mehmon bo\'ling!',
        c_address: 'Manzil',
        c_address_val: 'Namangan sh., Galaba ko\'chasi, 64, mahalla fuqarolar yig\'ini',
        c_phone: 'Telefon',
        c_hours: 'Ish vaqti',
        c_hours_val: 'Kuniga 24 soat, 24/7',
        
        // Footer
        footer_desc: 'Namangandagi eng yaxshi o\'yin klubi. Kuchli PK, qulay muhit, halol narxlar.',
        footer_nav: 'Navigatsiya',
        footer_contacts: 'Kontaktlar',
        footer_address: 'Galaba ko\'chasi, 64',
        footer_copy: '© 2025 Major Gaming. Barcha huquqlar himoyalangan.',
        
        // Referral
        referral_badge: 'Referal dasturi',
        referral_title: 'Do\'stingizni olib keling — bonus oling!',
        referral_desc: 'Kodni do\'stlaringiz bilan ulashing va chegirmalar oling',
        ref_step1_title: '1. Kodni ulashing',
        ref_step1_desc: 'Referal kodingizni do\'stingizga yuboring',
        ref_step2_title: '2. Do\'st keladi',
        ref_step2_desc: 'Do\'st birinchi tashrifda kodni aytadi',
        ref_step3_title: '3. Ikkalasi bonus oladi',
        ref_step3_desc: 'Siz — 1 soat bepul, do\'st — 20% chegirma',
        your_code: 'Sizning referal kodingiz:',
        generate_code: 'Kod olish',
        copy_code: 'Nusxalash',
        
        // Booking form
        info_title: 'Ma\'lumot',
        info_247: '24/7 ishlaymiz',
        info_30min: 'Tashrifdan 30 daqiqa oldin bron',
        info_confirm: 'Telefon orqali tasdiqlash',
        info_discount: 'Onlayn bronda 10% chegirma',
        info_call: 'Yoki bizga qo\'ng\'iroq qiling:',
        form_name: 'Ismingiz',
        form_name_ph: 'Ismingizni kiriting',
        form_phone: 'Telefon',
        form_datetime: 'Sana va vaqt',
        form_pcs: 'PK soni',
        form_duration: 'Davomiyligi',
        form_tariff: 'Tarifni tanlang',
        form_comment: 'Izoh (ixtiyoriy)',
        form_comment_ph: 'Maxsus istaklar...',
        form_submit: 'Arizani yuborish',
        total_tariff: 'Tarif:',
        total_pcs: 'Kompyuterlar:',
        total_duration: 'Davomiyligi:',
        total_sum: 'Jami:',
        pc_1: '1 kompyuter',
        pc_2: '2 kompyuter',
        pc_3: '3 kompyuter',
        pc_4: '4 kompyuter',
        pc_5: '5 kompyuter',
        pc_6: '6 kompyuter',
        pc_7: '7 kompyuter',
        pc_8: '8 kompyuter',
        pc_9: '9 kompyuter',
        pc_10: '10 kompyuter',
        dur_1: '1 soat',
        dur_2: '2 soat',
        dur_3: '3 soat (paket)',
        dur_5: '5 soat (paket)',
        dur_10: 'Tun (10 soat)',
        
        // Packages
        packages_title: 'Foydali paketlar',
        pkg_3h: '3 soat',
        pkg_5h: '5 soat',
        pkg_night: 'Tun (00:00-08:00)',
        pkg_night_hours: '8 soat o\'yin!',
        pkg_select: 'Tarifni tanlang',
        pkg_saving: 'Tejash',
        
        // Chatbot
        bot_online: 'Onlayn',
        bot_greeting: 'Salom! 👋 Men Major Gaming botiman. Qanday yordam bera olaman?',
        q_prices: '💰 Narxlar',
        q_hours: '🕐 Ish vaqti',
        q_address: '📍 Manzil',
        q_booking: '📅 Bron',
        q_specs: '🖥 Xususiyatlar',
        chat_placeholder: 'Xabar yozing...',
        
        // Bot answers
        bot_prices: '💰 Bizning narxlar:\n\n• Main — 15 000 so\'m/soat\n• Top — 23 000 so\'m/soat\n• VIP — 30 000 so\'m/soat\n\nChegirmali paketlar bor!',
        bot_hours: '🕐 Biz 24/7 ishlaymiz! Istalgan vaqtda keling 🎮',
        bot_address: '📍 Bizning manzil:\nNamangan sh., Galaba ko\'chasi, 64\n(mahalla fuqarolar yig\'ini)',
        bot_booking: '📅 Joy bron qilish:\n\n1. Saytdagi forma orqali\n2. Telefon: +998 90 123 45 67\n3. Telegram: @major_gaming',
        bot_specs: '🖥 PK xususiyatlari:\n\n• Main: RTX 3060, 144Hz\n• Top: RTX 4080, 240Hz\n• VIP: RTX 4090, 360Hz\n\nBarcha PK Intel i9 va 32GB RAM!',
        bot_default: 'Kechirasiz, tushunmadim 😅\n\nSiz:\n• Qo\'ng\'iroq qiling: +998 90 123 45 67\n• Telegram: @major_gaming'
    }
};

let currentLang = localStorage.getItem('lang') || 'ru';

function toggleLang() {
    currentLang = currentLang === 'ru' ? 'uz' : 'ru';
    localStorage.setItem('lang', currentLang);
    updateLanguage();
}

function applyTranslations() {
    updateLanguage();
}

function updateLanguage() {
    const langText = document.getElementById('langText');
    if (langText) langText.textContent = currentLang.toUpperCase();
    
    // Обновляем активный пункт в dropdown
    document.querySelectorAll('.lang-option').forEach(function(opt) {
        opt.classList.remove('active');
        if (opt.dataset.lang === currentLang) {
            opt.classList.add('active');
        }
    });
    
    // Обновляем все элементы с data-lang-key
    document.querySelectorAll('[data-lang-key]').forEach(function(el) {
        const key = el.getAttribute('data-lang-key');
        if (TRANSLATIONS[currentLang][key]) {
            el.textContent = TRANSLATIONS[currentLang][key];
        }
    });
    
    // Обновляем placeholder
    document.querySelectorAll('[data-lang-key-placeholder]').forEach(function(el) {
        const key = el.getAttribute('data-lang-key-placeholder');
        if (TRANSLATIONS[currentLang][key]) {
            el.placeholder = TRANSLATIONS[currentLang][key];
        }
    });
    
    // Обновляем пакеты
    const tariffInput = document.getElementById('tariffInput');
    if (tariffInput && tariffInput.value) {
        updatePackagesForTariff(tariffInput.value);
    } else {
        updatePackages();
    }
    
    // Обновляем итоговую сумму
    updateTotalPrice();
}

// ===== Реферальная система =====
function generateReferralCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'MAJOR-';
    for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    const codeEl = document.getElementById('referralCode');
    if (codeEl) {
        codeEl.textContent = code;
        codeEl.style.animation = 'none';
        codeEl.offsetHeight;
        codeEl.style.animation = 'checkPop 0.3s ease';
    }
    
    localStorage.setItem('referralCode', code);
    showToast(currentLang === 'ru' ? 'Код сгенерирован!' : 'Kod yaratildi!', 'success');
}

function copyReferralCode() {
    const codeEl = document.getElementById('referralCode');
    if (!codeEl) return;
    
    const code = codeEl.textContent;
    if (code === 'MAJOR-XXXXX') {
        showToast(currentLang === 'ru' ? 'Сначала получите код!' : 'Avval kod oling!', 'error');
        return;
    }
    
    navigator.clipboard.writeText(code).then(function() {
        showToast(currentLang === 'ru' ? 'Код скопирован!' : 'Kod nusxalandi!', 'success');
    }).catch(function() {
        showToast(currentLang === 'ru' ? 'Ошибка копирования' : 'Nusxalash xatosi', 'error');
    });
}

// Загрузка сохранённого кода
function loadReferralCode() {
    const savedCode = localStorage.getItem('referralCode');
    if (savedCode) {
        const codeEl = document.getElementById('referralCode');
        if (codeEl) codeEl.textContent = savedCode;
    }
}

// ===== Чат-бот =====
let chatbotOpen = false;

function toggleChatbot() {
    const chatbot = document.getElementById('chatbot');
    const badge = document.querySelector('.chatbot-badge');
    
    chatbotOpen = !chatbotOpen;
    
    if (chatbot) {
        chatbot.classList.toggle('active', chatbotOpen);
    }
    
    if (badge && chatbotOpen) {
        badge.style.display = 'none';
    }
}

function askBot(topic) {
    const answers = {
        prices: TRANSLATIONS[currentLang].bot_prices,
        hours: TRANSLATIONS[currentLang].bot_hours,
        address: TRANSLATIONS[currentLang].bot_address,
        booking: TRANSLATIONS[currentLang].bot_booking,
        specs: TRANSLATIONS[currentLang].bot_specs
    };
    
    const questions = {
        prices: currentLang === 'ru' ? 'Какие у вас цены?' : 'Narxlar qanday?',
        hours: currentLang === 'ru' ? 'Когда вы работаете?' : 'Qachon ishlaysiz?',
        address: currentLang === 'ru' ? 'Где вы находитесь?' : 'Qayerdasiz?',
        booking: currentLang === 'ru' ? 'Как забронировать?' : 'Qanday bron qilish?',
        specs: currentLang === 'ru' ? 'Какие характеристики ПК?' : 'PK xususiyatlari qanday?'
    };
    
    addChatMessage(questions[topic], 'user');
    
    setTimeout(function() {
        addChatMessage(answers[topic] || TRANSLATIONS[currentLang].bot_default, 'bot');
    }, 500);
}

function addChatMessage(text, type) {
    const messages = document.getElementById('chatMessages');
    if (!messages) return;
    
    const msg = document.createElement('div');
    msg.className = 'chat-message ' + type;
    msg.innerHTML = text.replace(/\n/g, '<br>');
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    if (!input || !input.value.trim()) return;
    
    const text = input.value.trim();
    addChatMessage(text, 'user');
    input.value = '';
    
    // Простой анализ сообщения
    setTimeout(function() {
        const lower = text.toLowerCase();
        let answer = TRANSLATIONS[currentLang].bot_default;
        
        if (lower.includes('цен') || lower.includes('стои') || lower.includes('narx') || lower.includes('pul')) {
            answer = TRANSLATIONS[currentLang].bot_prices;
        } else if (lower.includes('врем') || lower.includes('работ') || lower.includes('час') || lower.includes('vaqt') || lower.includes('soat')) {
            answer = TRANSLATIONS[currentLang].bot_hours;
        } else if (lower.includes('адрес') || lower.includes('где') || lower.includes('найти') || lower.includes('manzil') || lower.includes('qayer')) {
            answer = TRANSLATIONS[currentLang].bot_address;
        } else if (lower.includes('брон') || lower.includes('заброн') || lower.includes('bron')) {
            answer = TRANSLATIONS[currentLang].bot_booking;
        } else if (lower.includes('характер') || lower.includes('комп') || lower.includes('pc') || lower.includes('пк') || lower.includes('xususiyat')) {
            answer = TRANSLATIONS[currentLang].bot_specs;
        } else if (lower.includes('привет') || lower.includes('салам') || lower.includes('salom') || lower.includes('hello')) {
            answer = currentLang === 'ru' ? 'Привет! 😊 Рад вас видеть! Чем могу помочь?' : 'Salom! 😊 Sizni ko\'rganimdan xursandman! Qanday yordam bera olaman?';
        } else if (lower.includes('спасибо') || lower.includes('рахмат') || lower.includes('rahmat') || lower.includes('thanks')) {
            answer = currentLang === 'ru' ? 'Пожалуйста! 😊 Ждём вас в Major Gaming!' : 'Arzimaydi! 😊 Sizni Major Gaming\'da kutamiz!';
        }
        
        addChatMessage(answer, 'bot');
    }, 600);
}

function handleChatKey(e) {
    if (e.key === 'Enter') {
        sendChatMessage();
    }
}

// ===== Инициализация новых функций =====
document.addEventListener('DOMContentLoaded', function() {
    updateLanguage();
    loadReferralCode();
});

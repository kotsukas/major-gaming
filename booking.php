<?php
/**
 * Обработка бронирования для CyberZone
 */

header('Content-Type: text/html; charset=utf-8');

// ===== Конфигурация Telegram =====
// Чтобы получить токен: создайте бота через @BotFather в Telegram
// Чтобы получить chat_id: напишите боту, затем откройте https://api.telegram.org/bot<TOKEN>/getUpdates
define('TELEGRAM_BOT_TOKEN', 'YOUR_BOT_TOKEN'); // Замените на свой токен
define('TELEGRAM_CHAT_ID', 'YOUR_CHAT_ID');     // Замените на свой chat_id

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Получение и очистка данных
    $club = 'CyberZone';
    $name = htmlspecialchars(trim($_POST['name'] ?? ''));
    $phone = htmlspecialchars(trim($_POST['phone'] ?? ''));
    $datetime = htmlspecialchars(trim($_POST['datetime'] ?? ''));
    $duration = intval($_POST['duration'] ?? 1);
    $tariff = htmlspecialchars(trim($_POST['tariff'] ?? 'standard'));
    $comment = htmlspecialchars(trim($_POST['comment'] ?? ''));
    
    // Валидация
    $errors = [];
    
    if (empty($name) || strlen($name) < 2) {
        $errors[] = 'Введите корректное имя';
    }
    
    $phoneDigits = preg_replace('/\D/', '', $phone);
    if (strlen($phoneDigits) < 12) {
        $errors[] = 'Введите полный номер телефона';
    }
    
    if (empty($datetime)) {
        $errors[] = 'Выберите дату и время';
    } else {
        $bookingTime = strtotime($datetime);
        if ($bookingTime < time()) {
            $errors[] = 'Нельзя бронировать на прошедшее время';
        }
    }
    
    if (!empty($errors)) {
        showError(implode('<br>', $errors));
        exit();
    }
    
    try {
        // Проверяем существование БД
        if (!file_exists('db.sqlite')) {
            showError('База данных не инициализирована. Сначала откройте init-db.php');
            exit();
        }
        
        $db = new SQLite3('db.sqlite');
        
        // Сохранение бронирования
        $stmt = $db->prepare("INSERT INTO bookings (club, name, phone, datetime, duration, status) VALUES (?, ?, ?, ?, ?, 'pending')");
        $stmt->bindValue(1, $club, SQLITE3_TEXT);
        $stmt->bindValue(2, $name, SQLITE3_TEXT);
        $stmt->bindValue(3, $phone, SQLITE3_TEXT);
        $stmt->bindValue(4, $datetime, SQLITE3_TEXT);
        $stmt->bindValue(5, $duration, SQLITE3_INTEGER);
        $stmt->execute();
        
        $bookingId = $db->lastInsertRowID();
        
        // Названия тарифов
        $tariffNames = [
            'standard' => 'Стандарт (10 000 сум/час)',
            'pro' => 'Про (15 000 сум/час)',
            'vip' => 'VIP (25 000 сум/час)'
        ];
        $tariffName = $tariffNames[$tariff] ?? $tariff;
        
        // Отправка уведомления в Telegram
        sendTelegramNotification($name, $phone, $datetime, $duration, $tariffName, $comment, $bookingId);
        
        // Редирект на главную с успехом
        header("Location: index.html?success=1#booking");
        exit();
        
    } catch (Exception $e) {
        showError('Ошибка при сохранении: ' . $e->getMessage());
    }
} else {
    header("Location: index.html");
    exit();
}

/**
 * Отправка уведомления в Telegram
 */
function sendTelegramNotification($name, $phone, $datetime, $duration, $tariff, $comment, $bookingId) {
    if (TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN') {
        return; // Telegram не настроен
    }
    
    $formattedDate = date('d.m.Y в H:i', strtotime($datetime));
    
    $message = "🎮 *НОВАЯ БРОНЬ #$bookingId*\n";
    $message .= "━━━━━━━━━━━━━━━\n\n";
    $message .= "👤 *Клиент:* $name\n";
    $message .= "📱 *Телефон:* $phone\n";
    $message .= "📅 *Дата:* $formattedDate\n";
    $message .= "⏱ *Длительность:* {$duration} ч.\n";
    $message .= "💎 *Тариф:* $tariff\n";
    
    if (!empty($comment)) {
        $message .= "💬 *Комментарий:* $comment\n";
    }
    
    $message .= "\n━━━━━━━━━━━━━━━\n";
    $message .= "✅ Позвоните клиенту для подтверждения!";
    
    $url = "https://api.telegram.org/bot" . TELEGRAM_BOT_TOKEN . "/sendMessage";
    $data = [
        'chat_id' => TELEGRAM_CHAT_ID,
        'text' => $message,
        'parse_mode' => 'Markdown'
    ];
    
    $options = [
        'http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/x-www-form-urlencoded',
            'content' => http_build_query($data),
            'timeout' => 5
        ]
    ];
    
    $context = stream_context_create($options);
    @file_get_contents($url, false, $context);
}

/**
 * Показ страницы ошибки
 */
function showError($message) {
    echo '<!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Ошибка | CyberZone</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: "Inter", sans-serif; 
                background: linear-gradient(135deg, #fef2f2, #fee2e2); 
                min-height: 100vh;
                display: flex; 
                justify-content: center; 
                align-items: center; 
                padding: 1rem;
            }
            .card { 
                background: white; 
                padding: 3rem; 
                border-radius: 20px; 
                box-shadow: 0 20px 40px rgba(0,0,0,0.1); 
                text-align: center; 
                max-width: 400px;
            }
            .icon { 
                width: 80px;
                height: 80px;
                background: #fef2f2;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 1.5rem;
                font-size: 2.5rem;
            }
            h1 { 
                color: #1e293b; 
                margin-bottom: 1rem;
                font-size: 1.5rem;
            }
            p { 
                color: #64748b; 
                margin-bottom: 2rem;
                line-height: 1.6;
            }
            a { 
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                background: linear-gradient(135deg, #8b5cf6, #06b6d4); 
                color: white; 
                padding: 1rem 2rem; 
                border-radius: 12px; 
                text-decoration: none;
                font-weight: 600;
                transition: transform 0.3s, box-shadow 0.3s;
            }
            a:hover { 
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
            }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="icon">❌</div>
            <h1>Ошибка</h1>
            <p>' . $message . '</p>
            <a href="index.html#booking">← Вернуться назад</a>
        </div>
    </body>
    </html>';
}
?>

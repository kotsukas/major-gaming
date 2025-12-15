<?php
/**
 * Инициализация базы данных
 * Запустите этот файл один раз для создания таблиц
 */

try {
    $db = new SQLite3('db.sqlite');
    
    // Таблица бронирований
    $db->exec("CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        club TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        datetime TEXT NOT NULL,
        duration INTEGER DEFAULT 1,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    
    // Таблица администраторов
    $db->exec("CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    
    // Создание администратора по умолчанию (admin / admin123)
    $hashedPassword = password_hash('admin123', PASSWORD_DEFAULT);
    $stmt = $db->prepare("INSERT OR IGNORE INTO admins (username, password) VALUES (?, ?)");
    $stmt->bindValue(1, 'admin', SQLITE3_TEXT);
    $stmt->bindValue(2, $hashedPassword, SQLITE3_TEXT);
    $stmt->execute();
    
    echo "<!DOCTYPE html>
    <html lang='ru'>
    <head>
        <meta charset='UTF-8'>
        <title>Инициализация БД</title>
        <style>
            body { font-family: 'Segoe UI', sans-serif; background: #f0f9ff; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
            .card { background: white; padding: 2rem 3rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: center; }
            .success { color: #10b981; font-size: 4rem; margin-bottom: 1rem; }
            h1 { color: #1e293b; margin-bottom: 0.5rem; }
            p { color: #64748b; }
            a { display: inline-block; margin-top: 1rem; background: #6366f1; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; }
            a:hover { background: #4f46e5; }
        </style>
    </head>
    <body>
        <div class='card'>
            <div class='success'>✓</div>
            <h1>База данных создана!</h1>
            <p>Таблицы успешно инициализированы.</p>
            <p><strong>Логин:</strong> admin<br><strong>Пароль:</strong> admin123</p>
            <a href='admin.php'>Перейти в админ-панель</a>
        </div>
    </body>
    </html>";
    
} catch (Exception $e) {
    echo "Ошибка: " . $e->getMessage();
}
?>

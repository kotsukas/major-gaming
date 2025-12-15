<?php
/**
 * Админ-панель для управления бронированиями
 */

session_start();

$db = new SQLite3('db.sqlite');

// Обработка входа
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    $stmt = $db->prepare("SELECT * FROM admins WHERE username = ?");
    $stmt->bindValue(1, $username, SQLITE3_TEXT);
    $result = $stmt->execute()->fetchArray();
    
    if ($result && password_verify($password, $result['password'])) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_username'] = $username;
    } else {
        $loginError = 'Неверный логин или пароль';
    }
}

// Обработка выхода
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: admin.php');
    exit();
}

// Обработка действий с бронированиями
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in']) {
    if (isset($_GET['action']) && isset($_GET['id'])) {
        $id = intval($_GET['id']);
        $action = $_GET['action'];
        
        if ($action === 'confirm') {
            $db->exec("UPDATE bookings SET status = 'confirmed' WHERE id = $id");
        } elseif ($action === 'cancel') {
            $db->exec("UPDATE bookings SET status = 'cancelled' WHERE id = $id");
        } elseif ($action === 'delete') {
            $db->exec("DELETE FROM bookings WHERE id = $id");
        }
        
        header('Location: admin.php');
        exit();
    }
}

// Проверка авторизации
$isLoggedIn = isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'];
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Админ-панель | CyberZone</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #6366f1;
            --primary-dark: #4f46e5;
            --success: #10b981;
            --warning: #f59e0b;
            --danger: #ef4444;
            --bg: #f1f5f9;
            --bg-card: #ffffff;
            --text: #1e293b;
            --text-muted: #64748b;
            --border: #e2e8f0;
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Inter', sans-serif;
            background: var(--bg);
            color: var(--text);
            min-height: 100vh;
        }
        
        /* Login Form */
        .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 1rem;
        }
        
        .login-card {
            background: var(--bg-card);
            padding: 2.5rem;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 400px;
        }
        
        .login-card h1 {
            text-align: center;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        
        .login-card h1 i { color: var(--primary); }
        
        .login-card p {
            text-align: center;
            color: var(--text-muted);
            margin-bottom: 2rem;
        }
        
        .form-group {
            margin-bottom: 1rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }
        
        .form-group input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 2px solid var(--border);
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: var(--primary);
        }
        
        .login-btn {
            width: 100%;
            padding: 0.875rem;
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .login-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
        }
        
        .error-msg {
            background: #fef2f2;
            color: var(--danger);
            padding: 0.75rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            text-align: center;
        }
</style>
</head>
<body>
<?php if (!$isLoggedIn): ?>
    <div class="login-container">
        <div class="login-card">
            <h1><i class="fas fa-gamepad"></i> CyberZone</h1>
            <p>Вход в админ-панель</p>
            
            <?php if (isset($loginError)): ?>
                <div class="error-msg"><?= $loginError ?></div>
            <?php endif; ?>
            
            <form method="POST">
                <div class="form-group">
                    <label>Логин</label>
                    <input type="text" name="username" required placeholder="Введите логин">
                </div>
                <div class="form-group">
                    <label>Пароль</label>
                    <input type="password" name="password" required placeholder="Введите пароль">
                </div>
                <button type="submit" name="login" class="login-btn">
                    <i class="fas fa-sign-in-alt"></i> Войти
                </button>
            </form>
        </div>
    </div>
<?php else: 
    include 'admin-dashboard.php';
    exit();
endif; ?>
</body>
</html>

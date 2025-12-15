<?php
// Этот файл будет включен в admin.php для отображения дашборда
// Получение статистики
$totalBookings = $db->querySingle("SELECT COUNT(*) FROM bookings");
$pendingBookings = $db->querySingle("SELECT COUNT(*) FROM bookings WHERE status = 'pending'");
$confirmedBookings = $db->querySingle("SELECT COUNT(*) FROM bookings WHERE status = 'confirmed'");
$todayBookings = $db->querySingle("SELECT COUNT(*) FROM bookings WHERE DATE(datetime) = DATE('now')");

// Фильтрация
$statusFilter = $_GET['status'] ?? 'all';
$dateFilter = $_GET['date'] ?? '';

$query = "SELECT * FROM bookings WHERE 1=1";
if ($statusFilter !== 'all') {
    $query .= " AND status = '$statusFilter'";
}
if (!empty($dateFilter)) {
    $query .= " AND DATE(datetime) = '$dateFilter'";
}
$query .= " ORDER BY created_at DESC";

$bookings = $db->query($query);
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
        
        /* Sidebar */
        .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            width: 250px;
            height: 100vh;
            background: var(--bg-card);
            border-right: 1px solid var(--border);
            padding: 1.5rem;
        }
        
        .sidebar-logo {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.3rem;
            font-weight: 700;
            color: var(--primary);
            margin-bottom: 2rem;
        }
        
        .sidebar-nav a {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 1rem;
            color: var(--text-muted);
            text-decoration: none;
            border-radius: 8px;
            margin-bottom: 0.5rem;
            transition: all 0.3s;
        }
        
        .sidebar-nav a:hover, .sidebar-nav a.active {
            background: rgba(99, 102, 241, 0.1);
            color: var(--primary);
        }
        
        .sidebar-footer {
            position: absolute;
            bottom: 1.5rem;
            left: 1.5rem;
            right: 1.5rem;
        }
        
        .logout-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            width: 100%;
            padding: 0.75rem;
            background: #fef2f2;
            color: var(--danger);
            border: none;
            border-radius: 8px;
            font-size: 0.9rem;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.3s;
        }
        
        .logout-btn:hover {
            background: var(--danger);
            color: white;
        }
        
        /* Main Content */
        .main-content {
            margin-left: 250px;
            padding: 2rem;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }
        
        .header h1 {
            font-size: 1.5rem;
        }
        
        .user-info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            background: var(--bg-card);
            padding: 0.5rem 1rem;
            border-radius: 8px;
        }
        
        .user-info i {
            color: var(--primary);
        }
        
        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .stat-card {
            background: var(--bg-card);
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .stat-card .icon {
            width: 50px;
            height: 50px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.3rem;
            margin-bottom: 1rem;
        }
        
        .stat-card .icon.blue { background: rgba(99, 102, 241, 0.1); color: var(--primary); }
        .stat-card .icon.yellow { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
        .stat-card .icon.green { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .stat-card .icon.red { background: rgba(239, 68, 68, 0.1); color: var(--danger); }
        
        .stat-card .number {
            font-size: 2rem;
            font-weight: 700;
        }
        
        .stat-card .label {
            color: var(--text-muted);
            font-size: 0.9rem;
        }
        
        /* Filters */
        .filters {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
        }
        
        .filters select, .filters input {
            padding: 0.5rem 1rem;
            border: 2px solid var(--border);
            border-radius: 8px;
            font-size: 0.9rem;
            background: var(--bg-card);
        }
        
        .filters select:focus, .filters input:focus {
            outline: none;
            border-color: var(--primary);
        }
        
        /* Table */
        .table-container {
            background: var(--bg-card);
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            overflow: hidden;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        th, td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid var(--border);
        }
        
        th {
            background: var(--bg);
            font-weight: 600;
            color: var(--text-muted);
            font-size: 0.85rem;
            text-transform: uppercase;
        }
        
        tr:hover {
            background: rgba(99, 102, 241, 0.02);
        }
        
        .status {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        
        .status.pending { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
        .status.confirmed { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .status.cancelled { background: rgba(239, 68, 68, 0.1); color: var(--danger); }
        
        .actions {
            display: flex;
            gap: 0.5rem;
        }
        
        .action-btn {
            width: 32px;
            height: 32px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
            text-decoration: none;
        }
        
        .action-btn.confirm { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .action-btn.cancel { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
        .action-btn.delete { background: rgba(239, 68, 68, 0.1); color: var(--danger); }
        
        .action-btn:hover { transform: scale(1.1); }
        
        .empty-state {
            text-align: center;
            padding: 3rem;
            color: var(--text-muted);
        }
        
        .empty-state i {
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.5;
        }
        
        @media (max-width: 768px) {
            .sidebar { display: none; }
            .main-content { margin-left: 0; }
        }
    </style>
</head>
<body>
    <aside class="sidebar">
        <div class="sidebar-logo">
            <i class="fas fa-gamepad"></i>
            CyberZone Admin
        </div>
        <nav class="sidebar-nav">
            <a href="admin.php" class="active"><i class="fas fa-chart-bar"></i> Дашборд</a>
            <a href="index.html"><i class="fas fa-globe"></i> Сайт</a>
        </nav>
        <div class="sidebar-footer">
            <a href="admin.php?logout=1" class="logout-btn">
                <i class="fas fa-sign-out-alt"></i> Выйти
            </a>
        </div>
    </aside>
    
    <main class="main-content">
        <div class="header">
            <h1>Панель управления</h1>
            <div class="user-info">
                <i class="fas fa-user-circle"></i>
                <span><?= htmlspecialchars($_SESSION['admin_username']) ?></span>
            </div>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="icon blue"><i class="fas fa-calendar-check"></i></div>
                <div class="number"><?= $totalBookings ?></div>
                <div class="label">Всего бронирований</div>
            </div>
            <div class="stat-card">
                <div class="icon yellow"><i class="fas fa-clock"></i></div>
                <div class="number"><?= $pendingBookings ?></div>
                <div class="label">Ожидают подтверждения</div>
            </div>
            <div class="stat-card">
                <div class="icon green"><i class="fas fa-check-circle"></i></div>
                <div class="number"><?= $confirmedBookings ?></div>
                <div class="label">Подтверждено</div>
            </div>
            <div class="stat-card">
                <div class="icon red"><i class="fas fa-calendar-day"></i></div>
                <div class="number"><?= $todayBookings ?></div>
                <div class="label">Сегодня</div>
            </div>
        </div>
        
        <h2 style="margin-bottom: 1rem;">Бронирования</h2>
        
        <form class="filters" method="GET">
            <select name="status" onchange="this.form.submit()">
                <option value="all" <?= $statusFilter === 'all' ? 'selected' : '' ?>>Все статусы</option>
                <option value="pending" <?= $statusFilter === 'pending' ? 'selected' : '' ?>>Ожидают</option>
                <option value="confirmed" <?= $statusFilter === 'confirmed' ? 'selected' : '' ?>>Подтверждены</option>
                <option value="cancelled" <?= $statusFilter === 'cancelled' ? 'selected' : '' ?>>Отменены</option>
            </select>
            <input type="date" name="date" value="<?= $dateFilter ?>" onchange="this.form.submit()">
        </form>
        
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Клуб</th>
                        <th>Клиент</th>
                        <th>Телефон</th>
                        <th>Дата/Время</th>
                        <th>Длит.</th>
                        <th>Статус</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    <?php 
                    $hasRows = false;
                    while ($row = $bookings->fetchArray()): 
                        $hasRows = true;
                    ?>
                    <tr>
                        <td>#<?= $row['id'] ?></td>
                        <td><?= htmlspecialchars($row['club']) ?></td>
                        <td><?= htmlspecialchars($row['name']) ?></td>
                        <td><?= htmlspecialchars($row['phone']) ?></td>
                        <td><?= date('d.m.Y H:i', strtotime($row['datetime'])) ?></td>
                        <td><?= $row['duration'] ?> ч.</td>
                        <td>
                            <span class="status <?= $row['status'] ?>">
                                <?php
                                switch($row['status']) {
                                    case 'pending': echo 'Ожидает'; break;
                                    case 'confirmed': echo 'Подтверждено'; break;
                                    case 'cancelled': echo 'Отменено'; break;
                                }
                                ?>
                            </span>
                        </td>
                        <td>
                            <div class="actions">
                                <?php if ($row['status'] === 'pending'): ?>
                                <a href="?action=confirm&id=<?= $row['id'] ?>" class="action-btn confirm" title="Подтвердить">
                                    <i class="fas fa-check"></i>
                                </a>
                                <a href="?action=cancel&id=<?= $row['id'] ?>" class="action-btn cancel" title="Отменить">
                                    <i class="fas fa-times"></i>
                                </a>
                                <?php endif; ?>
                                <a href="?action=delete&id=<?= $row['id'] ?>" class="action-btn delete" title="Удалить" onclick="return confirm('Удалить бронирование?')">
                                    <i class="fas fa-trash"></i>
                                </a>
                            </div>
                        </td>
                    </tr>
                    <?php endwhile; ?>
                    
                    <?php if (!$hasRows): ?>
                    <tr>
                        <td colspan="8">
                            <div class="empty-state">
                                <i class="fas fa-inbox"></i>
                                <p>Бронирований пока нет</p>
                            </div>
                        </td>
                    </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </main>
</body>
</html>

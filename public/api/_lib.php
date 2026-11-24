<?php
// Shared helpers for the admin API (Hostinger shared hosting, PHP 8).
//
// Secrets and data live OUTSIDE the web root (one level above public_html):
//   willydev-admin.php   config file holding the admin password hash (see README)
//   willydev-data/       content.json, automatic backups and uploaded images
// Images are served at /uploads/... by image.php, so redeploying the site never deletes them.

declare(strict_types=1);

if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === '_lib.php') {
    http_response_code(404);
    exit;
}

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

const CONTENT_SECTIONS = [
    'projects', 'designWorks', 'designCategories', 'videoWorks', 'videoCategories',
    'posts', 'testimonials', 'faq', 'services',
    'estimator', 'beforeAfter', 'booking',
];
const MAX_CONTENT_BYTES = 2_000_000;
const BACKUPS_KEPT = 20;

function web_root(): string
{
    // public/ in local dev (php -S), public_html/ on Hostinger
    return rtrim(realpath($_SERVER['DOCUMENT_ROOT'] ?? __DIR__ . '/..') ?: __DIR__ . '/..', '/\\');
}

function private_root(): string
{
    return dirname(web_root());
}

function admin_config(): array
{
    static $config = null;
    if ($config !== null) {
        return $config;
    }
    $file = private_root() . '/willydev-admin.php';

    // Setup helper: a willydev-admin.php uploaded into public_html (e.g. with the
    // hPanel file manager or the Hostinger API, which only write there) is moved
    // out of the web root the first time the API runs.
    $dropped = web_root() . '/willydev-admin.php';
    if (is_file($dropped)) {
        if (@rename($dropped, $file)) {
            @chmod($file, 0600);
        } elseif (!is_file($file)) {
            $file = $dropped; // could not move it: still usable (Apache blocks direct access)
        }
    }

    $config = is_file($file) ? (require $file) : [];
    if (!is_array($config)) {
        $config = [];
    }
    return $config;
}

function data_dir(): string
{
    $dir = admin_config()['data_dir'] ?? (private_root() . '/willydev-data');
    if (!is_dir($dir)) {
        mkdir($dir, 0750, true);
    }
    return $dir;
}

function uploads_dir(): string
{
    return data_dir() . '/uploads';
}

function json_out($data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(string $message, int $status = 400): void
{
    json_out(['error' => $message], $status);
}

function start_admin_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    session_name('wd_admin');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/api/',
        'secure' => $https,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_start();

    // Idle timeout: 8 hours
    if (isset($_SESSION['last_seen']) && time() - $_SESSION['last_seen'] > 8 * 3600) {
        $_SESSION = [];
        session_regenerate_id(true);
    }
    $_SESSION['last_seen'] = time();
}

function is_admin(): bool
{
    start_admin_session();
    return !empty($_SESSION['admin']);
}

// Every state-changing request must come from the admin page itself:
// a logged-in session, the same-origin header and the session's CSRF token.
function require_admin(): void
{
    if (!is_admin()) {
        fail('Session expirée, reconnectez-vous.', 401);
    }
    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!is_string($token) || !hash_equals($_SESSION['csrf'] ?? '', $token)) {
        fail('Jeton de sécurité invalide, rechargez la page.', 403);
    }
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input', false, null, 0, MAX_CONTENT_BYTES + 1);
    if ($raw === false || strlen($raw) > MAX_CONTENT_BYTES) {
        fail('Contenu trop volumineux.', 413);
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        fail('Requête invalide.');
    }
    return $data;
}

function content_file(): string
{
    return data_dir() . '/content.json';
}

function load_content(): array
{
    $file = content_file();
    if (!is_file($file)) {
        return [];
    }
    $data = json_decode((string) file_get_contents($file), true);
    return is_array($data) ? $data : [];
}

function save_content(array $content): void
{
    $dir = data_dir();
    $file = content_file();

    // Keep a timestamped copy of the previous version
    if (is_file($file)) {
        $backups = $dir . '/backups';
        if (!is_dir($backups)) {
            mkdir($backups, 0750, true);
        }
        copy($file, $backups . '/content-' . date('Ymd-His') . '-' . bin2hex(random_bytes(2)) . '.json');
        $old = glob($backups . '/content-*.json') ?: [];
        sort($old);
        foreach (array_slice($old, 0, max(0, count($old) - BACKUPS_KEPT)) as $stale) {
            @unlink($stale);
        }
    }

    $json = json_encode($content, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    $tmp = $file . '.tmp';
    if ($json === false || file_put_contents($tmp, $json, LOCK_EX) === false || !rename($tmp, $file)) {
        fail("Impossible d'enregistrer le contenu sur le serveur.", 500);
    }
}

function client_ip(): string
{
    return (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
}

// ---------------------------------------------------------------------------
// Private API keys (assistant IA, audit) live in willydev-secrets.php, next to
// willydev-admin.php, outside public_html and never committed. Like the admin
// config, a copy dropped into public_html is moved out on first use.
//   <?php return ['anthropic_api_key' => 'sk-ant-...', 'pagespeed_api_key' => 'AIza...'];
function secrets(): array
{
    static $secrets = null;
    if ($secrets !== null) {
        return $secrets;
    }
    $file = private_root() . '/willydev-secrets.php';
    $dropped = web_root() . '/willydev-secrets.php';
    if (is_file($dropped)) {
        if (@rename($dropped, $file)) {
            @chmod($file, 0600);
        } elseif (!is_file($file)) {
            $file = $dropped;
        }
    }
    $secrets = is_file($file) ? (require $file) : [];
    return is_array($secrets) ? $secrets : [];
}

function secret(string $name): string
{
    $value = secrets()[$name] ?? '';
    return is_string($value) ? trim($value) : '';
}

// JSON file stored in willydev-data/ (never web-accessible)
function read_data(string $name, $default = [])
{
    $file = data_dir() . '/' . $name;
    if (!is_file($file)) {
        return $default;
    }
    $data = json_decode((string) file_get_contents($file), true);
    return $data ?? $default;
}

function write_data(string $name, $data): void
{
    $file = data_dir() . '/' . $name;
    $dir = dirname($file);
    if (!is_dir($dir)) {
        mkdir($dir, 0750, true);
    }
    $tmp = $file . '.tmp';
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    if ($json === false || file_put_contents($tmp, $json, LOCK_EX) === false || !rename($tmp, $file)) {
        fail("Impossible d'enregistrer les données sur le serveur.", 500);
    }
}

// Update a JSON data file under an exclusive lock (no lost updates between requests)
function update_data(string $name, callable $fn, $default = [])
{
    $lock = fopen(data_dir() . '/.lock', 'c');
    flock($lock, LOCK_EX);
    try {
        $data = $fn(read_data($name, $default));
        write_data($name, $data);
        return $data;
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
    }
}

// Simple per-IP rate limit for public endpoints. The IP is only kept as a
// salted hash, for the length of the window.
function rate_limit(string $bucket, int $max, int $windowSeconds): void
{
    $key = substr(hash('sha256', $bucket . '|' . client_ip() . '|' . (admin_config()['password_hash'] ?? 'salt')), 0, 24);
    $now = time();
    $over = false;
    update_data('ratelimit.json', function ($all) use ($key, $now, $max, $windowSeconds, &$over) {
        foreach ($all as $k => $times) {
            $all[$k] = array_values(array_filter((array) $times, fn ($t) => $now - $t < 86400));
            if (!$all[$k]) unset($all[$k]);
        }
        $recent = array_filter($all[$key] ?? [], fn ($t) => $now - $t < $windowSeconds);
        if (count($recent) >= $max) {
            $over = true;
            return $all;
        }
        $all[$key][] = $now;
        return $all;
    });
    if ($over) {
        fail('Trop de demandes. Réessayez un peu plus tard.', 429);
    }
}

function clean_text($value, int $max): string
{
    $text = trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', (string) $value) ?? '');
    return mb_substr($text, 0, $max);
}

// Notification to the site owner: e-mail (same mailbox as the contact form)
// plus an instant Telegram message when a bot is configured in willydev-secrets.php
function notify_owner(string $subject, string $text): void
{
    $to = admin_config()['notify_email'] ?? 'contact@willydev.online';
    $headers = "From: Willy Dev <no-reply@willydev.online>\r\nContent-Type: text/plain; charset=UTF-8\r\n";
    @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $text, $headers);
    send_telegram("🔔 $subject\n\n$text");
}

// Returns true when Telegram accepted the message.
// Secrets: 'telegram_bot_token' (from @BotFather) and 'telegram_chat_id' (your chat with the bot).
function send_telegram(string $text): bool
{
    $token = secret('telegram_bot_token');
    $chat = secret('telegram_chat_id');
    if ($token === '' || $chat === '' || !preg_match('/^\d+:[\w-]+$/', $token)) {
        return false;
    }
    $ch = curl_init("https://api.telegram.org/bot$token/sendMessage");
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_TIMEOUT => 8,
        CURLOPT_CONNECTTIMEOUT => 4,
        CURLOPT_POSTFIELDS => [
            'chat_id' => $chat,
            'text' => mb_substr($text, 0, 3900),
            'disable_web_page_preview' => 'true',
        ],
    ]);
    $raw = curl_exec($ch);
    curl_close($ch);
    $data = is_string($raw) ? json_decode($raw, true) : null;
    return !empty($data['ok']);
}

function require_method(string ...$methods): void
{
    if (!in_array($_SERVER['REQUEST_METHOD'], $methods, true)) {
        fail('Méthode non autorisée.', 405);
    }
}

<?php
// GET    -> { authenticated, csrf? , configured }
// POST   { password } -> log in
// DELETE -> log out

declare(strict_types=1);
require __DIR__ . '/_lib.php';

const MAX_ATTEMPTS = 5;
const LOCK_SECONDS = 15 * 60;

function attempts_file(): string
{
    return data_dir() . '/login-attempts.json';
}

function recent_failures(string $ip): array
{
    $all = is_file(attempts_file()) ? json_decode((string) file_get_contents(attempts_file()), true) : [];
    $all = is_array($all) ? $all : [];
    $now = time();
    return array_values(array_filter($all[$ip] ?? [], fn ($t) => is_int($t) && $now - $t < LOCK_SECONDS));
}

function record_failure(string $ip): void
{
    $all = is_file(attempts_file()) ? json_decode((string) file_get_contents(attempts_file()), true) : [];
    $all = is_array($all) ? $all : [];
    $now = time();
    foreach ($all as $key => $times) {
        $all[$key] = array_values(array_filter((array) $times, fn ($t) => is_int($t) && $now - $t < LOCK_SECONDS));
        if (!$all[$key]) {
            unset($all[$key]);
        }
    }
    $all[$ip][] = $now;
    file_put_contents(attempts_file(), json_encode($all), LOCK_EX);
}

function clear_failures(string $ip): void
{
    if (!is_file(attempts_file())) {
        return;
    }
    $all = json_decode((string) file_get_contents(attempts_file()), true);
    if (is_array($all) && isset($all[$ip])) {
        unset($all[$ip]);
        file_put_contents(attempts_file(), json_encode($all), LOCK_EX);
    }
}

$hash = admin_config()['password_hash'] ?? '';
$configured = is_string($hash) && $hash !== '';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if (is_admin()) {
            json_out(['authenticated' => true, 'configured' => true, 'csrf' => $_SESSION['csrf']]);
        }
        json_out([
            'authenticated' => false,
            'configured' => $configured,
            'needsUsername' => (string) (admin_config()['username'] ?? '') !== '',
        ]);

    case 'POST':
        if (!$configured) {
            fail("L'admin n'est pas encore configuré sur le serveur (fichier willydev-admin.php manquant).", 503);
        }
        $ip = client_ip();
        if (count(recent_failures($ip)) >= MAX_ATTEMPTS) {
            fail('Trop de tentatives. Réessayez dans 15 minutes.', 429);
        }
        $body = read_json_body();
        $password = $body['password'] ?? '';
        $username = $body['username'] ?? '';
        // Username is optional in the config; when set it must match (case and spaces ignored)
        $expectedUser = (string) (admin_config()['username'] ?? '');
        $normalize = fn ($u) => (function_exists("mb_strtolower") ? "mb_strtolower" : "strtolower")(preg_replace('/\s+/u', ' ', trim((string) $u)) ?? '');
        $userOk = $expectedUser === '' || (is_string($username) && hash_equals($normalize($expectedUser), $normalize($username)));
        $passOk = is_string($password) && password_verify($password, $hash);
        if (!$userOk || !$passOk) {
            record_failure($ip);
            usleep(400000);
            fail('Identifiant ou mot de passe incorrect.', 401);
        }
        clear_failures($ip);
        start_admin_session();
        session_regenerate_id(true);
        $_SESSION['admin'] = true;
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
        $_SESSION['last_seen'] = time();
        json_out(['authenticated' => true, 'csrf' => $_SESSION['csrf']]);

    case 'DELETE':
        start_admin_session();
        $_SESSION = [];
        session_destroy();
        json_out(['authenticated' => false]);

    default:
        fail('Méthode non autorisée.', 405);
}

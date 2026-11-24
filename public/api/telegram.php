<?php
// Telegram alerts setup (admin only)
// GET  -> { configured, hasToken, chats: [{id, name}] }  (chats that wrote to the bot, to find your chat id)
// POST -> send a test message

declare(strict_types=1);
require __DIR__ . '/_lib.php';

if (!is_admin()) {
    fail('Session expirée, reconnectez-vous.', 401);
}

$token = secret('telegram_bot_token');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $chats = [];
    if ($token !== '' && preg_match('/^\d+:[\w-]+$/', $token)) {
        // Recent messages sent to the bot: lets the admin read their chat id
        $ch = curl_init("https://api.telegram.org/bot$token/getUpdates?limit=20");
        curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 8]);
        $data = json_decode((string) curl_exec($ch), true);
        curl_close($ch);
        foreach ($data['result'] ?? [] as $u) {
            $c = $u['message']['chat'] ?? null;
            if ($c) {
                $chats[(string) $c['id']] = trim(($c['first_name'] ?? '') . ' ' . ($c['last_name'] ?? '') . ' ' . ($c['title'] ?? ''));
            }
        }
    }
    json_out([
        'hasToken' => $token !== '',
        'configured' => $token !== '' && secret('telegram_chat_id') !== '',
        'chats' => array_map(fn ($id, $name) => ['id' => $id, 'name' => $name], array_keys($chats), $chats),
    ]);
}

require_method('POST');
require_admin();
if (!send_telegram("✅ Test : les alertes du site willydev.online arrivent bien ici.")) {
    fail("Telegram n'a pas accepté le message : vérifiez le jeton du bot et l'identifiant de discussion, et que vous avez bien écrit /start au bot.", 502);
}
json_out(['ok' => true]);

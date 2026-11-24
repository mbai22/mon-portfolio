<?php
// Website assistant (chat bubble), answered by Claude from the site's own content.
// GET                        -> { available }
// POST { messages: [...] }   -> { reply }   (public, rate limited)
// The Anthropic API key lives in willydev-secrets.php ('anthropic_api_key'), never in the code.
// Raw HTTP on purpose: Hostinger builds the site with Vite only, there is no Composer install
// on the server for the PHP SDK.

declare(strict_types=1);
require __DIR__ . '/_lib.php';

const CHAT_MODEL = 'claude-opus-5-5';
const MAX_TURNS = 16;
const MAX_CHARS = 1200;

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    json_out(['available' => secret('anthropic_api_key') !== '']);
}
require_method('POST');

$key = secret('anthropic_api_key');
if ($key === '') {
    fail("L'assistant n'est pas encore activé. Écrivez-moi sur WhatsApp, je réponds vite !", 503);
}

$body = read_json_body();
$history = array_slice(is_array($body['messages'] ?? null) ? $body['messages'] : [], -MAX_TURNS);
$messages = [];
foreach ($history as $m) {
    $role = ($m['role'] ?? '') === 'assistant' ? 'assistant' : 'user';
    $text = clean_text($m['content'] ?? '', MAX_CHARS);
    if ($text === '') continue;
    // The API needs alternating turns starting with the user
    if (!$messages && $role === 'assistant') continue;
    if ($messages && end($messages)['role'] === $role) {
        $messages[count($messages) - 1]['content'] .= "\n\n" . $text;
    } else {
        $messages[] = ['role' => $role, 'content' => $text];
    }
}
if (!$messages || end($messages)['role'] !== 'user') {
    fail('Message vide.');
}

rate_limit('chat', 30, 3600);
rate_limit('chat-day', 80, 86400);

// ---- What the assistant knows: the site's content (admin edits over the built-in content) ----
$knowledge = [];
$builtin = __DIR__ . '/_knowledge.json';           // written at build time by scripts/prerender.mjs
if (is_file($builtin)) {
    $knowledge = json_decode((string) file_get_contents($builtin), true) ?: [];
}
foreach (load_content() as $section => $value) {
    if (in_array($section, ['services', 'faq', 'estimator', 'booking', 'projects', 'testimonials'], true)) {
        $knowledge[$section] = $value;
    }
}
$facts = json_encode(array_intersect_key($knowledge, array_flip(['services', 'faq', 'estimator', 'booking', 'projects', 'testimonials'])),
    JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

$system = <<<TXT
Tu es l'assistant du site willydev.online, le site de Willy (Willy Dev), développeur web et mobile, graphiste et monteur vidéo indépendant basé à N'Djamena, au Tchad.

Ton rôle : répondre aux visiteurs sur les services de Willy, ses tarifs de départ, ses délais et sa façon de travailler, puis les orienter vers la bonne prochaine étape. Tu parles au nom de Willy à la troisième personne (« Willy peut… »), avec un ton chaleureux et professionnel.

Règles :
- Réponds dans la langue du visiteur (français, arabe ou anglais). Phrases courtes : 2 à 5 phrases, pas de titres ni de tableaux. Une petite liste à puces seulement si elle aide vraiment.
- Appuie-toi uniquement sur les informations ci-dessous. Si une information n'y est pas (prix précis d'un projet particulier, disponibilité exacte, technologie non listée…), dis-le simplement et propose d'en parler à Willy plutôt que de deviner.
- Les prix sont des prix de départ en FCFA ; le prix final dépend du projet et se fixe par devis gratuit.
- Prochaines étapes à proposer selon le cas : l'estimateur de prix sur /devis, un appel découverte gratuit de 15 minutes sur /rendez-vous, l'audit gratuit d'un site existant sur /audit, ou WhatsApp au +235 87 26 88 96. Écris ces adresses telles quelles (/devis, /rendez-vous, /audit) : le site les transforme en liens.
- Ne demande jamais de mot de passe, de données bancaires ni de pièce d'identité. Ne prends aucun engagement ferme (prix, date de livraison) au nom de Willy.
- Si on te demande autre chose que les services de Willy, réponds brièvement puis ramène la conversation au projet du visiteur.

Informations du site (JSON, à jour) :
$facts
TXT;

$payload = [
    'model' => CHAT_MODEL,
    'max_tokens' => 4000,
    'output_config' => ['effort' => 'low'],
    // On a policy decline, the API re-runs the turn on a suitable fallback model
    'fallbacks' => 'default',
    'system' => [['type' => 'text', 'text' => $system, 'cache_control' => ['type' => 'ephemeral']]],
    'messages' => $messages,
];

@set_time_limit(90);
$ch = curl_init('https://api.anthropic.com/v1/messages');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_TIMEOUT => 75,
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_HTTPHEADER => [
        'content-type: application/json',
        'x-api-key: ' . $key,
        'anthropic-version: 2026-10-21',
        'anthropic-beta: server-side-fallback-2026-07-01',
    ],
    CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
]);
$raw = curl_exec($ch);
$status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
curl_close($ch);

$data = is_string($raw) ? json_decode($raw, true) : null;
if ($status === 429 || $status === 529) {
    fail("L'assistant est très sollicité, réessayez dans un instant ou écrivez sur WhatsApp.", 503);
}
if ($status !== 200 || !is_array($data)) {
    error_log('willydev chat: HTTP ' . $status . ' ' . substr((string) $raw, 0, 300));
    fail("L'assistant ne répond pas pour le moment. Écrivez-moi sur WhatsApp, je réponds vite !", 502);
}

if (($data['stop_reason'] ?? '') === 'refusal') {
    json_out(['reply' => "Je ne peux pas répondre à cette demande. Pour votre projet, Willy vous répond directement sur WhatsApp au +235 87 26 88 96."]);
}

$reply = '';
foreach ($data['content'] ?? [] as $block) {
    if (($block['type'] ?? '') === 'text') {
        $reply .= $block['text'];
    }
}
$reply = trim($reply);
if ($reply === '') {
    fail("Je n'ai pas compris, pouvez-vous reformuler ?", 502);
}

json_out(['reply' => $reply]);

<?php
// Client space: one private page per project at /client/<token>.
// Public (with the secret token):
//   GET  ?token=…                          -> the project as the client sees it
//   POST ?token=…  {action:"message", text} | {action:"approve", stepId}
// Admin:
//   GET                 -> every project (with private notes)
//   POST   {project}    -> create (a new secret token is generated)
//   PUT    {project}    -> update
//   DELETE ?id=…        -> remove

declare(strict_types=1);
require __DIR__ . '/_lib.php';

const CLIENTS = 'clients.json';
const STEP_STATUSES = ['todo', 'doing', 'review', 'done'];

function find_by_token(array $all, string $token): ?int
{
    if (!preg_match('/^[a-f0-9]{32}$/', $token)) return null;
    foreach ($all as $i => $p) {
        if (hash_equals($p['token'] ?? '', $token)) return $i;
    }
    return null;
}

// What the client is allowed to see
function public_view(array $p): array
{
    unset($p['notes'], $p['id']);
    $p['messages'] = array_values($p['messages'] ?? []);
    return $p;
}

// Keep only known fields, with sane types and lengths
function sanitize_project(array $in, array $existing = []): array
{
    $steps = [];
    foreach (array_slice((array) ($in['steps'] ?? []), 0, 30) as $s) {
        if (!is_array($s)) continue;
        $title = clean_text($s['title'] ?? '', 120);
        if ($title === '') continue;
        $steps[] = [
            'id' => preg_match('/^[\w-]{1,40}$/', (string) ($s['id'] ?? '')) ? $s['id'] : bin2hex(random_bytes(4)),
            'title' => $title,
            'note' => clean_text($s['note'] ?? '', 600),
            'status' => in_array($s['status'] ?? '', STEP_STATUSES, true) ? $s['status'] : 'todo',
            'approvedAt' => is_string($s['approvedAt'] ?? null) ? $s['approvedAt'] : null,
        ];
    }
    $files = [];
    foreach (array_slice((array) ($in['deliverables'] ?? []), 0, 40) as $f) {
        if (!is_array($f)) continue;
        $url = trim((string) ($f['url'] ?? ''));
        if (!preg_match('#^(https://|/uploads/)#', $url)) continue;
        $files[] = ['title' => clean_text($f['title'] ?? 'Fichier', 120), 'url' => mb_substr($url, 0, 500)];
    }
    return [
        'id' => $existing['id'] ?? bin2hex(random_bytes(6)),
        'token' => $existing['token'] ?? bin2hex(random_bytes(16)),
        'client' => clean_text($in['client'] ?? '', 120),
        'phone' => clean_text($in['phone'] ?? '', 30),
        'project' => clean_text($in['project'] ?? '', 160),
        'summary' => clean_text($in['summary'] ?? '', 1500),
        'startDate' => preg_match('/^\d{4}-\d{2}-\d{2}$/', (string) ($in['startDate'] ?? '')) ? $in['startDate'] : '',
        'dueDate' => preg_match('/^\d{4}-\d{2}-\d{2}$/', (string) ($in['dueDate'] ?? '')) ? $in['dueDate'] : '',
        'amount' => max(0, (int) ($in['amount'] ?? 0)),
        'paid' => max(0, (int) ($in['paid'] ?? 0)),
        'steps' => $steps,
        'deliverables' => $files,
        'notes' => clean_text($in['notes'] ?? '', 3000),
        'messages' => $existing['messages'] ?? [],
        'createdAt' => $existing['createdAt'] ?? date(DATE_ATOM),
        'updatedAt' => date(DATE_ATOM),
    ];
}

$method = $_SERVER['REQUEST_METHOD'];
$token = (string) ($_GET['token'] ?? '');

// ----- client side -----
if ($token !== '') {
    $all = read_data(CLIENTS, []);
    $i = find_by_token($all, $token);
    if ($i === null) {
        rate_limit('client-miss', 20, 3600);   // slows down token guessing
        fail('Ce lien n’est pas valide. Vérifiez-le ou demandez-en un nouveau à Willy.', 404);
    }
    if ($method === 'GET') {
        json_out(public_view($all[$i]));
    }
    require_method('POST');
    rate_limit('client-post', 30, 3600);
    $body = read_json_body();
    $action = $body['action'] ?? '';
    $project = null;
    $note = '';
    update_data(CLIENTS, function ($all) use ($token, $action, $body, &$project, &$note) {
        $i = find_by_token($all, $token);
        if ($i === null) fail('Projet introuvable.', 404);
        if ($action === 'message') {
            $text = clean_text($body['text'] ?? '', 2000);
            if ($text === '') fail('Message vide.');
            if (count($all[$i]['messages'] ?? []) >= 300) fail('Trop de messages sur ce projet, écrivez sur WhatsApp.');
            $all[$i]['messages'][] = ['from' => 'client', 'text' => $text, 'at' => date(DATE_ATOM)];
            $note = "Nouveau message de {$all[$i]['client']} :\n\n$text";
        } elseif ($action === 'approve') {
            $found = false;
            foreach ($all[$i]['steps'] as &$s) {
                if ($s['id'] === ($body['stepId'] ?? '') && $s['status'] === 'review') {
                    $s['status'] = 'done';
                    $s['approvedAt'] = date(DATE_ATOM);
                    $found = true;
                    $note = "{$all[$i]['client']} a validé l’étape « {$s['title']} ».";
                }
            }
            unset($s);
            if (!$found) fail('Cette étape ne peut pas être validée.');
        } else {
            fail('Action inconnue.');
        }
        $project = $all[$i];
        return $all;
    });
    notify_owner("Espace client : {$project['project']}", $note . "\n\nOuvrir : https://willydev.online/admin#clients\n");
    json_out(public_view($project));
}

// ----- admin side -----
if (!is_admin()) {
    fail('Session expirée, reconnectez-vous.', 401);
}
if ($method === 'GET') {
    json_out(['projects' => read_data(CLIENTS, [])]);
}
require_admin();

if ($method === 'POST' || $method === 'PUT') {
    $body = read_json_body();
    $in = is_array($body['project'] ?? null) ? $body['project'] : [];
    if (clean_text($in['client'] ?? '', 120) === '' || clean_text($in['project'] ?? '', 160) === '') {
        fail('Indiquez le client et le nom du projet.');
    }
    $saved = null;
    update_data(CLIENTS, function ($all) use ($in, $method, &$saved) {
        if ($method === 'POST') {
            $saved = sanitize_project($in);
            $all[] = $saved;
            return $all;
        }
        foreach ($all as &$p) {
            if ($p['id'] === ($in['id'] ?? '')) {
                $saved = sanitize_project($in, $p);
                // Willy's replies are appended here
                $reply = clean_text($in['reply'] ?? '', 2000);
                if ($reply !== '') $saved['messages'][] = ['from' => 'willy', 'text' => $reply, 'at' => date(DATE_ATOM)];
                $p = $saved;
            }
        }
        unset($p);
        if (!$saved) fail('Projet introuvable.', 404);
        return $all;
    });
    json_out(['project' => $saved]);
}

if ($method === 'DELETE') {
    $id = (string) ($_GET['id'] ?? '');
    update_data(CLIENTS, fn ($all) => array_values(array_filter($all, fn ($p) => $p['id'] !== $id)));
    json_out(['ok' => true]);
}

fail('Méthode non autorisée.', 405);

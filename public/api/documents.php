<?php
// Quotes (devis) and invoices (factures) in FCFA.
// Public, with the document's secret token:
//   GET  ?token=…                 -> { doc, issuer }      (never drafts)
//   POST ?token=… {action:"accept"} -> client accepts a quote
//   GET  ?client=<project token>  -> documents shared in that client space
// Admin:
//   GET                     -> { docs, issuer, projects }
//   POST   {doc}            -> create (number generated: D-2026-001 / F-2026-001)
//   POST   {action:"convert", id} -> invoice created from a quote
//   PUT    {doc}            -> update            PUT {issuer} -> issuer details
//   DELETE ?id=…            -> remove

declare(strict_types=1);
require __DIR__ . '/_lib.php';

const DOCS = 'documents.json';
const ISSUER = 'issuer.json';
const STATUSES = ['draft', 'sent', 'accepted', 'refused', 'paid', 'cancelled'];

function find_doc(array $docs, string $token): ?int
{
    if (!preg_match('/^[a-f0-9]{32}$/', $token)) return null;
    foreach ($docs as $i => $d) {
        if (hash_equals($d['token'] ?? '', $token)) return $i;
    }
    return null;
}

function public_doc(array $d): array
{
    unset($d['private']);
    return $d;
}

function sanitize_issuer(array $in): array
{
    $f = fn ($k, $n = 200) => clean_text($in[$k] ?? '', $n);
    return [
        'name' => $f('name', 120), 'activity' => $f('activity', 160), 'address' => $f('address', 300),
        'phone' => $f('phone', 60), 'email' => $f('email', 120), 'website' => $f('website', 120),
        'nif' => $f('nif', 60), 'rccm' => $f('rccm', 60),
        'payment' => $f('payment', 800), 'footer' => $f('footer', 500),
    ];
}

function sanitize_doc(array $in, array $existing = []): array
{
    $lines = [];
    foreach (array_slice((array) ($in['lines'] ?? []), 0, 60) as $l) {
        if (!is_array($l)) continue;
        $label = clean_text($l['label'] ?? '', 300);
        if ($label === '') continue;
        $lines[] = [
            'label' => $label,
            'qty' => max(0, round((float) ($l['qty'] ?? 1), 2)),
            'price' => max(0, (int) ($l['price'] ?? 0)),
        ];
    }
    $date = fn ($k) => preg_match('/^\d{4}-\d{2}-\d{2}$/', (string) ($in[$k] ?? '')) ? $in[$k] : '';
    $type = ($existing['type'] ?? $in['type'] ?? 'quote') === 'invoice' ? 'invoice' : 'quote';
    return [
        'id' => $existing['id'] ?? bin2hex(random_bytes(6)),
        'token' => $existing['token'] ?? bin2hex(random_bytes(16)),
        'type' => $type,
        'number' => $existing['number'] ?? '',
        'status' => in_array($in['status'] ?? '', STATUSES, true) ? $in['status'] : ($existing['status'] ?? 'draft'),
        'date' => $date('date') ?: date('Y-m-d'),
        'dueDate' => $date('dueDate'),
        'title' => clean_text($in['title'] ?? '', 200),
        'client' => [
            'name' => clean_text($in['client']['name'] ?? '', 160),
            'phone' => clean_text($in['client']['phone'] ?? '', 40),
            'email' => clean_text($in['client']['email'] ?? '', 120),
            'address' => clean_text($in['client']['address'] ?? '', 300),
        ],
        'projectId' => preg_match('/^[a-f0-9]{12}$/', (string) ($in['projectId'] ?? '')) ? $in['projectId'] : '',
        'lines' => $lines,
        'discount' => max(0, (int) ($in['discount'] ?? 0)),
        'taxRate' => max(0, min(30, round((float) ($in['taxRate'] ?? 0), 2))),
        'deposit' => max(0, min(100, (int) ($in['deposit'] ?? 0))),
        'paid' => max(0, (int) ($in['paid'] ?? 0)),
        'notes' => clean_text($in['notes'] ?? '', 2000),
        'sourceId' => $existing['sourceId'] ?? '',
        'acceptedAt' => $existing['acceptedAt'] ?? null,
        'createdAt' => $existing['createdAt'] ?? date(DATE_ATOM),
        'updatedAt' => date(DATE_ATOM),
    ];
}

function next_number(array $docs, string $type): string
{
    $prefix = ($type === 'invoice' ? 'F' : 'D') . '-' . date('Y') . '-';
    $max = 0;
    foreach ($docs as $d) {
        if (str_starts_with($d['number'] ?? '', $prefix)) {
            $max = max($max, (int) substr($d['number'], strlen($prefix)));
        }
    }
    return $prefix . str_pad((string) ($max + 1), 3, '0', STR_PAD_LEFT);
}

function doc_total(array $d): int
{
    $sub = 0;
    foreach ($d['lines'] as $l) $sub += $l['qty'] * $l['price'];
    $sub = max(0, $sub - $d['discount']);
    return (int) round($sub * (1 + $d['taxRate'] / 100));
}

$method = $_SERVER['REQUEST_METHOD'];
$token = (string) ($_GET['token'] ?? '');
$clientToken = (string) ($_GET['client'] ?? '');

// ----- public -----
if ($token !== '') {
    $docs = read_data(DOCS, []);
    $i = find_doc($docs, $token);
    if ($i === null || ($docs[$i]['status'] ?? 'draft') === 'draft') {
        rate_limit('doc-miss', 20, 3600);
        fail('Document introuvable.', 404);
    }
    if ($method === 'GET') {
        json_out(['doc' => public_doc($docs[$i]), 'issuer' => read_data(ISSUER, new stdClass())]);
    }
    require_method('POST');
    rate_limit('doc-post', 10, 3600);
    $body = read_json_body();
    if (($body['action'] ?? '') !== 'accept') fail('Action inconnue.');
    $doc = null;
    update_data(DOCS, function ($docs) use ($token, &$doc) {
        $i = find_doc($docs, $token);
        if ($i === null || $docs[$i]['type'] !== 'quote' || $docs[$i]['status'] !== 'sent') {
            fail('Ce devis ne peut pas être accepté (déjà traité ou expiré).');
        }
        $docs[$i]['status'] = 'accepted';
        $docs[$i]['acceptedAt'] = date(DATE_ATOM);
        $doc = $docs[$i];
        return $docs;
    });
    $total = number_format(doc_total($doc), 0, ',', ' ');
    notify_owner("Devis {$doc['number']} accepté", "{$doc['client']['name']} a accepté le devis {$doc['number']} ({$doc['title']}) : $total FCFA.\n\nAdmin : https://willydev.online/admin#documents\n");
    json_out(['doc' => public_doc($doc), 'issuer' => read_data(ISSUER, new stdClass())]);
}

if ($clientToken !== '') {
    require_method('GET');
    $project = null;
    foreach (read_data('clients.json', []) as $p) {
        if (preg_match('/^[a-f0-9]{32}$/', $clientToken) && hash_equals($p['token'] ?? '', $clientToken)) $project = $p;
    }
    if (!$project) fail('Projet introuvable.', 404);
    $out = [];
    foreach (read_data(DOCS, []) as $d) {
        if (($d['projectId'] ?? '') === $project['id'] && $d['status'] !== 'draft') {
            $out[] = ['type' => $d['type'], 'number' => $d['number'], 'title' => $d['title'], 'status' => $d['status'],
                'date' => $d['date'], 'total' => doc_total($d), 'token' => $d['token']];
        }
    }
    json_out(['documents' => $out]);
}

// ----- admin -----
if (!is_admin()) {
    fail('Session expirée, reconnectez-vous.', 401);
}
if ($method === 'GET') {
    $projects = array_map(fn ($p) => ['id' => $p['id'], 'client' => $p['client'], 'project' => $p['project'], 'phone' => $p['phone'] ?? ''], read_data('clients.json', []));
    json_out(['docs' => read_data(DOCS, []), 'issuer' => read_data(ISSUER, new stdClass()), 'projects' => $projects]);
}
require_admin();
$body = in_array($method, ['POST', 'PUT'], true) ? read_json_body() : [];

if ($method === 'PUT' && isset($body['issuer'])) {
    $issuer = sanitize_issuer((array) $body['issuer']);
    write_data(ISSUER, $issuer);
    json_out(['issuer' => $issuer]);
}

if ($method === 'POST' && ($body['action'] ?? '') === 'convert') {
    $created = null;
    update_data(DOCS, function ($docs) use ($body, &$created) {
        $src = null;
        foreach ($docs as $d) if ($d['id'] === ($body['id'] ?? '')) $src = $d;
        if (!$src || $src['type'] !== 'quote') fail('Devis introuvable.', 404);
        $inv = sanitize_doc(['type' => 'invoice'] + $src + ['status' => 'draft'], ['type' => 'invoice']);
        $inv['status'] = 'draft';
        $inv['date'] = date('Y-m-d');
        $inv['dueDate'] = date('Y-m-d', strtotime('+15 days'));
        $inv['sourceId'] = $src['id'];
        $inv['number'] = next_number($docs, 'invoice');
        $docs[] = $inv;
        $created = $inv;
        return $docs;
    });
    json_out(['doc' => $created]);
}

if ($method === 'POST' || $method === 'PUT') {
    $in = is_array($body['doc'] ?? null) ? $body['doc'] : [];
    $saved = null;
    update_data(DOCS, function ($docs) use ($in, $method, &$saved) {
        if ($method === 'POST') {
            $saved = sanitize_doc($in);
            $saved['number'] = next_number($docs, $saved['type']);
            $docs[] = $saved;
            return $docs;
        }
        foreach ($docs as &$d) {
            if ($d['id'] === ($in['id'] ?? '')) {
                $d = $saved = sanitize_doc($in, $d);
            }
        }
        unset($d);
        if (!$saved) fail('Document introuvable.', 404);
        return $docs;
    });
    json_out(['doc' => $saved]);
}

if ($method === 'DELETE') {
    $id = (string) ($_GET['id'] ?? '');
    update_data(DOCS, fn ($docs) => array_values(array_filter($docs, fn ($d) => $d['id'] !== $id)));
    json_out(['ok' => true]);
}

fail('Méthode non autorisée.', 405);

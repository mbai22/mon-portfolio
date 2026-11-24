<?php
// Free website audit (page /audit), powered by Google PageSpeed Insights.
// POST { url } -> scores, metrics and the main things to fix (public, rate limited, cached 12 h)
// GET          -> { available } : whether the API key is configured
// The Google API key lives in willydev-secrets.php ('pagespeed_api_key'), never in the code.

declare(strict_types=1);
require __DIR__ . '/_lib.php';

const CACHE_HOURS = 12;

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    json_out(['available' => secret('pagespeed_api_key') !== '']);
}
require_method('POST');

$key = secret('pagespeed_api_key');
if ($key === '') {
    fail("L'audit automatique n'est pas encore activé. Écrivez-moi sur WhatsApp, je vous l'envoie gratuitement.", 503);
}

$body = read_json_body();
$url = trim((string) ($body['url'] ?? ''));
if ($url !== '' && !preg_match('#^https?://#i', $url)) {
    $url = 'https://' . $url;
}
$parts = parse_url($url);
$host = strtolower($parts['host'] ?? '');
if (!filter_var($url, FILTER_VALIDATE_URL) || !in_array(strtolower($parts['scheme'] ?? ''), ['http', 'https'], true)
    || !str_contains($host, '.') || filter_var($host, FILTER_VALIDATE_IP) || preg_match('/(^|\.)(localhost|local|internal|test)$/', $host)) {
    fail('Indiquez une adresse de site valide, par exemple monentreprise.td');
}
$url = strtolower($parts['scheme']) . '://' . $host . ($parts['path'] ?? '/');

$cacheName = 'audit-cache/' . substr(hash('sha256', $url), 0, 32) . '.json';
$cached = read_data($cacheName, null);
if (is_array($cached) && (time() - ($cached['at'] ?? 0)) < CACHE_HOURS * 3600) {
    json_out($cached['result'] + ['cached' => true]);
}

rate_limit('audit', 4, 3600);
@set_time_limit(150);

$query = http_build_query(['url' => $url, 'strategy' => 'mobile', 'locale' => 'fr', 'key' => $key]);
foreach (['performance', 'seo', 'accessibility', 'best-practices'] as $cat) {
    $query .= '&category=' . $cat;
}
$endpoint = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?' . $query;

$ch = curl_init($endpoint);
curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 120, CURLOPT_CONNECTTIMEOUT => 10]);
$raw = curl_exec($ch);
$status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
curl_close($ch);

$data = is_string($raw) ? json_decode($raw, true) : null;
if ($status !== 200 || !is_array($data) || empty($data['lighthouseResult'])) {
    $msg = (string) ($data['error']['message'] ?? '');
    if (str_contains($msg, 'FAILED_DOCUMENT_REQUEST') || str_contains($msg, 'ERRORED_DOCUMENT_REQUEST') || str_contains($msg, 'DNS')) {
        fail("Ce site ne répond pas. Vérifiez l'adresse et réessayez.", 422);
    }
    fail("L'analyse n'a pas pu se faire pour le moment. Réessayez dans quelques minutes.", 502);
}

$lh = $data['lighthouseResult'];
$audits = $lh['audits'] ?? [];
$score = fn ($cat) => isset($lh['categories'][$cat]['score']) ? (int) round($lh['categories'][$cat]['score'] * 100) : null;
$metric = fn ($id) => ['label' => $audits[$id]['title'] ?? $id, 'value' => $audits[$id]['displayValue'] ?? '—', 'score' => $audits[$id]['score'] ?? null];

// Biggest wins: failed audits that carry weight, best savings first
$issues = [];
foreach (['performance', 'seo', 'accessibility', 'best-practices'] as $cat) {
    foreach ($lh['categories'][$cat]['auditRefs'] ?? [] as $ref) {
        $a = $audits[$ref['id']] ?? null;
        if (!$a || ($ref['weight'] ?? 0) <= 0 && empty($a['details']['overallSavingsMs'])) continue;
        if (!isset($a['score']) || $a['score'] === null || $a['score'] >= 0.9) continue;
        if (in_array($a['scoreDisplayMode'] ?? '', ['manual', 'notApplicable', 'informative'], true)) continue;
        $issues[$a['id']] = [
            'category' => $cat,
            'title' => $a['title'],
            'detail' => $a['displayValue'] ?? '',
            'weight' => ($ref['weight'] ?? 0) + (($a['details']['overallSavingsMs'] ?? 0) / 500),
        ];
    }
}
usort($issues, fn ($x, $y) => $y['weight'] <=> $x['weight']);

$result = [
    'url' => $lh['finalDisplayedUrl'] ?? $url,
    'https' => str_starts_with((string) ($lh['finalDisplayedUrl'] ?? $url), 'https://'),
    'scores' => [
        'performance' => $score('performance'),
        'seo' => $score('seo'),
        'accessibility' => $score('accessibility'),
        'bestPractices' => $score('best-practices'),
    ],
    'metrics' => [
        $metric('first-contentful-paint'),
        $metric('largest-contentful-paint'),
        $metric('total-blocking-time'),
        $metric('cumulative-layout-shift'),
        $metric('speed-index'),
    ],
    'issues' => array_map(fn ($i) => array_diff_key($i, ['weight' => 0]), array_slice($issues, 0, 8)),
    'screenshot' => $audits['final-screenshot']['details']['data'] ?? null,
    'checkedAt' => date(DATE_ATOM),
];

write_data($cacheName, ['at' => time(), 'result' => $result]);
json_out($result);

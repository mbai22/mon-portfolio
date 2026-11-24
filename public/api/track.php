<?php
// Privacy-friendly statistics: no cookie, no IP, no personal data.
// POST { type: "view", path } or { type: "event", name }  (public, from the site)
// GET  ?days=30  -> daily totals, top pages, events (admin only)

declare(strict_types=1);
require __DIR__ . '/_lib.php';

const EVENTS = ['whatsapp', 'email', 'contact_form', 'devis', 'booking', 'audit', 'chat', 'client_space'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = read_json_body();
    // Ignore bots and the admin's own visits
    $ua = strtolower((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''));
    if ($ua === '' || preg_match('/bot|crawl|spider|slurp|lighthouse|headless|preview/', $ua)) {
        json_out(['ok' => true]);
    }
    // Only look at the session when the admin cookie already exists: visitors never get one
    if (isset($_COOKIE['wd_admin']) && is_admin()) {
        json_out(['ok' => true]);
    }
    rate_limit('track', 300, 3600);

    $day = date('Y-m-d');
    $type = $body['type'] ?? '';
    if ($type === 'view') {
        $path = clean_text($body['path'] ?? '/', 120);
        $path = preg_replace('#[?\#].*$#', '', $path) ?: '/';
        if (!preg_match('#^/[\w\-/.%]*$#u', $path) || str_starts_with($path, '/admin') || str_starts_with($path, '/client')) {
            json_out(['ok' => true]);
        }
        $ref = clean_text($body['ref'] ?? '', 200);
        $refHost = $ref ? (parse_url($ref, PHP_URL_HOST) ?: '') : '';
        $refHost = preg_replace('/^www\./', '', strtolower($refHost));
        $mobile = (bool) preg_match('/mobi|android|iphone/', $ua);
        update_data('stats/' . date('Y-m') . '.json', function ($s) use ($day, $path, $refHost, $mobile) {
            $s[$day]['views'] = ($s[$day]['views'] ?? 0) + 1;
            $s[$day]['paths'][$path] = ($s[$day]['paths'][$path] ?? 0) + 1;
            $s[$day][$mobile ? 'mobile' : 'desktop'] = ($s[$day][$mobile ? 'mobile' : 'desktop'] ?? 0) + 1;
            if ($refHost && $refHost !== 'willydev.online') {
                $s[$day]['refs'][$refHost] = ($s[$day]['refs'][$refHost] ?? 0) + 1;
            }
            return $s;
        });
    } elseif ($type === 'event' && in_array($body['name'] ?? '', EVENTS, true)) {
        $name = $body['name'];
        update_data('stats/' . date('Y-m') . '.json', function ($s) use ($day, $name) {
            $s[$day]['events'][$name] = ($s[$day]['events'][$name] ?? 0) + 1;
            return $s;
        });
    }
    json_out(['ok' => true]);
}

require_method('GET');
if (!is_admin()) {
    fail('Session expirée, reconnectez-vous.', 401);
}

$days = max(7, min(365, (int) ($_GET['days'] ?? 30)));
$daily = [];
$paths = $refs = $events = [];
$mobile = $desktop = 0;
$months = [];
for ($i = $days - 1; $i >= 0; $i--) {
    $ts = strtotime("-$i day");
    $day = date('Y-m-d', $ts);
    $month = date('Y-m', $ts);
    $months[$month] ??= read_data("stats/$month.json", []);
    $d = $months[$month][$day] ?? [];
    $daily[] = ['date' => $day, 'views' => $d['views'] ?? 0, 'events' => array_sum($d['events'] ?? [])];
    foreach ($d['paths'] ?? [] as $p => $n) $paths[$p] = ($paths[$p] ?? 0) + $n;
    foreach ($d['refs'] ?? [] as $r => $n) $refs[$r] = ($refs[$r] ?? 0) + $n;
    foreach ($d['events'] ?? [] as $e => $n) $events[$e] = ($events[$e] ?? 0) + $n;
    $mobile += $d['mobile'] ?? 0;
    $desktop += $d['desktop'] ?? 0;
}
arsort($paths);
arsort($refs);
arsort($events);

json_out([
    'days' => $days,
    'daily' => $daily,
    'totalViews' => array_sum(array_column($daily, 'views')),
    'paths' => array_slice($paths, 0, 10, true) ?: new stdClass(),
    'refs' => array_slice($refs, 0, 10, true) ?: new stdClass(),
    'events' => $events ?: new stdClass(),
    'devices' => ['mobile' => $mobile, 'desktop' => $desktop],
]);

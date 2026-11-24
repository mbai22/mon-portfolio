<?php
// GET -> the edited content (only the sections changed in the admin; the site
//        falls back to its built-in content for the others)
// PUT { section, data } -> replace one section (admin only)
// DELETE ?section=x     -> drop a section so the site uses its built-in content again (admin only)

declare(strict_types=1);
require __DIR__ . '/_lib.php';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $content = load_content();
        json_out($content ?: new stdClass());

    case 'PUT':
        require_admin();
        $body = read_json_body();
        $section = $body['section'] ?? '';
        if (!is_string($section) || !in_array($section, CONTENT_SECTIONS, true)) {
            fail('Section inconnue.');
        }
        if (!array_key_exists('data', $body) || !is_array($body['data'])) {
            fail('Données manquantes.');
        }
        $content = load_content();
        $content[$section] = $body['data'];
        save_content($content);
        json_out(['ok' => true, 'savedAt' => date(DATE_ATOM)]);

    case 'DELETE':
        require_admin();
        $section = $_GET['section'] ?? '';
        if (!is_string($section) || !in_array($section, CONTENT_SECTIONS, true)) {
            fail('Section inconnue.');
        }
        $content = load_content();
        unset($content[$section]);
        save_content($content);
        json_out(['ok' => true]);

    default:
        fail('Méthode non autorisée.', 405);
}

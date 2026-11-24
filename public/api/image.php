<?php
// Serves images uploaded from /admin. They live outside the web root
// (willydev-data/uploads/) so a redeploy of the site never deletes them.
// Public URL: /uploads/2026/11/photo-ab12cd34.webp (rewritten here by .htaccess)

declare(strict_types=1);
require __DIR__ . '/_lib.php';

const IMAGE_TYPES = ['jpg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp', 'gif' => 'image/gif'];

$path = (string) ($_GET['f'] ?? '');
if (!preg_match('#^(\d{4}/\d{2})/([a-z0-9-]{1,80})\.(jpg|png|webp|gif)$#', $path, $m)) {
    header_remove('Content-Type');
    http_response_code(404);
    exit;
}

$file = uploads_dir() . '/' . $path;
if (!is_file($file)) {
    header_remove('Content-Type');
    http_response_code(404);
    exit;
}

$etag = '"' . md5($path . filesize($file) . filemtime($file)) . '"';
header_remove('Cache-Control');
header('Cache-Control: public, max-age=31536000, immutable');
header('ETag: ' . $etag);
if (($_SERVER['HTTP_IF_NONE_MATCH'] ?? '') === $etag) {
    header_remove('Content-Type');
    http_response_code(304);
    exit;
}
header('Content-Type: ' . IMAGE_TYPES[$m[3]]);
header('Content-Length: ' . filesize($file));
header("Content-Security-Policy: default-src 'none'");
readfile($file);

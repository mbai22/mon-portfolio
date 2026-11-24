<?php
// POST multipart "file" (image) -> { url } (admin only)

declare(strict_types=1);
require __DIR__ . '/_lib.php';

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
    'image/gif' => 'gif',
];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail('Méthode non autorisée.', 405);
}
require_admin();

$file = $_FILES['file'] ?? null;
if (!$file || !is_array($file) || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    $code = is_array($file) ? ($file['error'] ?? 0) : 0;
    fail(in_array($code, [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true)
        ? 'Image trop lourde.'
        : "Aucune image reçue.");
}
if ($file['size'] > MAX_UPLOAD_BYTES) {
    fail('Image trop lourde (8 Mo maximum).', 413);
}

// Trust the bytes, not the file name or the browser's type
$mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']) ?: '';
if (!isset(ALLOWED_TYPES[$mime]) || @getimagesize($file['tmp_name']) === false) {
    fail('Format non accepté : JPG, PNG, WebP ou GIF uniquement.', 415);
}

$base = pathinfo((string) $file['name'], PATHINFO_FILENAME);
$slug = strtolower(trim((string) preg_replace('/[^a-z0-9]+/i', '-', iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $base) ?: ''), '-'));
$slug = substr($slug ?: 'image', 0, 50);
$name = $slug . '-' . bin2hex(random_bytes(4)) . '.' . ALLOWED_TYPES[$mime];

$sub = date('Y/m');
$dir = uploads_dir() . '/' . $sub;
if (!is_dir($dir) && !mkdir($dir, 0755, true)) {
    fail("Impossible de créer le dossier d'images.", 500);
}
if (!move_uploaded_file($file['tmp_name'], $dir . '/' . $name)) {
    fail("Impossible d'enregistrer l'image.", 500);
}
@chmod($dir . '/' . $name, 0644);

json_out(['url' => '/uploads/' . $sub . '/' . $name]);

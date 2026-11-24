<?php
// Contact form. Shares the API helpers (rate limit, Telegram alert).
require __DIR__ . '/api/_lib.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$subject = trim($input['subject'] ?? '');
$message = trim($input['message'] ?? '');

if (!$name || !$email || !$subject || !$message) {
    http_response_code(400);
    echo json_encode(['error' => 'Tous les champs sont obligatoires']);
    exit;
}

if (strlen($name) < 2) {
    http_response_code(400);
    echo json_encode(['error' => 'Le nom doit contenir au moins 2 caractères']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email invalide']);
    exit;
}

if (strlen($message) < 10) {
    http_response_code(400);
    echo json_encode(['error' => 'Le message doit contenir au moins 10 caractères']);
    exit;
}

$subjectLabels = [
    'website' => 'Création de site web',
    'app' => "Développement d'application",
    'redesign' => 'Refonte de site',
    'consulting' => 'Consulting technique',
    'collab' => 'Collaboration',
    'quote' => 'Demande de devis',
    'other' => 'Autre',
];

rate_limit('contact', 5, 3600);

// Never trust the form: no line breaks in headers, HTML escaped in the e-mail body
$name = mb_substr(preg_replace('/[\r\n\t]+/', ' ', $name), 0, 80);
$subjectLabel = $subjectLabels[$subject] ?? 'Autre';
$plainMessage = mb_substr($message, 0, 5000);
$telegramText = "Formulaire de contact : $subjectLabel\nDe : $name ($email)\n\n$plainMessage";
$name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($plainMessage, ENT_QUOTES, 'UTF-8');

$to = 'contact@willydev.online';
$emailSubject = '=?UTF-8?B?' . base64_encode("[Portfolio] $subjectLabel - " . html_entity_decode($name, ENT_QUOTES, 'UTF-8')) . '?=';

$headers = "From: Site willydev.online <no-reply@willydev.online>\r\n";
$headers .= "Reply-To: " . filter_var(trim($input['email'] ?? ''), FILTER_SANITIZE_EMAIL) . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

$htmlBody = "
<!DOCTYPE html>
<html>
<head><meta charset='UTF-8'></head>
<body style='margin:0;padding:0;font-family:Segoe UI,Arial,sans-serif;background:#f5f5f5'>
<table cellpadding='0' cellspacing='0' width='100%'><tr><td style='padding:24px'>
<table cellpadding='0' cellspacing='0' style='max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)'>
<tr><td style='background:#7D53FF;padding:24px;text-align:center'>
<h1 style='color:#fff;margin:0;font-size:20px'>Nouveau message depuis le portfolio</h1>
</td></tr>
<tr><td style='padding:24px'>
<table cellpadding='0' cellspacing='0' width='100%' style='border-collapse:collapse'>
<tr><td style='padding:10px 0;color:#888;font-size:13px;width:100px'>Nom</td>
<td style='padding:10px 0;color:#333;font-size:15px;font-weight:600'>$name</td></tr>
<tr><td style='padding:10px 0;color:#888;font-size:13px;border-top:1px solid #eee'>Email</td>
<td style='padding:10px 0;color:#7D53FF;font-size:15px;border-top:1px solid #eee'>
<a href='mailto:$email' style='color:#7D53FF;text-decoration:none'>$email</a></td></tr>
<tr><td style='padding:10px 0;color:#888;font-size:13px;border-top:1px solid #eee'>Sujet</td>
<td style='padding:10px 0;color:#333;font-size:15px;border-top:1px solid #eee'>$subjectLabel</td></tr>
</table>
<div style='margin-top:20px;padding-top:20px;border-top:1px solid #eee'>
<h3 style='color:#333;font-size:14px;margin:0 0 10px'>Message</h3>
<p style='color:#555;font-size:14px;line-height:1.7;white-space:pre-wrap;margin:0'>$message</p>
</div>
</td></tr>
<tr><td style='background:#fafafa;padding:16px 24px;text-align:center;border-top:1px solid #eee'>
<p style='color:#aaa;font-size:12px;margin:0'>Envoyé depuis le formulaire de contact de willydev.online</p>
</td></tr>
</table>
</td></tr></table>
</body>
</html>";

$success = mail($to, $emailSubject, $htmlBody, $headers);
// Instant alert on the phone; counts as delivered even if the mail server refused
$success = send_telegram("✉️ $telegramText") || $success;

if ($success) {
    echo json_encode(['success' => true, 'message' => 'Message envoyé avec succès']);
} else {
    http_response_code(500);
    echo json_encode(['error' => "Erreur lors de l'envoi du message. Veuillez réessayer plus tard."]);
}

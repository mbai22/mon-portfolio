<?php
// Discovery call bookings (page /rendez-vous).
// GET               -> { taken: ["2026-11-25 10:00", ...] }  (public: only the times, no names)
// POST {…}          -> book a slot (public, rate limited, e-mail to the owner)
// GET ?all=1        -> every booking (admin)
// PATCH {id,status} -> confirmed | done | cancelled (admin)
// DELETE ?id=       -> remove (admin)

declare(strict_types=1);
require __DIR__ . '/_lib.php';

date_default_timezone_set('Africa/Ndjamena');
const BOOKINGS = 'bookings.json';
const STATUSES = ['pending', 'confirmed', 'done', 'cancelled'];

function booking_settings(): array
{
    $s = load_content()['booking'] ?? [];
    return is_array($s) ? $s : [];
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET' && empty($_GET['all'])) {
    $today = date('Y-m-d');
    $taken = [];
    foreach (read_data(BOOKINGS, []) as $b) {
        if (($b['status'] ?? '') !== 'cancelled' && ($b['date'] ?? '') >= $today) {
            $taken[] = $b['date'] . ' ' . $b['time'];
        }
    }
    json_out(['taken' => $taken]);
}

if ($method === 'POST') {
    $body = read_json_body();
    if (!empty($body['website'])) {          // honeypot field, invisible to people
        json_out(['ok' => true]);
    }
    rate_limit('booking', 5, 3600);

    $name = clean_text($body['name'] ?? '', 80);
    $phone = clean_text($body['phone'] ?? '', 30);
    $email = clean_text($body['email'] ?? '', 120);
    $topic = clean_text($body['topic'] ?? '', 80);
    $message = clean_text($body['message'] ?? '', 1000);
    $date = (string) ($body['date'] ?? '');
    $time = (string) ($body['time'] ?? '');

    if (mb_strlen($name) < 2) fail('Indiquez votre nom.');
    if (!preg_match('/^\+?[\d\s().-]{8,20}$/', $phone)) fail('Indiquez un numéro de téléphone ou WhatsApp valide.');
    if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) fail('Adresse e-mail invalide.');
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) || !preg_match('/^([01]\d|2[0-3]):[0-5]\d$/', $time)) fail('Créneau invalide.');

    $settings = booking_settings();
    $start = strtotime("$date $time");
    $notice = (int) ($settings['minNoticeHours'] ?? 12);
    $horizon = (int) ($settings['horizonDays'] ?? 14);
    if ($start === false || $start < time() + $notice * 3600 || $start > time() + ($horizon + 1) * 86400) {
        fail('Ce créneau n’est plus disponible, choisissez-en un autre.', 409);
    }
    // When the schedule was edited in the admin, the slot must belong to it
    if ($settings) {
        $days = array_map('intval', (array) ($settings['days'] ?? []));
        $slots = (array) ($settings['slots'] ?? []);
        $closed = (array) ($settings['closedDates'] ?? []);
        if (!in_array((int) date('N', $start), $days, true) || !in_array($time, $slots, true) || in_array($date, $closed, true)) {
            fail('Ce créneau n’est pas proposé.', 409);
        }
    }

    $booking = null;
    update_data(BOOKINGS, function ($all) use ($date, $time, $name, $phone, $email, $topic, $message, &$booking) {
        foreach ($all as $b) {
            if ($b['date'] === $date && $b['time'] === $time && ($b['status'] ?? '') !== 'cancelled') {
                fail('Ce créneau vient d’être réservé, choisissez-en un autre.', 409);
            }
        }
        $booking = [
            'id' => bin2hex(random_bytes(6)),
            'date' => $date,
            'time' => $time,
            'name' => $name,
            'phone' => $phone,
            'email' => $email,
            'topic' => $topic,
            'message' => $message,
            'status' => 'pending',
            'createdAt' => date(DATE_ATOM),
        ];
        $all[] = $booking;
        return $all;
    });

    $when = date('d/m/Y', strtotime($date)) . ' à ' . $time;
    notify_owner(
        "Nouveau rendez-vous : $name le $when",
        "Nouvel appel découverte réservé sur willydev.online\n\n"
        . "Date : $when (heure de N'Djamena)\nNom : $name\nTéléphone : $phone\n"
        . ($email ? "E-mail : $email\n" : '') . ($topic ? "Sujet : $topic\n" : '')
        . ($message ? "\nMessage :\n$message\n" : '')
        . "\nGérer les rendez-vous : https://willydev.online/admin#bookings\n"
    );
    json_out(['ok' => true, 'id' => $booking['id']]);
}

// ----- admin -----
if (!is_admin()) {
    fail('Session expirée, reconnectez-vous.', 401);
}

if ($method === 'GET') {
    $all = read_data(BOOKINGS, []);
    usort($all, fn ($a, $b) => strcmp($a['date'] . $a['time'], $b['date'] . $b['time']));
    json_out(['bookings' => $all]);
}

require_admin();

if ($method === 'PATCH') {
    $body = read_json_body();
    $id = (string) ($body['id'] ?? '');
    $status = (string) ($body['status'] ?? '');
    if (!in_array($status, STATUSES, true)) fail('Statut inconnu.');
    update_data(BOOKINGS, function ($all) use ($id, $status) {
        foreach ($all as &$b) {
            if ($b['id'] === $id) $b['status'] = $status;
        }
        return $all;
    });
    json_out(['ok' => true]);
}

if ($method === 'DELETE') {
    $id = (string) ($_GET['id'] ?? '');
    update_data(BOOKINGS, fn ($all) => array_values(array_filter($all, fn ($b) => $b['id'] !== $id)));
    json_out(['ok' => true]);
}

fail('Méthode non autorisée.', 405);

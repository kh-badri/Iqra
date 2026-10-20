<?php
/**
 * API untuk Mendaftarkan Push Subscription Perangkat
 * Endpoint: /api/push-subscribe.php
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

require_once __DIR__ . '/config.php';

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data || empty($data['endpoint'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid subscription data']);
    exit;
}

$endpoint = $data['endpoint'];
$keys = isset($data['keys']) ? $data['keys'] : [];
$city = isset($data['city']) ? $data['city'] : null;
$schedule = isset($data['todaySchedule']) ? $data['todaySchedule'] : null;

// Pastikan folder data ada
$dataDir = dirname(SUBSCRIPTIONS_FILE);
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

// Baca data langganan yang sudah ada
$subscriptions = [];
if (file_exists(SUBSCRIPTIONS_FILE)) {
    $existing = json_decode(file_get_contents(SUBSCRIPTIONS_FILE), true);
    if (is_array($existing)) {
        $subscriptions = $existing;
    }
}

// Simpan atau perbarui data langganan berdasarkan endpoint
$now = date('Y-m-d H:i:s');
$found = false;

foreach ($subscriptions as &$sub) {
    if (isset($sub['endpoint']) && $sub['endpoint'] === $endpoint) {
        $sub['keys'] = $keys;
        if ($city) $sub['city'] = $city;
        if ($schedule) $sub['schedule'] = $schedule;
        $sub['updated_at'] = $now;
        $found = true;
        break;
    }
}

if (!$found) {
    $subscriptions[] = [
        'id' => md5($endpoint),
        'endpoint' => $endpoint,
        'keys' => $keys,
        'city' => $city ? $city : [
            'name' => 'Lokasi Pengguna',
            'lat' => -6.2088,
            'lng' => 106.8456,
            'timezone' => 7
        ],
        'schedule' => $schedule,
        'created_at' => $now,
        'updated_at' => $now,
        'last_pushed' => []
    ];
}

file_put_contents(SUBSCRIPTIONS_FILE, json_encode($subscriptions, JSON_PRETTY_PRINT));

echo json_encode([
    'success' => true,
    'message' => 'Berhasil mendaftarkan perangkat untuk Web Push Adzan.',
    'total_subscribers' => count($subscriptions)
]);

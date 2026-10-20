<?php
/**
 * API untuk Membatalkan Pendaftaran Push Subscription
 * Endpoint: /api/push-unsubscribe.php
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config.php';

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data || empty($data['endpoint'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid endpoint data']);
    exit;
}

$endpoint = $data['endpoint'];

if (file_exists(SUBSCRIPTIONS_FILE)) {
    $existing = json_decode(file_get_contents(SUBSCRIPTIONS_FILE), true);
    if (is_array($existing)) {
        $filtered = array_values(array_filter($existing, function($sub) use ($endpoint) {
            return isset($sub['endpoint']) && $sub['endpoint'] !== $endpoint;
        }));
        file_put_contents(SUBSCRIPTIONS_FILE, json_encode($filtered, JSON_PRETTY_PRINT));
    }
}

echo json_encode(['success' => true, 'message' => 'Push subscription removed.']);

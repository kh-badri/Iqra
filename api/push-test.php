<?php
/**
 * API untuk Menguji Kirim Web Push Langsung ke Perangkat yang Terdaftar
 * Endpoint: /api/push-test.php
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config.php';

if (!file_exists(SUBSCRIPTIONS_FILE)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Belum ada perangkat yang terdaftar di subscriptions.json'
    ]);
    exit;
}

$subscriptions = json_decode(file_get_contents(SUBSCRIPTIONS_FILE), true);
if (!is_array($subscriptions) || empty($subscriptions)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Belum ada perangkat yang terdaftar.'
    ]);
    exit;
}

// Ambil subscriber terakhir (perangkat user saat ini)
$targetSub = end($subscriptions);

$payload = json_encode([
    'title' => '🕌 Tes Web Push cPanel Berhasil!',
    'body' => 'Alhamdulillah, sinyal Web Push dari server cPanel berhasil sampai ke HP Anda meski aplikasi ditutup.',
    'prayerId' => 'dhuhr',
    'time' => date('H:i'),
    'timestamp' => time()
]);

$res = sendWebPushMessage($targetSub['endpoint'], $payload);
$isApple = (strpos($targetSub['endpoint'], 'push.apple.com') !== false);

echo json_encode([
    'success' => $res['success'],
    'status_code' => $res['status'],
    'endpoint' => substr($targetSub['endpoint'], 0, 35) . '...',
    'message' => $res['success'] 
        ? ($isApple 
            ? 'Sinyal Web Push berhasil dikirim ke iPhone Anda via Apple APNs!' 
            : 'Sinyal Web Push berhasil dikirim ke HP Android Anda via Google FCM!')
        : 'Gagal mengirim Web Push: ' . ($res['error'] ?: $res['response']),
    'raw_response' => $res['response']
]);

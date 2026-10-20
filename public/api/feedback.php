<?php
/**
 * API Kritik & Saran Pengguna Iqra
 * Endpoint: /api/feedback.php
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Pin');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config.php';

// Pastikan folder data ada
$dataDir = dirname(FEEDBACKS_FILE);
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

// Helper: baca file feedback dengan safe-read
function readFeedbacks() {
    if (!file_exists(FEEDBACKS_FILE)) {
        return [];
    }
    $content = file_get_contents(FEEDBACKS_FILE);
    if (empty($content)) {
        return [];
    }
    $data = json_decode($content, true);
    return is_array($data) ? $data : [];
}

// Helper: simpan file feedback dengan atomic file lock
function saveFeedbacks($feedbacks) {
    $fp = fopen(FEEDBACKS_FILE, 'c+');
    if (!$fp) return false;

    if (flock($fp, LOCK_EX)) {
        ftruncate($fp, 0);
        rewind($fp);
        fwrite($fp, json_encode($feedbacks, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        fflush($fp);
        flock($fp, LOCK_UN);
        fclose($fp);
        return true;
    }
    fclose($fp);
    return false;
}

// Helper: cek apakah request berasal dari admin
function isAdminAuthorized() {
    $pin = isset($_GET['pin']) ? trim($_GET['pin']) : '';
    if (empty($pin) && isset($_SERVER['HTTP_X_ADMIN_PIN'])) {
        $pin = trim($_SERVER['HTTP_X_ADMIN_PIN']);
    }
    return !empty($pin) && $pin === ADMIN_SECRET_PIN;
}

$method = $_SERVER['REQUEST_METHOD'];

// ── 1. POST: Kirim Kritik & Saran (Pengguna Login Google) ──
if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Format data tidak valid (JSON diharapkan).']);
        exit;
    }

    $name = isset($input['name']) ? trim(strip_tags($input['name'])) : '';
    $email = isset($input['email']) ? trim(filter_var($input['email'], FILTER_SANITIZE_EMAIL)) : '';
    $message = isset($input['message']) ? trim(strip_tags($input['message'])) : '';
    $category = isset($input['category']) ? trim(strip_tags($input['category'])) : 'saran';
    $rating = isset($input['rating']) ? (int)$input['rating'] : 5;
    $picture = isset($input['picture']) ? trim($input['picture']) : '';
    $userId = isset($input['userId']) ? trim($input['userId']) : '';

    // Validasi input
    if (empty($name) || strlen($name) < 2) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Nama pengguna wajib diisi.']);
        exit;
    }

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Alamat email Google tidak valid.']);
        exit;
    }

    if (empty($message) || strlen($message) < 5) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Isi pesan kritik atau saran minimal 5 karakter.']);
        exit;
    }

    $validCategories = ['saran', 'kritik', 'koreksi', 'lainnya'];
    if (!in_array($category, $validCategories)) {
        $category = 'saran';
    }

    if ($rating < 1 || $rating > 5) {
        $rating = 5;
    }

    // Buat objek feedback baru
    $newFeedback = [
        'id' => 'fb_' . bin2hex(random_bytes(6)) . '_' . time(),
        'userId' => $userId,
        'name' => $name,
        'email' => $email,
        'picture' => $picture,
        'category' => $category,
        'rating' => $rating,
        'message' => $message,
        'createdAt' => date('c'),
        'timestamp' => time(),
        'userAgent' => isset($_SERVER['HTTP_USER_AGENT']) ? substr($_SERVER['HTTP_USER_AGENT'], 0, 150) : '',
    ];

    $feedbacks = readFeedbacks();
    // Tambahkan entri baru di posisi paling atas (terbaru dahulu)
    array_unshift($feedbacks, $newFeedback);

    // Batasi maksimum 1000 entri terakhir untuk mencegah file membengkak
    if (count($feedbacks) > 1000) {
        $feedbacks = array_slice($feedbacks, 0, 1000);
    }

    if (saveFeedbacks($feedbacks)) {
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Jazakallahu khairan! Kritik dan saran Anda berhasil dikirimkan.',
            'feedback' => $newFeedback,
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Gagal menyimpan data ke server.']);
    }
    exit;
}

// ── 2. GET: Ambil Daftar Kritik & Saran (Hanya Admin Terverifikasi) ──
if ($method === 'GET') {
    if (!isAdminAuthorized()) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Akses ditolak. PIN keamanan admin diperlukan.',
        ]);
        exit;
    }

    $feedbacks = readFeedbacks();

    echo json_encode([
        'success' => true,
        'count' => count($feedbacks),
        'feedbacks' => $feedbacks,
    ]);
    exit;
}

// ── 3. DELETE: Hapus Kritik & Saran Berdasarkan ID ──
if ($method === 'DELETE') {
    if (!isAdminAuthorized()) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Akses ditolak. PIN keamanan admin diperlukan.',
        ]);
        exit;
    }

    $idToDelete = isset($_GET['id']) ? trim($_GET['id']) : '';
    if (empty($idToDelete)) {
        $rawInput = file_get_contents('php://input');
        $input = json_decode($rawInput, true);
        if ($input && !empty($input['id'])) {
            $idToDelete = trim($input['id']);
        }
    }

    if (empty($idToDelete)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID data yang ingin dihapus tidak disertakan.']);
        exit;
    }

    $feedbacks = readFeedbacks();
    $initialCount = count($feedbacks);
    $feedbacks = array_values(array_filter($feedbacks, function ($item) use ($idToDelete) {
        return isset($item['id']) && $item['id'] !== $idToDelete;
    }));

    if (count($feedbacks) === $initialCount) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Data feedback dengan ID tersebut tidak ditemukan.']);
        exit;
    }

    if (saveFeedbacks($feedbacks)) {
        echo json_encode(['success' => true, 'message' => 'Data kritik/saran berhasil dihapus.']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Gagal memperbarui file database di server.']);
    }
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method tidak didukung.']);

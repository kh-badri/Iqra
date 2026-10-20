<?php
/**
 * Iqra Web Push & VAPID Configuration
 * Domain: iqra.kbtech.id
 */

define('VAPID_PUBLIC_KEY', 'BPEumoDK1izI0grVyqkZhRrm2FEDluvC_lLQVz2XlpE7CbzH6_FvS_nRoQavBDZbIw0fPb9jcSkFiR5O9fMIy6A');
define('VAPID_SUBJECT', 'mailto:admin@kbtech.id');
define('SUBSCRIPTIONS_FILE', __DIR__ . '/../data/push_subscriptions.json');

const VAPID_PRIVATE_KEY_PEM = <<<PEM
-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg/uVjYbmfNJCfTtzw
DyvNinpEr/fwsrWnTmnYz8dS0WChRANCAATxLpqAytYsyNIK1cqpGYUa5thRA5br
wv5S0Fc9l5aROwm8x+vxb0v50aEGrwQ2WyMNHz2/Y3EpBYkeTvXzCMug
-----END PRIVATE KEY-----
PEM;

function base64UrlEncode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64UrlDecode($data) {
    return base64_decode(strtr($data, '-_', '+/'));
}

// Konversi tanda tangan DER (dari openssl_sign) ke format raw 64-byte IEEE P1363 (R||S)
function derToP1363($der) {
    $pos = 0;
    if (ord($der[$pos++]) !== 0x30) return false;
    $len = ord($der[$pos++]);
    if ($len & 0x80) {
        $n = $len & 0x7f;
        $pos += $n;
    }
    if (ord($der[$pos++]) !== 0x02) return false;
    $rLen = ord($der[$pos++]);
    $r = substr($der, $pos, $rLen);
    $pos += $rLen;
    if (ord($der[$pos++]) !== 0x02) return false;
    $sLen = ord($der[$pos++]);
    $s = substr($der, $pos, $sLen);

    $r = ltrim($r, "\x00");
    $s = ltrim($s, "\x00");
    $r = str_pad($r, 32, "\x00", STR_PAD_LEFT);
    $s = str_pad($s, 32, "\x00", STR_PAD_LEFT);

    return $r . $s;
}

// Buat JWT VAPID terotentikasi ES256
function createVapidJwt($endpointAudience) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'ES256']);
    $payload = json_encode([
        'aud' => $endpointAudience,
        'exp' => time() + 86400,
        'sub' => VAPID_SUBJECT
    ]);

    $data = base64UrlEncode($header) . '.' . base64UrlEncode($payload);

    $key = openssl_pkey_get_private(VAPID_PRIVATE_KEY_PEM);
    if (!$key) {
        throw new Exception("Private key VAPID tidak valid.");
    }

    $sig = '';
    openssl_sign($data, $sig, $key, OPENSSL_ALGO_SHA256);
    $rawSig = derToP1363($sig);

    return $data . '.' . base64UrlEncode($rawSig);
}

// Kirim sinyal Web Push ke Google FCM / Browser Push Service
function sendWebPushMessage($endpoint, $payloadJson = null) {
    $parsedUrl = parse_url($endpoint);
    $audience = $parsedUrl['scheme'] . '://' . $parsedUrl['host'];

    $jwt = createVapidJwt($audience);

    $headers = [
        'Authorization: vapid t=' . $jwt . ', k=' . VAPID_PUBLIC_KEY,
        'TTL: 180',
        'Urgency: high',
    ];

    $ch = curl_init($endpoint);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

    if ($payloadJson !== null && is_string($payloadJson)) {
        $headers[] = 'Content-Type: application/json';
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payloadJson);
    } else {
        $headers[] = 'Content-Length: 0';
        curl_setopt($ch, CURLOPT_POSTFIELDS, '');
    }

    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    return [
        'status' => $httpCode,
        'response' => $response,
        'error' => $error,
        'success' => ($httpCode >= 200 && $httpCode < 300)
    ];
}

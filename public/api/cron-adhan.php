<?php
/**
 * CRON JOB PENJADWAL ADZAN & WEB PUSH (Setiap Menit: * * * * *)
 * 
 * Penggunaan di cPanel Cron Jobs:
 *   * * * * * /usr/local/bin/php /home/kbtechid/public_html/iqra.kbtech.id/api/cron-adhan.php >/dev/null 2>&1
 * Atau via cURL:
 *   * * * * * curl -s https://iqra.kbtech.id/api/cron-adhan.php >/dev/null 2>&1
 */

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/config.php';

// ── Cegah Eksekusi Ganda Bersamaan (Race Condition Mutex Lock) ───────────────
$lockFile = __DIR__ . '/../data/cron.lock';
$lockFp = @fopen($lockFile, 'c+');
if ($lockFp && !@flock($lockFp, LOCK_EX | LOCK_NB)) {
    echo json_encode([
        'status' => 'busy',
        'message' => 'Proses cron adzan lain sedang berjalan pada detik yang sama (mencegah notifikasi dobel).',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit;
}

// Pastikan file subscription ada
if (!file_exists(SUBSCRIPTIONS_FILE)) {
    echo json_encode([
        'status' => 'idle',
        'message' => 'Belum ada perangkat yang terdaftar di subscriptions.json',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit;
}

$subscriptions = json_decode(file_get_contents(SUBSCRIPTIONS_FILE), true);
if (!is_array($subscriptions) || empty($subscriptions)) {
    echo json_encode([
        'status' => 'idle',
        'message' => 'Daftar perangkat kosong.',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit;
}

// ── Kalkulator Waktu Sholat Standar Kemenag RI ────────────────────────
class KemenagPrayerCalc {
    public static function getTimes($lat, $lng, $timezone = 7, $dateTime = null) {
        if ($dateTime === null) {
            $tzName = ($timezone == 9) ? 'Asia/Jayapura' : (($timezone == 8) ? 'Asia/Makassar' : 'Asia/Jakarta');
            $dateTime = new DateTime('now', new DateTimeZone($tzName));
        }

        $year = (int)$dateTime->format('Y');
        $month = (int)$dateTime->format('n');
        $day = (int)$dateTime->format('j');

        if ($month <= 2) {
            $year -= 1;
            $month += 12;
        }
        $a = floor($year / 100);
        $b = 2 - $a + floor($a / 4);
        $jd = floor(365.25 * ($year + 4716)) + floor(30.6001 * ($month + 1)) + $day + $b - 1524.5;

        $d = $jd - 2451545.0;
        $g = 357.529 + 0.98560028 * $d;
        $q = 280.459 + 0.98564736 * $d;
        $l = $q + 1.915 * sin(deg2rad($g)) + 0.020 * sin(deg2rad(2 * $g));
        $e = 23.439 - 0.00000036 * $d;

        $ra = rad2deg(atan2(cos(deg2rad($e)) * sin(deg2rad($l)), cos(deg2rad($l)))) / 15;
        $ra = fmod($ra + 24, 24);

        $decl = rad2deg(asin(sin(deg2rad($e)) * sin(deg2rad($l))));
        $eqt = ($q / 15) - $ra;
        $eqt = fmod($eqt + 24, 24);
        if ($eqt > 12) $eqt -= 24;

        // Solar Noon (Dzuhur)
        $noon = 12 + $timezone - ($lng / 15) - $eqt;

        // Fajr (20 degrees Kemenag)
        $fajrAngle = 20.0;
        $fajrArc = rad2deg(acos((-sin(deg2rad($fajrAngle)) - sin(deg2rad($lat)) * sin(deg2rad($decl))) / (cos(deg2rad($lat)) * cos(deg2rad($decl)))));
        $fajr = $noon - ($fajrArc / 15);

        // Sunrise (0.833 degrees)
        $sunAngle = 0.833;
        $sunArc = rad2deg(acos((-sin(deg2rad($sunAngle)) - sin(deg2rad($lat)) * sin(deg2rad($decl))) / (cos(deg2rad($lat)) * cos(deg2rad($decl)))));

        // Asr (Shafi'i shadow ratio = 1)
        $asrAngle = -rad2deg(atan(1 + tan(deg2rad(abs($lat - $decl)))));
        $asrArc = rad2deg(acos((-sin(deg2rad($asrAngle)) - sin(deg2rad($lat)) * sin(deg2rad($decl))) / (cos(deg2rad($lat)) * cos(deg2rad($decl)))));
        $asr = $noon + ($asrArc / 15);

        // Maghrib (Sunset 0.833 degrees)
        $maghrib = $noon + ($sunArc / 15);

        // Isha (18 degrees Kemenag)
        $ishaAngle = 18.0;
        $ishaArc = rad2deg(acos((-sin(deg2rad($ishaAngle)) - sin(deg2rad($lat)) * sin(deg2rad($decl))) / (cos(deg2rad($lat)) * cos(deg2rad($decl)))));
        $isha = $noon + ($ishaArc / 15);

        // Kemenag ihtiyath (+2 menit)
        return [
            'fajr' => self::toHM($fajr + (2 / 60)),
            'dhuhr' => self::toHM($noon + (2 / 60)),
            'asr' => self::toHM($asr + (2 / 60)),
            'maghrib' => self::toHM($maghrib + (2 / 60)),
            'isha' => self::toHM($isha + (2 / 60)),
        ];
    }

    private static function toHM($hours) {
        $hours = fmod($hours + 24, 24);
        $h = floor($hours);
        $m = floor(($hours - $h) * 60);
        return sprintf('%02d:%02d', $h, $m);
    }
}

$prayerNames = [
    'fajr' => 'Subuh',
    'dhuhr' => 'Dzuhur',
    'asr' => 'Ashar',
    'maghrib' => 'Maghrib',
    'isha' => 'Isya'
];

$pushedCount = 0;
$expiredSubscriptions = [];
$nowUtc = new DateTime('now', new DateTimeZone('UTC'));

foreach ($subscriptions as $idx => &$sub) {
    if (empty($sub['endpoint'])) continue;

    $tzOffset = isset($sub['city']['timezone']) ? (int)$sub['city']['timezone'] : 7;
    $tzName = ($tzOffset == 9) ? 'Asia/Jayapura' : (($tzOffset == 8) ? 'Asia/Makassar' : 'Asia/Jakarta');
    $userTime = new DateTime('now', new DateTimeZone($tzName));

    $currentHM = $userTime->format('H:i');
    $currentDate = $userTime->format('Y-m-d');

    // Ambil jadwal sholat hari ini
    $lat = isset($sub['city']['lat']) ? (float)$sub['city']['lat'] : -6.2088;
    $lng = isset($sub['city']['lng']) ? (float)$sub['city']['lng'] : 106.8456;
    $todayTimes = KemenagPrayerCalc::getTimes($lat, $lng, $tzOffset, $userTime);

    // Override bila browser sudah mengirim kalkulasi akurat adhan-js
    if (isset($sub['schedule']) && is_array($sub['schedule'])) {
        foreach (['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as $p) {
            if (!empty($sub['schedule'][$p])) {
                $todayTimes[$p] = $sub['schedule'][$p];
            }
        }
    }

    if (!isset($sub['last_pushed']) || !is_array($sub['last_pushed'])) {
        $sub['last_pushed'] = [];
    }

    // Cek masing-masing 5 waktu sholat
    foreach ($prayerNames as $prayerKey => $prayerLabel) {
        $targetHM = isset($todayTimes[$prayerKey]) ? $todayTimes[$prayerKey] : '';
        if (empty($targetHM)) continue;

        // Apakah menit saat ini tepat sama dengan waktu sholat?
        if ($currentHM === $targetHM) {
            $pushKey = $currentDate . '_' . $prayerKey;

            // Pastikan belum pernah dikirim hari ini
            if (empty($sub['last_pushed'][$pushKey])) {
                $sub['last_pushed'][$pushKey] = date('Y-m-d H:i:s');

                // Siapkan paket payload notifikasi
                $cityName = isset($sub['city']['name']) ? $sub['city']['name'] : 'Wilayah Anda';
                $isFajr = ($prayerKey === 'fajr');

                $payload = json_encode([
                    'title' => "🕌 Waktu Sholat {$prayerLabel} Telah Masuk!",
                    'body' => $isFajr 
                        ? "الصَّلَاةُ خَيْرٌ مِنَ النَّوْمِ. Waktu Subuh untuk wilayah {$cityName} ({$targetHM}). Mari raih keberkahan fajar."
                        : "Waktu sholat {$prayerLabel} untuk wilayah {$cityName} ({$targetHM}). Hayya 'alash Shalah.",
                    'prayerId' => $prayerKey,
                    'time' => $targetHM,
                    'timestamp' => time()
                ]);

                // Kirim sinyal Web Push ke Google FCM
                $res = sendWebPushMessage($sub['endpoint'], $payload);

                if ($res['success']) {
                    $pushedCount++;
                } else if ($res['status'] == 404 || $res['status'] == 410) {
                    // Token langganan di HP sudah kadaluarsa atau di-uninstall
                    $expiredSubscriptions[] = $sub['endpoint'];
                }
            }
        }
    }
}

// Hapus perangkat yang sudah kadaluarsa (uninstalled)
if (!empty($expiredSubscriptions)) {
    $subscriptions = array_values(array_filter($subscriptions, function($s) use ($expiredSubscriptions) {
        return !in_array($s['endpoint'], $expiredSubscriptions);
    }));
}

// Simpan pembaharuan status
file_put_contents(SUBSCRIPTIONS_FILE, json_encode($subscriptions, JSON_PRETTY_PRINT));

if ($lockFp) {
    @flock($lockFp, LOCK_UN);
    @fclose($lockFp);
}

echo json_encode([
    'status' => 'success',
    'timestamp' => date('Y-m-d H:i:s'),
    'total_subscribers' => count($subscriptions),
    'notifications_pushed' => $pushedCount
]);

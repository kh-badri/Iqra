import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const OUT_DIR = path.join(ROOT_DIR, 'out');
const REMOTE_NAME = 'origin';
const TARGET_BRANCH = 'cpanel';

console.log('🚀 Memulai persiapan deploy cPanel...');

// 1. Pastikan folder out ada dan memiliki index.html
if (!fs.existsSync(OUT_DIR) || !fs.existsSync(path.join(OUT_DIR, 'index.html'))) {
  console.log('📦 Folder out belum lengkap. Menjalankan npm run build...');
  execSync('npm run build', { stdio: 'inherit' });
}

// 2. Pastikan file penting dari public/ tersalin ke out/
console.log('📋 Menyalin file konfigurasi cPanel (.htaccess, manifest, icons, favicon) ke out/ ...');
const filesToSync = ['.htaccess', 'manifest.webmanifest', 'favicon.ico', 'robots.txt', 'sitemap.xml', 'sw.js', 'offline.html'];
for (const file of filesToSync) {
  const src = path.join(ROOT_DIR, 'public', file);
  const dest = path.join(OUT_DIR, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
}

// 3. Salin folder penting (icons, api, audio, data)
const dirsToSync = ['icons', 'api', 'audio', 'data'];
for (const dir of dirsToSync) {
  const srcDir = path.join(ROOT_DIR, 'public', dir);
  const destDir = path.join(OUT_DIR, dir);
  if (fs.existsSync(srcDir)) {
    fs.cpSync(srcDir, destDir, { recursive: true });
  }
}

// 4. Tambahkan README.md panduan cPanel di folder out
const cpanelReadme = `# Iqra - Production Build for cPanel

Branch ini (\`${TARGET_BRANCH}\`) dikhususkan untuk deployment hosting cPanel / Apache.
Semua file di branch ini adalah hasil kompilasi statis (Static Export) yang siap saji dan langsung dapat dijalankan di \`public_html\`.

## Cara Pasang di cPanel:

### Opsi 1: Lewat cPanel Terminal / SSH
\`\`\`bash
# 1. Masuk ke direktori public_html atau subdomain
cd ~/public_html/iqra.kbtech.id

# 2. Sinkronkan dengan branch cpanel
git fetch origin ${TARGET_BRANCH}
git reset --hard origin/${TARGET_BRANCH}
\`\`\`

### Opsi 2: Lewat Menu "Git™ Version Control" di cPanel
1. Masuk ke cPanel -> Buka menu **Git™ Version Control**.
2. Klik **Manage** -> **Pull or Deploy** -> **Update from Remote**.

## ⏰ Pengaturan Cron Job Adzan Otomatis di cPanel (* * * * *):
Agar notifikasi adzan otomatis masuk ke HP pengguna meski aplikasi/browser ditutup total:
1. Masuk ke cPanel Anda -> Buka menu **Cron Jobs** (Tugas Cron).
2. Pada bagian **Common Settings**, pilih **Once Per Minute (* * * * *)**.
3. Pada kolom **Command**, masukkan perintah:
\`\`\`bash
/usr/local/bin/php /home/kbtechid/public_html/iqra.kbtech.id/api/cron-adhan.php >/dev/null 2>&1
\`\`\`
*(Atau bila menggunakan URL)*:
\`\`\`bash
curl -s https://iqra.kbtech.id/api/cron-adhan.php >/dev/null 2>&1
\`\`\`
4. Klik **Add New Cron Job**.
Selesai! Server cPanel sekarang akan mengecek jadwal sholat setiap menit dan mengirim sinyal Web Push ke HP pengguna tepat saat adzan tiba.
`;
fs.writeFileSync(path.join(OUT_DIR, 'README.md'), cpanelReadme, 'utf8');

// 5. Dapatkan remote URL dari git utama
let remoteUrl = '';
try {
  remoteUrl = execSync(`git config --get remote.${REMOTE_NAME}.url`, { encoding: 'utf8' }).trim();
} catch (e) {
  console.error('❌ Gagal mendapatkan git remote URL:', e.message);
  process.exit(1);
}

console.log(`🔗 Git Remote: ${remoteUrl}`);
console.log(`🌿 Target Branch: ${TARGET_BRANCH}`);

// 6. Inisialisasi git di dalam out jika belum ada
const outGitDir = path.join(OUT_DIR, '.git');
if (!fs.existsSync(outGitDir)) {
  execSync('git init', { cwd: OUT_DIR, stdio: 'ignore' });
}

// Ambil identitas git dari repo utama
try {
  const userName = execSync('git config user.name', { encoding: 'utf8' }).trim();
  const userEmail = execSync('git config user.email', { encoding: 'utf8' }).trim();
  if (userName) execSync(`git config user.name "${userName}"`, { cwd: OUT_DIR });
  if (userEmail) execSync(`git config user.email "${userEmail}"`, { cwd: OUT_DIR });
} catch {}

// Set remote URL
try {
  execSync(`git remote remove ${REMOTE_NAME}`, { cwd: OUT_DIR, stdio: 'ignore' });
} catch {}
execSync(`git remote add ${REMOTE_NAME} ${remoteUrl}`, { cwd: OUT_DIR });

// Konfigurasi credential helper store agar push berjalan otomatis dan cepat
try {
  execSync('git config credential.helper ""', { cwd: OUT_DIR, stdio: 'ignore' });
  execSync('git config --add credential.helper store', { cwd: OUT_DIR, stdio: 'ignore' });
} catch {}

// Tarik history dari remote agar commit berkesinambungan (mencegah konflik fast-forward / diverging di cPanel)
try {
  console.log(`📥 Mengambil history branch '${TARGET_BRANCH}' dari remote...`);
  execSync(`git fetch ${REMOTE_NAME} ${TARGET_BRANCH}`, { cwd: OUT_DIR, stdio: 'ignore' });
  execSync(`git checkout -B ${TARGET_BRANCH} ${REMOTE_NAME}/${TARGET_BRANCH}`, { cwd: OUT_DIR, stdio: 'ignore' });
} catch {
  execSync(`git checkout -B ${TARGET_BRANCH}`, { cwd: OUT_DIR, stdio: 'ignore' });
}

// Add all files
execSync('git add -A', { cwd: OUT_DIR, stdio: 'inherit' });

// Commit
const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
try {
  execSync(`git commit -m "cPanel Production Build (Web Push & Cron Enabled) - ${timestamp}"`, { cwd: OUT_DIR, stdio: 'inherit' });
} catch {
  console.log('ℹ️ Tidak ada perubahan baru di folder out.');
}

// Push ke origin cpanel
console.log(`📤 Mendorong (push) build ke branch '${TARGET_BRANCH}' di GitHub...`);
try {
  execSync(`git push ${REMOTE_NAME} ${TARGET_BRANCH}`, { cwd: OUT_DIR, stdio: 'inherit' });
} catch {
  console.log('⚠️ Fast-forward push gagal, mencoba dengan --force...');
  execSync(`git push ${REMOTE_NAME} ${TARGET_BRANCH} --force`, { cwd: OUT_DIR, stdio: 'inherit' });
}

console.log('✨ BERHASIL! Branch cPanel telah diperbarui di GitHub.');

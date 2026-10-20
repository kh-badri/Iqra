import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const OUT_DIR = path.join(ROOT_DIR, 'out');
const CPANEL_REPO_DIR = path.join(ROOT_DIR, '.cpanel-repo');
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

// 4. Dapatkan remote URL dari git utama
let remoteUrl = '';
try {
  remoteUrl = execSync(`git config --get remote.${REMOTE_NAME}.url`, { encoding: 'utf8' }).trim();
} catch (e) {
  console.error('❌ Gagal mendapatkan git remote URL:', e.message);
  process.exit(1);
}

console.log(`🔗 Git Remote: ${remoteUrl}`);
console.log(`🌿 Target Branch: ${TARGET_BRANCH}`);

// 5. Pastikan folder persisten .cpanel-repo tersedia dan tersinkronisasi
if (!fs.existsSync(path.join(CPANEL_REPO_DIR, '.git'))) {
  console.log(`📥 Melakukan clone awal branch '${TARGET_BRANCH}' ke .cpanel-repo...`);
  if (fs.existsSync(CPANEL_REPO_DIR)) {
    fs.rmSync(CPANEL_REPO_DIR, { recursive: true, force: true });
  }
  execSync(`git clone --branch ${TARGET_BRANCH} --single-branch ${remoteUrl} "${CPANEL_REPO_DIR}"`, { stdio: 'inherit' });
} else {
  console.log(`🔄 Menarik riwayat terbaru dari remote origin/${TARGET_BRANCH}...`);
  try {
    execSync(`git fetch ${REMOTE_NAME} ${TARGET_BRANCH}`, { cwd: CPANEL_REPO_DIR, stdio: 'inherit' });
    execSync(`git reset --hard ${REMOTE_NAME}/${TARGET_BRANCH}`, { cwd: CPANEL_REPO_DIR, stdio: 'inherit' });
  } catch (err) {
    console.warn('⚠️ Gagal sinkronisasi remote repo, melanjutkan...', err.message);
  }
}

// Ambil identitas git dari repo utama
try {
  const userName = execSync('git config user.name', { encoding: 'utf8' }).trim();
  const userEmail = execSync('git config user.email', { encoding: 'utf8' }).trim();
  if (userName) execSync(`git config user.name "${userName}"`, { cwd: CPANEL_REPO_DIR });
  if (userEmail) execSync(`git config user.email "${userEmail}"`, { cwd: CPANEL_REPO_DIR });
} catch {}

// 6. Bersihkan isi .cpanel-repo (kecuali folder .git) lalu salin semua file dari out/
console.log('📦 Menyinkronkan file produksi ke branch cpanel...');
const existingItems = fs.readdirSync(CPANEL_REPO_DIR);
for (const item of existingItems) {
  if (item === '.git') continue;
  fs.rmSync(path.join(CPANEL_REPO_DIR, item), { recursive: true, force: true });
}

// Salin semua file dari out ke .cpanel-repo
fs.cpSync(OUT_DIR, CPANEL_REPO_DIR, { recursive: true });

// 7. Commit dan Push secara linier (mencegah konflik diverging / non-fast-forward selamanya)
execSync('git add -A', { cwd: CPANEL_REPO_DIR, stdio: 'inherit' });

const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
let hasChanges = false;
try {
  const status = execSync('git status --porcelain', { cwd: CPANEL_REPO_DIR, encoding: 'utf8' }).trim();
  if (status.length > 0) {
    hasChanges = true;
    execSync(`git commit -m "cPanel Production Build (Web Push & Cron Enabled) - ${timestamp}"`, { cwd: CPANEL_REPO_DIR, stdio: 'inherit' });
  } else {
    console.log('ℹ️ Tidak ada perubahan file pada build produksi.');
  }
} catch (e) {
  console.log('ℹ️ Tidak ada perubahan yang perlu di-commit.');
}

if (hasChanges) {
  console.log(`📤 Mendorong (push) build linier ke branch '${TARGET_BRANCH}' di GitHub...`);
  execSync(`git push ${REMOTE_NAME} ${TARGET_BRANCH}`, { cwd: CPANEL_REPO_DIR, stdio: 'inherit' });
}

console.log('✨ BERHASIL! Branch cPanel telah diperbarui secara linier (Fast-Forward aman di cPanel).');

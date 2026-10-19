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

// 3. Salin folder icons
const srcIcons = path.join(ROOT_DIR, 'public', 'icons');
const destIcons = path.join(OUT_DIR, 'icons');
if (fs.existsSync(srcIcons)) {
  fs.cpSync(srcIcons, destIcons, { recursive: true });
}

// 4. Tambahkan README.md panduan cPanel di folder out
const cpanelReadme = `# Iqra - Production Build for cPanel

Branch ini (\`${TARGET_BRANCH}\`) dikhususkan untuk deployment hosting cPanel / Apache.
Semua file di branch ini adalah hasil kompilasi statis (Static Export) yang siap saji dan langsung dapat dijalankan di \`public_html\`.

## Cara Pasang di cPanel:

### Opsi 1: Lewat cPanel Terminal / SSH
\`\`\`bash
# 1. Masuk ke direktori public_html
cd ~/public_html

# 2. Clone branch cpanel langsung ke folder ini
git clone -b ${TARGET_BRANCH} https://github.com/kh-badri/Iqra.git .
\`\`\`

### Opsi 2: Lewat Menu "Git™ Version Control" di cPanel
1. Masuk ke cPanel -> Buka menu **Git™ Version Control**.
2. Klik **Create**.
3. **Clone URL**: \`https://github.com/kh-badri/Iqra.git\`
4. **Branch**: \`${TARGET_BRANCH}\`
5. **Repository Path**: \`public_html\` (atau subdomain Anda)
6. Klik **Create** / **Deploy**.

Setiap kali ada pembaruan di masa depan, Anda cukup klik tombol **Update from Remote** di cPanel Git Version Control!
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

// Buat atau switch ke branch cpanel
execSync(`git checkout -B ${TARGET_BRANCH}`, { cwd: OUT_DIR, stdio: 'ignore' });

// Add all files
execSync('git add -A', { cwd: OUT_DIR, stdio: 'inherit' });

// Commit
const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
try {
  execSync(`git commit -m "cPanel Production Build - ${timestamp}"`, { cwd: OUT_DIR, stdio: 'inherit' });
} catch {
  console.log('ℹ️ Tidak ada perubahan baru di folder out.');
}

// Push ke origin cpanel
console.log(`📤 Mendorong (push) build ke branch '${TARGET_BRANCH}' di GitHub...`);
execSync(`git push ${REMOTE_NAME} ${TARGET_BRANCH} --force`, { cwd: OUT_DIR, stdio: 'inherit' });

console.log('✨ BERHASIL! Branch cPanel telah diperbarui di GitHub.');

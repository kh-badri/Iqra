import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[i] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4);
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

function createPng(width, height, drawFn) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // deflate
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // no interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  const rawData = Buffer.alloc((width * 4 + 1) * height);
  let offset = 0;

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Flat colors (design tokens)
const COLOR_BG = [246, 244, 238, 255]; // #F6F4EE
const COLOR_PRIMARY = [30, 107, 87, 255]; // #1E6B57
const COLOR_PRIMARY_SOFT = [220, 235, 228, 255]; // #DCEBE4
const COLOR_ACCENT = [179, 139, 58, 255]; // #B38B3A
const COLOR_SURFACE = [255, 255, 255, 255]; // #FFFFFF
const COLOR_BORDER = [225, 221, 208, 255]; // #E1DDD0
const COLOR_TEXT = [23, 48, 42, 255]; // #17302A
const COLOR_TEXT_MUTED = [94, 114, 107, 255]; // #5E726B

// Helper to check if point is in rect
function inRect(x, y, rx, ry, rw, rh) {
  return x >= rx && x < rx + rw && y >= ry && y < ry + rh;
}

// 1. Mobile Screenshot 1: Home & Prayer Times (540x960)
function drawMobile1(x, y, w, h) {
  // Header bar (y: 0 to 60)
  if (inRect(x, y, 0, 0, w, 60)) {
    // Header background
    return COLOR_SURFACE;
  }
  if (y === 60) return COLOR_BORDER;

  // Header logo block
  if (inRect(x, y, 20, 14, 32, 32)) return COLOR_PRIMARY;
  // Header title line
  if (inRect(x, y, 62, 20, 80, 10)) return COLOR_TEXT;
  if (inRect(x, y, 62, 34, 120, 6)) return COLOR_TEXT_MUTED;

  // Hero Prayer Card (y: 80 to 220)
  if (inRect(x, y, 20, 80, w - 40, 140)) {
    if (x === 20 || x === w - 21 || y === 80 || y === 219) return COLOR_BORDER;
    // Inner prayer card highlight banner
    if (inRect(x, y, 21, 81, w - 42, 40)) return COLOR_PRIMARY;
    return COLOR_SURFACE;
  }

  // Quick Action Grid (y: 240 to 330)
  for (let i = 0; i < 4; i++) {
    const qx = 20 + i * 125;
    const qw = 115;
    if (inRect(x, y, qx, 240, qw, 90)) {
      if (x === qx || x === qx + qw - 1 || y === 240 || y === 329) return COLOR_BORDER;
      if (inRect(x, y, qx + 37, 255, 40, 40)) return COLOR_PRIMARY_SOFT;
      return COLOR_SURFACE;
    }
  }

  // Surah List Section (y: 350 to 860)
  if (inRect(x, y, 20, 350, 140, 12)) return COLOR_TEXT;
  for (let i = 0; i < 5; i++) {
    const sy = 380 + i * 90;
    if (inRect(x, y, 20, sy, w - 40, 80)) {
      if (x === 20 || x === w - 21 || y === sy || y === sy + 79) return COLOR_BORDER;
      // Badge
      if (inRect(x, y, 35, sy + 20, 40, 40)) return COLOR_PRIMARY_SOFT;
      // Arabic text placeholder
      if (inRect(x, y, w - 140, sy + 22, 100, 16)) return COLOR_PRIMARY;
      // Latin title
      if (inRect(x, y, 90, sy + 24, 120, 12)) return COLOR_TEXT;
      // Subtitle
      if (inRect(x, y, 90, sy + 44, 90, 8)) return COLOR_TEXT_MUTED;
      return COLOR_SURFACE;
    }
  }

  // Bottom Navigation Bar (y: 890 to 960)
  if (inRect(x, y, 0, 890, w, 70)) {
    if (y === 890) return COLOR_BORDER;
    return COLOR_SURFACE;
  }

  return COLOR_BG;
}

// 2. Mobile Screenshot 2: Al-Qur'an Reading (540x960)
function drawMobile2(x, y, w, h) {
  // Top bar
  if (inRect(x, y, 0, 0, w, 60)) {
    if (y === 59) return COLOR_BORDER;
    if (inRect(x, y, 20, 20, 120, 16)) return COLOR_TEXT;
    return COLOR_SURFACE;
  }

  // Surah Banner (y: 75 to 190)
  if (inRect(x, y, 20, 75, w - 40, 115)) {
    if (x === 20 || x === w - 21 || y === 75 || y === 189) return COLOR_BORDER;
    if (inRect(x, y, (w / 2) - 60, 95, 120, 24)) return COLOR_PRIMARY;
    if (inRect(x, y, (w / 2) - 80, 130, 160, 10)) return COLOR_TEXT_MUTED;
    if (inRect(x, y, (w / 2) - 50, 150, 100, 16)) return COLOR_ACCENT;
    return COLOR_SURFACE;
  }

  // Ayah Cards
  for (let i = 0; i < 4; i++) {
    const ay = 210 + i * 165;
    if (inRect(x, y, 20, ay, w - 40, 150)) {
      if (x === 20 || x === w - 21 || y === ay || y === ay + 149) return COLOR_BORDER;
      // Ayah number badge
      if (inRect(x, y, 32, ay + 15, 30, 30)) return COLOR_PRIMARY_SOFT;
      // Arabic verse block
      if (inRect(x, y, 90, ay + 20, w - 130, 36)) return COLOR_TEXT;
      // Translation block
      if (inRect(x, y, 32, ay + 80, w - 64, 12)) return COLOR_TEXT_MUTED;
      if (inRect(x, y, 32, ay + 100, w - 120, 10)) return COLOR_TEXT_MUTED;
      // Action buttons
      if (inRect(x, y, 32, ay + 122, 60, 18)) return COLOR_PRIMARY_SOFT;
      return COLOR_SURFACE;
    }
  }

  // Bottom Audio Mini Player (y: 890 to 960)
  if (inRect(x, y, 0, 890, w, 70)) {
    if (y === 890) return COLOR_BORDER;
    if (inRect(x, y, 20, 905, 40, 40)) return COLOR_PRIMARY;
    if (inRect(x, y, 70, 915, 150, 12)) return COLOR_TEXT;
    return COLOR_SURFACE;
  }

  return COLOR_BG;
}

// 3. Desktop Screenshot (1280x720)
function drawDesktop(x, y, w, h) {
  // Sidebar (x: 0 to 260)
  if (x < 260) {
    if (x === 259) return COLOR_BORDER;
    // Brand header
    if (y < 80) {
      if (inRect(x, y, 24, 24, 36, 36)) return COLOR_PRIMARY;
      if (inRect(x, y, 70, 30, 90, 14)) return COLOR_TEXT;
      if (y === 79) return COLOR_BORDER;
      return COLOR_SURFACE;
    }
    // Sidebar nav items
    for (let i = 0; i < 7; i++) {
      const iy = 100 + i * 46;
      if (inRect(x, y, 16, iy, 228, 38)) {
        if (i === 1) return COLOR_PRIMARY; // Active item
        return COLOR_SURFACE;
      }
    }
    return COLOR_SURFACE;
  }

  // Main Desktop Content Area
  // Top header (y: 0 to 70)
  if (inRect(x, y, 260, 0, w - 260, 70)) {
    if (y === 69) return COLOR_BORDER;
    if (inRect(x, y, 290, 24, 200, 20)) return COLOR_TEXT;
    return COLOR_SURFACE;
  }

  // 3-Column Dashboard Cards (y: 95 to 300)
  const colW = Math.floor((w - 260 - 80) / 3);
  for (let c = 0; c < 3; c++) {
    const cx = 290 + c * (colW + 20);
    if (inRect(x, y, cx, 95, colW, 190)) {
      if (x === cx || x === cx + colW - 1 || y === 95 || y === 284) return COLOR_BORDER;
      if (inRect(x, y, cx + 20, 115, 40, 40)) return COLOR_PRIMARY_SOFT;
      if (inRect(x, y, cx + 70, 125, 120, 14)) return COLOR_TEXT;
      if (inRect(x, y, cx + 20, 175, colW - 40, 60)) return COLOR_PRIMARY_SOFT;
      return COLOR_SURFACE;
    }
  }

  // Surah Table / Grid Area (y: 315 to 690)
  if (inRect(x, y, 290, 315, w - 260 - 60, 370)) {
    if (x === 290 || x === w - 31 || y === 315 || y === 684) return COLOR_BORDER;
    // Table Header
    if (inRect(x, y, 291, 316, w - 260 - 62, 40)) return COLOR_PRIMARY_SOFT;
    // Rows
    for (let r = 0; r < 5; r++) {
      const ry = 356 + r * 60;
      if (y === ry) return COLOR_BORDER;
    }
    return COLOR_SURFACE;
  }

  return COLOR_BG;
}

const screenshotsDir = path.join(process.cwd(), 'public', 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

console.log('Generating PWA rich screenshots (flat, zero-gradient)...');

const mobile1 = createPng(540, 960, drawMobile1);
fs.writeFileSync(path.join(screenshotsDir, 'screenshot-mobile-1.png'), mobile1);
console.log('Saved public/screenshots/screenshot-mobile-1.png');

const mobile2 = createPng(540, 960, drawMobile2);
fs.writeFileSync(path.join(screenshotsDir, 'screenshot-mobile-2.png'), mobile2);
console.log('Saved public/screenshots/screenshot-mobile-2.png');

const desktop = createPng(1280, 720, drawDesktop);
fs.writeFileSync(path.join(screenshotsDir, 'screenshot-desktop.png'), desktop);
console.log('Saved public/screenshots/screenshot-desktop.png');

console.log('Screenshots generation complete!');

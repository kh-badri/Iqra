import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Simple pure-Node PNG generator using built-in zlib
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

function generateFlatPng(width, height, isMaskable = false) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // deflate
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // no interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Scanlines: width * 4 + 1 filter byte per line
  const rawData = Buffer.alloc((width * 4 + 1) * height);
  const primaryR = 30; // #1E6B57
  const primaryG = 107;
  const primaryB = 87;

  const accentR = 210; // #D2AE5E
  const accentG = 174;
  const accentB = 94;

  const whiteR = 246; // #F6F4EE
  const whiteG = 244;
  const whiteB = 238;

  let offset = 0;
  const cx = width / 2;
  const cy = height / 2;
  const innerR = width * 0.28;
  const outerR = width * 0.44;

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background flat primary #1E6B57
      let r = primaryR;
      let g = primaryG;
      let b = primaryB;
      let a = 255;

      // Decorative central flat Islamic circle emblem
      if (dist >= innerR && dist <= innerR + Math.max(2, width * 0.02)) {
        // Accent ring
        r = accentR;
        g = accentG;
        b = accentB;
      } else if (dist < innerR && dist > innerR * 0.85) {
        // Inner ring
        r = accentR;
        g = accentG;
        b = accentB;
      } else if (dist <= innerR * 0.75) {
        // Center symbol area
        if (Math.abs(dx) < width * 0.04 && Math.abs(dy) < height * 0.18) {
          // Central pillar/alif
          r = whiteR;
          g = whiteG;
          b = whiteB;
        } else if (Math.abs(dy) < height * 0.04 && Math.abs(dx) < width * 0.15) {
          // Cross bar
          r = whiteR;
          g = whiteG;
          b = whiteB;
        }
      }

      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const idatData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', idatData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const iconsDir = path.resolve('public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 192x192
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), generateFlatPng(192, 192));
// 512x512
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), generateFlatPng(512, 512));
// Maskable 512x512
fs.writeFileSync(path.join(iconsDir, 'icon-maskable.png'), generateFlatPng(512, 512, true));
// Apple touch icon 180x180
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), generateFlatPng(180, 180));
// Favicon 32x32
fs.writeFileSync(path.join(iconsDir, 'favicon-32.png'), generateFlatPng(32, 32));
fs.writeFileSync(path.resolve('public', 'favicon.ico'), generateFlatPng(32, 32));

console.log('Successfully generated flat PWA icons in public/icons/!');

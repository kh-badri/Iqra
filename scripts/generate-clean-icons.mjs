import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background: EXACT IQRA LIME-GREEN GRADIENT (#AEDC81 to #6CC51D) -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#A2DC73"/>
      <stop offset="100%" stop-color="#5BB315"/>
    </linearGradient>

    <!-- Deep Forest Green (Brand On-Primary #0D3B13 / #082A0E) -->
    <linearGradient id="forestDark" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#144A1B"/>
      <stop offset="100%" stop-color="#082A0E"/>
    </linearGradient>

    <!-- Rich Metallic Gold Accent -->
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF08A"/>
      <stop offset="35%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>

    <linearGradient id="goldBright" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB"/>
      <stop offset="40%" stop-color="#FCD34D"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>

    <!-- Clean Vector Pages (Pure Crisp White Paper) -->
    <linearGradient id="pageLeft" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="70%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#EDF2F7"/>
    </linearGradient>

    <linearGradient id="pageRight" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#EDF2F7"/>
      <stop offset="30%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#F8FAFC"/>
    </linearGradient>

    <!-- Clean Modern Drop Shadow -->
    <filter id="cleanShadow" x="-10%" y="-10%" width="120%" height="125%">
      <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#05240A" flood-opacity="0.38"/>
    </filter>

    <!-- Crescent Cutout Mask -->
    <mask id="crescentMask">
      <rect width="512" height="512" fill="white"/>
      <circle cx="282" cy="158" r="50" fill="black"/>
    </mask>
  </defs>

  <!-- 1. SQUIRCLE CONTAINER (iOS / Android Modern Squircle) -->
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  
  <!-- Subtle Translucent White Inner Ring -->
  <rect x="2.5" y="2.5" width="507" height="507" rx="109.5" fill="none" stroke="#FFFFFF" stroke-width="2.5" opacity="0.45"/>

  <!-- 2. SUBTLE ISLAMIC GEOMETRIC EMBELLISHMENT (WHITE TRANSLUCENT) -->
  <g opacity="0.22" stroke="#FFFFFF" fill="none" transform="translate(256, 252)">
    <circle cx="0" cy="0" r="170" stroke-width="2"/>
    <circle cx="0" cy="0" r="195" stroke-dasharray="6 8" stroke-width="1.5"/>
    <rect x="-115" y="-115" width="230" height="230" rx="20" stroke-width="1.5"/>
    <rect x="-115" y="-115" width="230" height="230" rx="20" stroke-width="1.5" transform="rotate(45)"/>
  </g>

  <!-- 3. MAIN EMBLEM GROUP (CLEAN VECTOR, SHARP & ICONIC) -->
  <g filter="url(#cleanShadow)">

    <!-- A. MIHRAB ARCH (BEHIND BOOK & CRESCENT) -->
    <path d="M 120 280 
             L 120 185 
             C 120 120 180 80 256 42 
             C 332 80 392 120 392 185 
             L 392 280" 
          fill="none" stroke="#FFFFFF" stroke-width="2.5" opacity="0.38"/>

    <!-- B. MAJESTIC GOLDEN ISLAMIC CRESCENT MOON & 8-POINT STAR -->
    <g id="crescent-group">
      <!-- Golden Crescent Moon -->
      <circle cx="256" cy="172" r="62" fill="url(#goldBright)" mask="url(#crescentMask)"/>

      <!-- 8-Point Islamic Star (Khatim Sulayman) Nestled Inside Crescent -->
      <g transform="translate(292, 162) scale(1.5)">
        <polygon points="0,-14 4,-4 14,0 4,4 0,14 -4,4 -14,0 -4,-4" fill="url(#goldBright)"/>
        <polygon points="0,-14 4,-4 14,0 4,4 0,14 -4,4 -14,0 -4,-4" fill="url(#goldBright)" transform="rotate(45)"/>
      </g>
    </g>

    <!-- C. THE OPEN HOLY QURAN (BALANCED, ELEVATED, CLEAN VECTOR) -->
    <g id="quran" transform="translate(0, 0)">
      <!-- 1. Hardcover Base (Deep Forest Green #082A0E Binding with Gold Edge) -->
      <path d="M 256 378 
               C 214 355 144 361 82 381 
               C 77 382 72 379 72 374 
               L 72 284 
               C 138 264 208 258 256 282 
               C 304 258 374 264 440 284 
               L 440 374 
               C 440 379 435 382 430 381 
               C 368 361 298 355 256 378 Z" 
            fill="url(#forestDark)"/>

      <!-- 2. Gilded Edge of Stacked Pages -->
      <path d="M 256 372 
               C 216 350 148 356 86 375 
               L 86 280 
               C 144 262 212 255 256 278 
               C 300 255 368 262 426 280 
               L 426 375 
               C 364 356 296 350 256 372 Z" 
            fill="#CBD5E1"/>

      <!-- 3. LEFT PAGE (CRISP CLEAN WHITE WITH GOLD RIM) -->
      <path d="M 256 364 
               C 218 343 152 349 92 367 
               C 89 368 86 366 86 363 
               L 86 272 
               C 86 269 89 267 92 266 
               C 148 248 214 242 256 264 Z" 
            fill="url(#pageLeft)"/>
      <path d="M 256 364 
               C 218 343 152 349 92 367 
               L 86 272 
               C 148 248 214 242 256 264 Z" 
            fill="none" stroke="url(#gold)" stroke-width="2.2"/>

      <!-- 4. RIGHT PAGE (CRISP CLEAN WHITE WITH GOLD RIM) -->
      <path d="M 256 364 
               C 294 343 360 349 420 367 
               C 423 368 426 366 426 363 
               L 426 272 
               C 426 269 423 267 420 266 
               C 364 248 298 242 256 264 Z" 
            fill="url(#pageRight)"/>
      <path d="M 256 364 
               C 294 343 360 349 420 367 
               L 426 272 
               C 364 248 298 242 256 264 Z" 
            fill="none" stroke="url(#gold)" stroke-width="2.2"/>

      <!-- 5. ELEGANT GOLDEN VERSE LINES (CLEAN, MINIMALIST, HIGH LEGIBILITY) -->
      <g stroke="url(#gold)" stroke-linecap="round" opacity="0.95">
        <!-- Left Page Verses -->
        <line x1="124" y1="284" x2="234" y2="278" stroke-width="3"/>
        <line x1="118" y1="301" x2="236" y2="295" stroke-width="2.5"/>
        <line x1="120" y1="318" x2="234" y2="313" stroke-width="2.5"/>
        <line x1="130" y1="335" x2="224" y2="331" stroke-width="2"/>

        <!-- Right Page Verses -->
        <line x1="278" y1="278" x2="388" y2="284" stroke-width="3"/>
        <line x1="276" y1="295" x2="394" y2="301" stroke-width="2.5"/>
        <line x1="278" y1="313" x2="392" y2="318" stroke-width="2.5"/>
        <line x1="288" y1="331" x2="382" y2="335" stroke-width="2"/>
      </g>

      <!-- 6. GOLDEN RIBBON BOOKMARK (FLOWING DOWN THROUGH CENTER) -->
      <path d="M 250 264 
               L 262 264 
               L 265 418 
               L 256 410 
               L 248 418 Z" 
            fill="url(#goldBright)"/>
      <path d="M 250 264 
               L 262 264 
               L 265 418 
               L 256 410 
               L 248 418 Z" 
            fill="none" stroke="#D97706" stroke-width="1.2"/>
    </g>

  </g>
</svg>`;

// Save master SVG
fs.writeFileSync(path.resolve('public', 'icons', 'logo.svg'), svgContent, 'utf-8');

const htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: transparent; width: 512px; height: 512px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
</style>
</head>
<body>
${svgContent}
</body>
</html>`;

const tempHtml = path.resolve('scripts', 'temp-render-icon.html');
fs.writeFileSync(tempHtml, htmlContent, 'utf-8');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const out512 = path.resolve('public', 'icons', 'icon-512.png');

console.log('1. Rendering clean lime-green vector 512x512 via Edge headless...');
execSync(`"${edgePath}" --headless --screenshot="${out512}" --window-size=512,512 --default-background-color=00000000 --hide-scrollbars "file:///${tempHtml.replace(/\\\\/g, '/')}"`);

// Copy to logo.png and master
fs.copyFileSync(out512, path.resolve('public', 'icons', 'logo.png'));
fs.copyFileSync(out512, path.resolve('public', 'icons', 'app-icon-master.png'));

console.log('2. Generating icon-192, apple-touch-icon, favicon-32, favicon.ico, and maskable...');
const resizeScript = `
Add-Type -AssemblyName System.Drawing
$icon512 = [System.Drawing.Bitmap]::FromFile('${out512.replace(/\\/g, '\\\\')}')

function Resize-Bitmap($sourceBmp, $targetW, $targetH) {
    $dest = New-Object System.Drawing.Bitmap($targetW, $targetH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($sourceBmp, 0, 0, $targetW, $targetH)
    $g.Dispose()
    return $dest
}

# 192x192
$icon192 = Resize-Bitmap $icon512 192 192
$icon192.Save('public\\icons\\icon-192.png', [System.Drawing.Imaging.ImageFormat]::Png)
$icon192.Dispose()

# 180x180 (Apple touch icon)
$icon180 = Resize-Bitmap $icon512 180 180
$icon180.Save('public\\icons\\apple-touch-icon.png', [System.Drawing.Imaging.ImageFormat]::Png)
$icon180.Dispose()

# 32x32 Favicon
$icon32 = Resize-Bitmap $icon512 32 32
$icon32.Save('public\\icons\\favicon-32.png', [System.Drawing.Imaging.ImageFormat]::Png)
$icon32.Dispose()

# Favicon.ico
$hIcon = $icon512.GetHicon()
$ico = [System.Drawing.Icon]::FromHandle($hIcon)
$fs = [System.IO.File]::OpenWrite('public\\favicon.ico')
$ico.Save($fs)
$fs.Close()
$ico.Dispose()

# Maskable 512x512 for Android launcher (Adaptive)
$maskable = New-Object System.Drawing.Bitmap(512, 512, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gm = [System.Drawing.Graphics]::FromImage($maskable)
$gm.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gm.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gm.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(0, 0)),
    (New-Object System.Drawing.Point(0, 512)),
    [System.Drawing.Color]::FromArgb(255, 162, 220, 115),
    [System.Drawing.Color]::FromArgb(255, 91, 179, 21)
)
$gm.FillRectangle($bgBrush, 0, 0, 512, 512)
$bgBrush.Dispose()

$safeRect = New-Object System.Drawing.Rectangle(44, 44, 424, 424)
$gm.DrawImage($icon512, $safeRect, 0, 0, 512, 512, [System.Drawing.GraphicsUnit]::Pixel)
$gm.Dispose()

$maskable.Save('public\\icons\\icon-maskable.png', [System.Drawing.Imaging.ImageFormat]::Png)
$maskable.Dispose()

$icon512.Dispose()
Write-Host "All lime-green clean icons generated successfully!"
`;

fs.writeFileSync(path.resolve('scripts', 'temp-resize.ps1'), resizeScript, 'utf-8');
execSync(`powershell -ExecutionPolicy Bypass -File "${path.resolve('scripts', 'temp-resize.ps1')}"`, { stdio: 'inherit' });

// Cleanup temp scripts
try {
  fs.unlinkSync(tempHtml);
  fs.unlinkSync(path.resolve('scripts', 'temp-resize.ps1'));
  const testFiles = fs.readdirSync(path.resolve('public', 'icons')).filter(f => f.startsWith('test-'));
  testFiles.forEach(f => fs.unlinkSync(path.resolve('public', 'icons', f)));
  const scriptTestFiles = fs.readdirSync(path.resolve('scripts')).filter(f => f.startsWith('temp-') || (f.startsWith('render-') && f !== 'generate-clean-icons.mjs'));
  scriptTestFiles.forEach(f => fs.unlinkSync(path.resolve('scripts', f)));
} catch (e) {}

console.log('FINISHED GENERATING LIME-GREEN CLEAN ICONS!');

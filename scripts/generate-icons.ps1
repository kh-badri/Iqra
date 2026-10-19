# Script pembangkit icon modern & Islami untuk Iqra
Add-Type -AssemblyName System.Drawing

$masterSrc = 'C:\Users\khbad\.gemini\antigravity-cli\brain\e8190f76-dc73-49cb-a69c-5b9a51f28c0c\iqra_app_icon_1792396138788.jpg'
if (-not (Test-Path $masterSrc)) {
    $masterSrc = 'public\icons\app-icon-master.png'
}

$src = [System.Drawing.Bitmap]::FromFile((Resolve-Path $masterSrc))

# 1. 512x512 Squircle dengan transparansi di luar rim emas
$rectX = 99
$rectY = 97
$rectW = 824
$rectH = 835

$icon512 = New-Object System.Drawing.Bitmap(512, 512, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($icon512)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$r = 112 # Corner radius
$d = $r * 2
$path.AddArc(0, 0, $d, $d, 180, 90)
$path.AddArc(512 - $d, 0, $d, $d, 270, 90)
$path.AddArc(512 - $d, 512 - $d, $d, $d, 0, 90)
$path.AddArc(0, 512 - $d, $d, $d, 90, 90)
$path.CloseFigure()

$g.SetClip($path)
$destRect = New-Object System.Drawing.Rectangle(0, 0, 512, 512)
$srcRect = New-Object System.Drawing.Rectangle($rectX, $rectY, $rectW, $rectH)
$g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

$icon512.Save('public\icons\icon-512.png', [System.Drawing.Imaging.ImageFormat]::Png)
$icon512.Save('public\icons\logo.png', [System.Drawing.Imaging.ImageFormat]::Png)
$src.Save('public\icons\app-icon-master.png', [System.Drawing.Imaging.ImageFormat]::Png)

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
$icon192.Save('public\icons\icon-192.png', [System.Drawing.Imaging.ImageFormat]::Png)
$icon192.Dispose()

# 180x180 (Apple Touch Icon)
$icon180 = Resize-Bitmap $icon512 180 180
$icon180.Save('public\icons\apple-touch-icon.png', [System.Drawing.Imaging.ImageFormat]::Png)
$icon180.Dispose()

# 32x32 Favicon
$icon32 = Resize-Bitmap $icon512 32 32
$icon32.Save('public\icons\favicon-32.png', [System.Drawing.Imaging.ImageFormat]::Png)
$icon32.Dispose()

# Favicon.ico
$hIcon = $icon512.GetHicon()
$ico = [System.Drawing.Icon]::FromHandle($hIcon)
$fs = [System.IO.File]::OpenWrite('public\favicon.ico')
$ico.Save($fs)
$fs.Close()
$ico.Dispose()

# Maskable 512x512 untuk Android
$maskable = New-Object System.Drawing.Bitmap(512, 512, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gm = [System.Drawing.Graphics]::FromImage($maskable)
$gm.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gm.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gm.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(0, 0)),
    (New-Object System.Drawing.Point(0, 512)),
    [System.Drawing.Color]::FromArgb(255, 14, 82, 60),
    [System.Drawing.Color]::FromArgb(255, 6, 36, 26)
)
$gm.FillRectangle($bgBrush, 0, 0, 512, 512)
$bgBrush.Dispose()

$safeRect = New-Object System.Drawing.Rectangle(44, 44, 424, 424)
$gm.DrawImage($icon512, $safeRect, 0, 0, 512, 512, [System.Drawing.GraphicsUnit]::Pixel)
$gm.Dispose()

$maskable.Save('public\icons\icon-maskable.png', [System.Drawing.Imaging.ImageFormat]::Png)
$maskable.Dispose()

$icon512.Dispose()
$src.Dispose()

Remove-Item -Path 'public\icons\test-*.png' -ErrorAction SilentlyContinue

Write-Host "Islamic Iqra icons regenerated successfully!"

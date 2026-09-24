Add-Type -AssemblyName System.Drawing

$srcPath = "D:\lbbmuallimin\DENAH LBB MU'ALLIMIN 2027.png"
$destPath = "D:\lbbmuallimin\public\denah-lbb-muallimin-2027.png"

$orig = [System.Drawing.Image]::FromFile($srcPath)
$width = $orig.Width
$height = $orig.Height

Write-Host "Original dimensions: $width x $height"

# Create new bitmap with same dimensions
$bmp = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($bmp)

# Set high quality render settings
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

# Clear with white background
$graphics.Clear([System.Drawing.Color]::White)

# Draw original image over white background
$graphics.DrawImage($orig, 0, 0, $width, $height)

# Save as PNG
$bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

$graphics.Dispose()
$bmp.Dispose()
$orig.Dispose()

Write-Host "Successfully generated white background image at: $destPath"

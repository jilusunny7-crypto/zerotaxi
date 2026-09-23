Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\finum\.gemini\antigravity\brain\b24badd4-a2de-44c1-a1af-cfbb945e45f5\crysta_cursor_1790095879606.jpg"
$destPath32 = "C:\Users\finum\.gemini\antigravity\scratch\zero-taxi-website\assets\images\crysta-cursor.png"
$destPath64 = "C:\Users\finum\.gemini\antigravity\scratch\zero-taxi-website\assets\images\crysta-cursor-64.png"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
$width = $src.Width
$height = $src.Height

# Create ARGB bitmap
$transparentBmp = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Copy pixels
for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        $c = $src.GetPixel($x, $y)
        $transparentBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $c.R, $c.G, $c.B))
    }
}
$src.Dispose()

# Flood fill from border pixels
$visited = New-Object 'bool[,]' $width, $height
$queue = New-Object System.Collections.Generic.Queue[System.Drawing.Point]

# Enqueue borders
for ($x = 0; $x -lt $width; $x++) {
    $queue.Enqueue((New-Object System.Drawing.Point($x, 0)))
    $queue.Enqueue((New-Object System.Drawing.Point($x, $height - 1)))
    $visited[$x, 0] = $true
    $visited[$x, $height - 1] = $true
}
for ($y = 0; $y -lt $height; $y++) {
    $queue.Enqueue((New-Object System.Drawing.Point(0, $y)))
    $queue.Enqueue((New-Object System.Drawing.Point($width - 1, $y)))
    $visited[0, $y] = $true
    $visited[$width - 1, $y] = $true
}

$threshold = 45 # Dark background threshold

while ($queue.Count -gt 0) {
    $pt = $queue.Dequeue()
    $px = $pt.X
    $py = $pt.Y
    $c = $transparentBmp.GetPixel($px, $py)

    # If it is dark background, make it transparent and expand
    if ($c.R -le $threshold -and $c.G -le $threshold -and $c.B -le $threshold) {
        $transparentBmp.SetPixel($px, $py, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))

        # Check neighbors
        $neighbors = @(
            (New-Object System.Drawing.Point($px + 1, $py)),
            (New-Object System.Drawing.Point($px - 1, $py)),
            (New-Object System.Drawing.Point($px, $py + 1)),
            (New-Object System.Drawing.Point($px, $py - 1))
        )

        foreach ($n in $neighbors) {
            if ($n.X -ge 0 -and $n.X -lt $width -and $n.Y -ge 0 -and $n.Y -lt $height) {
                if (-not $visited[$n.X, $n.Y]) {
                    $visited[$n.X, $n.Y] = $true
                    $queue.Enqueue($n)
                }
            }
        }
    }
}

# Crop to car bounds
$minX = $width; $maxX = 0; $minY = $height; $maxY = 0
for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        $c = $transparentBmp.GetPixel($x, $y)
        if ($c.A -gt 0) {
            # Also ignore the soft ground shadow if it's below the tires
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

$carW = $maxX - $minX + 1
$carH = $maxY - $minY + 1
Write-Output "Transparent car bounds: $carW x $carH"

# Crop
$rect = New-Object System.Drawing.Rectangle($minX, $minY, $carW, $carH)
$croppedCar = $transparentBmp.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$transparentBmp.Dispose()

# Create 32x32 Cursor
# Standard car cursor: width 32, height proportionally ~ 14
$cursor32 = New-Object System.Drawing.Bitmap(32, 32, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g32 = [System.Drawing.Graphics]::FromImage($cursor32)
$g32.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g32.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g32.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$targetW32 = 32
$targetH32 = [int][Math]::Round(32 * ($carH / $carW))
$g32.DrawImage($croppedCar, 0, 0, $targetW32, $targetH32)
$g32.Dispose()
$cursor32.Save($destPath32, [System.Drawing.Imaging.ImageFormat]::Png)
$cursor32.Dispose()

# Create 48x48 / 64x64 HiDPI Cursor
$cursor64 = New-Object System.Drawing.Bitmap(48, 48, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g64 = [System.Drawing.Graphics]::FromImage($cursor64)
$g64.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g64.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g64.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$targetW64 = 48
$targetH64 = [int][Math]::Round(48 * ($carH / $carW))
$g64.DrawImage($croppedCar, 0, 0, $targetW64, $targetH64)
$g64.Dispose()
$cursor64.Save($destPath64, [System.Drawing.Imaging.ImageFormat]::Png)
$cursor64.Dispose()

$croppedCar.Dispose()
Write-Output "Successfully generated crysta-cursor.png (32x32) and crysta-cursor-64.png (48x48) with transparent background!"

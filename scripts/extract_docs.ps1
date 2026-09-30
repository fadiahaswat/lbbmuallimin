Add-Type -AssemblyName System.IO.Compression.FileSystem

function Read-Docx($path) {
    Write-Host "=== FILE: $path ==="
    $zip = [System.IO.Compression.ZipFile]::OpenRead($path)
    $entry = $zip.GetEntry("word/document.xml")
    if ($entry) {
        $stream = $entry.Open()
        $reader = New-Object System.IO.StreamReader($stream)
        $content = $reader.ReadToEnd()
        $reader.Close()
        $stream.Close()
        # strip xml tags to readable text
        $text = $content -replace '<w:p[ >]', "`n`n<w:p>" -replace '<[^>]+>', ''
        $text = [System.Net.WebUtility]::HtmlDecode($text)
        Write-Output $text
    }
    $zip.Dispose()
}

function Read-Xlsx($path) {
    Write-Host "=== XLSX FILE: $path ==="
    $zip = [System.IO.Compression.ZipFile]::OpenRead($path)
    $entry = $zip.GetEntry("xl/sharedStrings.xml")
    if ($entry) {
        $stream = $entry.Open()
        $reader = New-Object System.IO.StreamReader($stream)
        $content = $reader.ReadToEnd()
        $reader.Close()
        $stream.Close()
        $strings = ($content -replace '<[^>]+>', "`n") -split "`n" | Where-Object { $_.Trim().Length -gt 0 }
        Write-Output ($strings -join "`n")
    }
    $zip.Dispose()
}

$files = Get-ChildItem "D:\BERKAS LBB MU'ALLIMIN 2027" -File
foreach ($f in $files) {
    if ($f.Extension -eq ".docx") {
        $txt = Read-Docx $f.FullName
        $outPath = "scripts\dump_" + $f.BaseName + ".txt"
        $txt | Out-File -FilePath $outPath -Encoding utf8
        Write-Host "Wrote $outPath"
    } elseif ($f.Extension -eq ".xlsx") {
        $txt = Read-Xlsx $f.FullName
        $outPath = "scripts\dump_" + $f.BaseName + ".txt"
        $txt | Out-File -FilePath $outPath -Encoding utf8
        Write-Host "Wrote $outPath"
    }
}

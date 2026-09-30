Add-Type -AssemblyName System.IO.Compression.FileSystem

function Dump-Xlsx($path, $outTxt) {
    $zip = [System.IO.Compression.ZipFile]::OpenRead($path)
    $ssEntry = $zip.GetEntry('xl/sharedStrings.xml')
    $strings = @()
    if ($ssEntry) {
        $r = New-Object System.IO.StreamReader($ssEntry.Open())
        $xml = [xml]$r.ReadToEnd()
        $r.Close()
        $strings = @($xml.sst.si | ForEach-Object { 
            if ($_.t) { $_.t } else { ($_.r.t -join '') }
        })
    }
    
    $out = @()
    foreach($sheet in ($zip.Entries | Where-Object { $_.FullName -like 'xl/worksheets/sheet*.xml' })) {
        $out += "=== Sheet: $($sheet.FullName) ==="
        $r = New-Object System.IO.StreamReader($sheet.Open())
        $sxml = [xml]$r.ReadToEnd()
        $r.Close()
        foreach($row in $sxml.worksheet.sheetData.row) {
            $line = @()
            foreach($c in $row.c) {
                $val = $c.v
                if ($c.t -eq 's' -and $val -ne $null) {
                    $val = $strings[[int]$val]
                }
                $line += "$($c.r): $val"
            }
            $out += ($line -join ' | ')
        }
    }
    $zip.Dispose()
    $out | Out-File -FilePath $outTxt -Encoding utf8
    Write-Host "Wrote $outTxt"
}

Dump-Xlsx "D:\BERKAS LBB MU'ALLIMIN 2027\RAB LBB MU'ALLIMIN 2027.xlsx" "scripts\dump_RAB_cells.txt"
Dump-Xlsx "D:\BERKAS LBB MU'ALLIMIN 2027\TIMELINE LBB MU'ALLIMIN 2027.xlsx" "scripts\dump_TIMELINE_cells.txt"

<#
renderizar.ps1 -- gera a previa do deck: um PNG por slide + folha de contato (para revisar o lote numa imagem so).
Uso: powershell -ExecutionPolicy Bypass -File renderizar.ps1 -Deck deck.pptx [-Saida render] [-Slides 3,4,5] [-Largura 1600]

Usa o PowerPoint instalado (fiel as fontes reais). Sem PowerPoint, tenta LibreOffice + pdftoppm.
Nao fecha o PowerPoint se o usuario ja estiver com apresentacoes abertas.
Saida: <Saida>\Slide<N>.png e <Saida>\folha.png (ou folha_01.png, folha_02.png... acima de 12 slides).
#>
param(
  [Parameter(Mandatory = $true)][string]$Deck,
  [string]$Saida,
  [int[]]$Slides,
  [int]$Largura = 1600
)
$ErrorActionPreference = 'Stop'
$Deck = (Resolve-Path $Deck).Path
if (-not $Saida) { $Saida = Join-Path (Split-Path -Parent $Deck) 'render' }
New-Item -ItemType Directory -Force -Path $Saida | Out-Null
$Saida = (Resolve-Path $Saida).Path
Get-ChildItem $Saida -Filter 'Slide*.png' -ErrorAction SilentlyContinue | Remove-Item -Force
Get-ChildItem $Saida -Filter 'folha*.png' -ErrorAction SilentlyContinue | Remove-Item -Force
$Altura = [int]($Largura * 9 / 16)
$gerados = @()

if (Test-Path 'Registry::HKEY_CLASSES_ROOT\PowerPoint.Application') {
  $app = New-Object -ComObject PowerPoint.Application
  $jaAberto = $app.Presentations.Count
  # Open(FileName, ReadOnly, Untitled, WithWindow): msoTrue = -1, msoFalse = 0
  $p = $app.Presentations.Open($Deck, -1, 0, 0)
  try {
    $total = $p.Slides.Count
    $lista = if ($Slides) { $Slides } else { 1..$total }
    foreach ($i in $lista) {
      if ($i -lt 1 -or $i -gt $total) { continue }
      $arq = Join-Path $Saida ("Slide{0}.png" -f $i)
      $p.Slides.Item($i).Export($arq, 'PNG', $Largura, $Altura)
      $gerados += $arq
    }
  } finally {
    $p.Close()
    if ($jaAberto -eq 0) { $app.Quit() }
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($app) | Out-Null
  }
} else {
  $soffice = (Get-Command soffice -ErrorAction SilentlyContinue).Source
  if (-not $soffice -and (Test-Path "$env:ProgramFiles\LibreOffice\program\soffice.exe")) { $soffice = "$env:ProgramFiles\LibreOffice\program\soffice.exe" }
  if (-not $soffice) { throw 'Sem PowerPoint e sem LibreOffice: nao ha como renderizar a previa nesta maquina.' }
  & $soffice --headless --convert-to pdf --outdir $Saida $Deck | Out-Null
  $pdf = Join-Path $Saida ([IO.Path]::GetFileNameWithoutExtension($Deck) + '.pdf')
  if (-not (Get-Command pdftoppm -ErrorAction SilentlyContinue)) { throw "PDF gerado em $pdf, mas falta pdftoppm para virar PNG." }
  & pdftoppm -png -scale-to-x $Largura -scale-to-y $Altura $pdf (Join-Path $Saida 'Slide') | Out-Null
  Get-ChildItem $Saida -Filter 'Slide-*.png' | ForEach-Object {
    $n = [int]($_.BaseName -replace '^Slide-0*', '')
    if ($Slides -and ($Slides -notcontains $n)) { Remove-Item $_.FullName; return }
    $novo = Join-Path $Saida ("Slide{0}.png" -f $n); Move-Item $_.FullName $novo -Force; $gerados += $novo
  }
}

# folha de contato: 3 colunas, ate 12 slides por folha, numero do slide no canto
Add-Type -AssemblyName System.Drawing
$gerados = $gerados | Sort-Object { [int](([IO.Path]::GetFileNameWithoutExtension($_)) -replace '\D', '') }
$tw = 640; $th = 360; $m = 16; $cols = 3; $porFolha = 12
$folhas = [Math]::Ceiling($gerados.Count / $porFolha)
for ($f = 0; $f -lt $folhas; $f++) {
  $lote = $gerados | Select-Object -Skip ($f * $porFolha) -First $porFolha
  $linhas = [Math]::Ceiling($lote.Count / $cols)
  $bmp = New-Object System.Drawing.Bitmap ($cols * ($tw + $m) + $m), ($linhas * ($th + $m) + $m)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'; $g.Clear([System.Drawing.Color]::FromArgb(64, 64, 64))
  $fonte = New-Object System.Drawing.Font 'Arial', 14, ([System.Drawing.FontStyle]::Bold)
  $k = 0
  foreach ($arq in $lote) {
    $img = [System.Drawing.Image]::FromFile($arq)
    $x = $m + ($k % $cols) * ($tw + $m); $y = $m + [Math]::Floor($k / $cols) * ($th + $m)
    $g.DrawImage($img, $x, $y, $tw, $th); $img.Dispose()
    $num = ([IO.Path]::GetFileNameWithoutExtension($arq)) -replace '\D', ''
    $g.FillRectangle([System.Drawing.Brushes]::Black, $x, $y, 34, 24)
    $g.DrawString($num, $fonte, [System.Drawing.Brushes]::White, $x + 4, $y + 2)
    $k++
  }
  $nome = if ($folhas -eq 1) { 'folha.png' } else { 'folha_{0:D2}.png' -f ($f + 1) }
  $bmp.Save((Join-Path $Saida $nome), [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
}
Write-Host ("{0} slide(s) em {1}; folha(s) de contato: {2}" -f $gerados.Count, $Saida, $folhas)

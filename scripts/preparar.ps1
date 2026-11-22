<#
preparar.ps1 -- prepara a pasta de trabalho de um deck (Windows).
Uso: powershell -ExecutionPolicy Bypass -File <skill>\scripts\preparar.ps1 -Destino <pasta do deck>

Faz, em um comando, o que antes era redescoberto a cada sessao:
  1. copia scripts\*, assets\imagens e assets\referencias da skill para a pasta;
  2. acha o Python que tem lxml (python3, py ou python) e confere o Pillow;
  3. confere node e pptxgenjs (instala pptxgenjs na pasta se faltar e -SemInstalar nao for passado);
  4. confere as fontes aprovadas (Gill Sans MT, Montserrat, Dubai);
  5. escolhe o renderizador da previa (PowerPoint instalado ou LibreOffice);
  6. grava ambiente.json na pasta (o agente le daqui o comando do Python e o renderizador).
Nao apaga nada: arquivos que ja existem na pasta (build_deck.js, estilo_deck.json, identidade_visual.json) ficam como estao.
#>
param(
  [string]$Destino = (Get-Location).Path,
  [switch]$SemInstalar
)
$ErrorActionPreference = 'Stop'
$Skill = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path (Join-Path $Skill 'SKILL.md'))) { throw "Nao achei SKILL.md em $Skill (rode o script de dentro de <skill>\scripts)." }
New-Item -ItemType Directory -Force -Path $Destino | Out-Null
$Destino = (Resolve-Path $Destino).Path

# 1. copias (scripts sempre atualizados; imagens e referencias so se faltarem)
Get-ChildItem (Join-Path $Skill 'scripts') -File | Copy-Item -Destination $Destino -Force
foreach ($par in @(@('assets\imagens', 'imagens'), @('assets\referencias', 'referencias'))) {
  $alvo = Join-Path $Destino $par[1]
  if (-not (Test-Path $alvo)) { Copy-Item (Join-Path $Skill $par[0]) $alvo -Recurse }
}

# 2. python com lxml
$python = $null
foreach ($c in @('python3', 'py', 'python')) {
  try {
    & $c -I -c "import lxml.etree" 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) { $python = $c; break }
  } catch { }
}
$pillow = $false
if ($python) { try { & $python -I -c "import PIL.Image" 2>$null | Out-Null; $pillow = ($LASTEXITCODE -eq 0) } catch { } }

# 3. node e pptxgenjs
$node = $null
try { $node = (& node --version) } catch { }
$pptxgen = $false
if ($node) {
  Push-Location $Destino
  try {
    & node -e "require.resolve('pptxgenjs')" 2>$null | Out-Null
    $pptxgen = ($LASTEXITCODE -eq 0)
    if (-not $pptxgen -and -not $SemInstalar) {
      Write-Host 'pptxgenjs ausente: instalando na pasta do deck (npm install pptxgenjs)...'
      & npm install pptxgenjs --no-audit --no-fund --silent | Out-Null
      & node -e "require.resolve('pptxgenjs')" 2>$null | Out-Null
      $pptxgen = ($LASTEXITCODE -eq 0)
    }
  } finally { Pop-Location }
}

# 4. fontes aprovadas
$pastasFonte = @("$env:WINDIR\Fonts", "$env:LOCALAPPDATA\Microsoft\Windows\Fonts")
function Test-Fonte($padrao) { foreach ($p in $pastasFonte) { if ((Test-Path $p) -and (Get-ChildItem $p -Filter $padrao -ErrorAction SilentlyContinue)) { return $true } }; return $false }
$fontes = [ordered]@{ 'Gill Sans MT' = (Test-Fonte 'GIL*.TTF'); 'Montserrat' = (Test-Fonte 'Montserrat*'); 'Dubai' = (Test-Fonte 'DUBAI*') }

# 5. renderizador
$render = 'nenhum'
if (Test-Path 'Registry::HKEY_CLASSES_ROOT\PowerPoint.Application') { $render = 'powerpoint' }
elseif (Get-Command soffice -ErrorAction SilentlyContinue) { $render = 'libreoffice' }
elseif (Test-Path "$env:ProgramFiles\LibreOffice\program\soffice.exe") { $render = 'libreoffice' }

# 6. ambiente.json
$amb = [ordered]@{
  skill = $Skill; pasta = $Destino; python = $python; pillow = $pillow; node = $node; pptxgenjs = $pptxgen
  fontes = $fontes; renderizador = $render
  renderizar = "powershell -ExecutionPolicy Bypass -File `"$Destino\renderizar.ps1`" -Deck <arquivo.pptx>"
  qa = "$python qa_deck.py <arquivo.pptx> --fonte `"<fonte>`""
}
$json = $amb | ConvertTo-Json -Depth 4
[System.IO.File]::WriteAllText((Join-Path $Destino 'ambiente.json'), $json, (New-Object System.Text.UTF8Encoding $false))

Write-Host "Pasta pronta: $Destino"
Write-Host ("  python: {0} (lxml ok{1})" -f ($(if ($python) { $python } else { 'NAO ENCONTRADO' })), $(if ($pillow) { ', Pillow ok' } else { ', sem Pillow' }))
Write-Host "  node: $node | pptxgenjs: $pptxgen | previa: $render"
Write-Host ("  fontes: " + (($fontes.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" }) -join ', '))
if (-not $python) { Write-Warning 'Sem Python com lxml: instale Python e rode  py -m pip install lxml pillow' }
if (-not $pptxgen) { Write-Warning 'Sem pptxgenjs: rode  npm install pptxgenjs  na pasta do deck' }

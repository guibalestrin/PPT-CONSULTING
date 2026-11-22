<#
empacotar.ps1 -- gera o ZIP da skill a partir desta fonte unica (pasta skill\, versionada com git).
Uso: powershell -ExecutionPolicy Bypass -File skill\_dev\empacotar.ps1 [-Versao 2026.11.22]
Saida: Consultoria - SKILL\dist\slides-consultoria-br_<versao>.zip (SKILL.md na raiz, como o Claude espera).
Fica fora do ZIP: .git, .gitignore, .gitattributes, _dev\, node_modules, __pycache__.
Depois: Claude > Configuracoes > Capacidades > Skills > substituir slides-consultoria-br pelo ZIP novo.
#>
param([string]$Versao = (Get-Date -Format 'yyyy.MM.dd'))
$ErrorActionPreference = 'Stop'
$Fonte = Split-Path -Parent $PSScriptRoot
$Dist = Join-Path (Split-Path -Parent $Fonte) 'dist'
New-Item -ItemType Directory -Force -Path $Dist | Out-Null
$Zip = Join-Path $Dist "slides-consultoria-br_$Versao.zip"
if (Test-Path $Zip) { Remove-Item $Zip -Force }

# aviso se houver mudanca nao commitada (o ZIP deve corresponder a um commit)
Push-Location $Fonte
try { $sujo = (& git status --porcelain) } catch { $sujo = $null }
$commit = try { (& git rev-parse --short HEAD) } catch { 'sem-git' }
Pop-Location
if ($sujo) { Write-Warning 'Ha mudancas nao commitadas na fonte: o ZIP vai incluir arquivos que nao estao no historico.' }

Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem
$fora = '^(\.git(/|$)|\.gitignore$|\.gitattributes$|_dev/|.*node_modules/|.*__pycache__/)'
$arquivos = Get-ChildItem $Fonte -Recurse -File | ForEach-Object {
  $rel = $_.FullName.Substring($Fonte.Length + 1) -replace '\\', '/'
  if ($rel -notmatch $fora) { [pscustomobject]@{ Caminho = $_.FullName; Rel = $rel } }
}
$z = [System.IO.Compression.ZipFile]::Open($Zip, 'Create')
try {
  foreach ($a in $arquivos) {
    # barra normal nos nomes (o Compress-Archive do PowerShell 5.1 grava "\" e quebra o upload)
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($z, $a.Caminho, $a.Rel, 'Optimal') | Out-Null
  }
} finally { $z.Dispose() }
$mb = [Math]::Round((Get-Item $Zip).Length / 1MB, 1)
Write-Host "ZIP gerado: $Zip ($($arquivos.Count) arquivos, $mb MB, commit $commit)"

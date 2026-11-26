# Inicia MySQL, backend y frontend, y abre la tienda en el navegador.
# Se puede ejecutar con doble clic en iniciar.cmd.
$ErrorActionPreference = "Stop"
$raiz = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $raiz

function Esperar-Url($url, $intentos = 60) {
    for ($i = 0; $i -lt $intentos; $i++) {
        try {
            Invoke-WebRequest -UseBasicParsing $url -TimeoutSec 2 | Out-Null
            return $true
        } catch {
            Start-Sleep -Seconds 2
        }
    }
    return $false
}

Write-Host "== Canela & Miel ==" -ForegroundColor Yellow

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "No se encontro Docker. Instala Docker Desktop y vuelve a intentar." -ForegroundColor Red
    exit 1
}
if (-not (Get-Command java -ErrorAction SilentlyContinue)) {
    Write-Host "No se encontro Java. Instala JDK 17." -ForegroundColor Red
    exit 1
}
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "No se encontro Node.js. Instala Node 20 o superior." -ForegroundColor Red
    exit 1
}

try {
    docker info | Out-Null
} catch {
    Write-Host "Docker Desktop esta apagado. Abrelo y vuelve a ejecutar este script." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Creado .env a partir de .env.example." -ForegroundColor Green
}

Write-Host "Levantando MySQL..." -ForegroundColor Cyan
docker compose up -d

$mysqlListo = $false
for ($i = 0; $i -lt 60; $i++) {
    $estado = docker inspect --format "{{.State.Health.Status}}" canela-mysql 2>$null
    if ($estado -eq "healthy") {
        $mysqlListo = $true
        break
    }
    Start-Sleep -Seconds 2
}
if (-not $mysqlListo) {
    Write-Host "MySQL no quedo healthy. Revisa 'docker compose logs mysql'." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "Instalando dependencias del frontend (solo la primera vez)..." -ForegroundColor Cyan
    Push-Location "frontend"
    & npm.cmd install
    Pop-Location
}

Write-Host "Iniciando backend en otra ventana..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$raiz\backend'; .\mvnw.cmd spring-boot:run"
)

if (-not (Esperar-Url "http://localhost:8080/api/v1/productos" 90)) {
    Write-Host "El backend no respondio. Revisa su ventana." -ForegroundColor Red
    exit 1
}

Write-Host "Iniciando frontend en otra ventana..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$raiz\frontend'; npm.cmd run dev"
)

if (-not (Esperar-Url "http://localhost:5173" 60)) {
    Write-Host "El frontend no respondio. Revisa su ventana." -ForegroundColor Red
    exit 1
}

Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "Todo listo:" -ForegroundColor Green
Write-Host "  Tienda:  http://localhost:5173"
Write-Host "  API:     http://localhost:8080"
Write-Host "  Swagger: http://localhost:8080/swagger-ui.html"
Write-Host "  Adminer: http://localhost:8081"
Write-Host ""
Write-Host "Usuarios: admin@canelaymiel.cl / Admin1234  y  cliente@canelaymiel.cl / Cliente1234"
exit 0

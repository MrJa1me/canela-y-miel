# Detiene el backend, el frontend y MySQL. No borra los datos.
$ErrorActionPreference = "SilentlyContinue"
$raiz = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $raiz

foreach ($puerto in 8080, 5173) {
    $conexion = Get-NetTCPConnection -LocalPort $puerto -State Listen | Select-Object -First 1
    if ($conexion) {
        $proceso = Get-Process -Id $conexion.OwningProcess
        $linea = (Get-CimInstance Win32_Process -Filter "ProcessId=$($proceso.Id)").CommandLine
        if ($proceso.ProcessName -in @("java", "node") -and $linea -like "*$raiz*") {
            Stop-Process -Id $proceso.Id -Force
            Write-Host "Detenido $($proceso.ProcessName) en el puerto $puerto."
        }
    }
}

docker compose down
Write-Host "Listo. Los datos de MySQL se conservan en el volumen."

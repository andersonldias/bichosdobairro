# Script para iniciar o Sistema de Gerenciamento de Petshop
# Autor: Assistente IA
# Data: 2024

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    GERENCIAMENTO DE PETSHOP" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Definir diretório do projeto
$projectPath = "C:\Users\Ander\Desktop\Projeto Loja\Projeto novo"

# Verificar se o diretório existe
if (-not (Test-Path $projectPath)) {
    Write-Host "❌ Erro: Diretório do projeto não encontrado!" -ForegroundColor Red
    Write-Host "   Caminho: $projectPath" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Navegar para o diretório do projeto
Set-Location $projectPath

Write-Host "🚀 Iniciando aplicação..." -ForegroundColor Green
Write-Host ""

# Função para verificar se uma porta está em uso
function Test-Port {
    param($port)
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    return $connection -ne $null
}

# Função para aguardar até uma porta estar disponível
function Wait-ForPort {
    param($port, $timeout = 30)
    $startTime = Get-Date
    while ((Get-Date) -lt $startTime.AddSeconds($timeout)) {
        if (Test-Port $port) {
            return $true
        }
        Start-Sleep -Seconds 1
    }
    return $false
}

# Verificar se as portas já estão em uso
if (Test-Port 3001) {
    Write-Host "⚠️  Porta 3001 (Backend) já está em uso" -ForegroundColor Yellow
}

if (Test-Port 5173) {
    Write-Host "⚠️  Porta 5173 (Frontend) já está em uso" -ForegroundColor Yellow
}

Write-Host ""

# Iniciar Backend
Write-Host "[1/3] Iniciando Backend..." -ForegroundColor Blue
$backendJob = Start-Job -ScriptBlock {
    Set-Location "C:\Users\Ander\Desktop\Projeto Loja\Projeto novo\backend"
    npm start
}

# Aguardar backend inicializar
Write-Host "   Aguardando backend inicializar..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Iniciar Frontend
Write-Host "[2/3] Iniciando Frontend..." -ForegroundColor Blue
$frontendJob = Start-Job -ScriptBlock {
    Set-Location "C:\Users\Ander\Desktop\Projeto Loja\Projeto novo\frontend"
    npm run dev
}

# Aguardar frontend inicializar
Write-Host "[3/3] Aguardando servidores inicializarem..." -ForegroundColor Blue
Start-Sleep -Seconds 8

# Verificar se os servidores estão rodando
$backendRunning = Wait-ForPort 3001 10
$frontendRunning = Wait-ForPort 5173 10

if ($backendRunning) {
    Write-Host "✅ Backend rodando em http://localhost:3001" -ForegroundColor Green
} else {
    Write-Host "❌ Backend não está respondendo" -ForegroundColor Red
}

if ($frontendRunning) {
    Write-Host "✅ Frontend rodando em http://localhost:5173" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend não está respondendo" -ForegroundColor Red
}

Write-Host ""

# Abrir navegador
if ($frontendRunning) {
    Write-Host "🌐 Abrindo navegador..." -ForegroundColor Cyan
    Start-Process "http://localhost:5173"
} else {
    Write-Host "⚠️  Frontend não está rodando. Tentando abrir mesmo assim..." -ForegroundColor Yellow
    Start-Process "http://localhost:5173"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    APLICAÇÃO INICIADA COM SUCESSO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Backend:  http://localhost:3001" -ForegroundColor White
Write-Host "🎨 Frontend: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "💡 Dicas:" -ForegroundColor Yellow
Write-Host "   - Para parar os servidores, feche as janelas do terminal" -ForegroundColor Gray
Write-Host "   - Para ver logs, verifique as janelas do terminal abertas" -ForegroundColor Gray
Write-Host ""

# Manter o script rodando para mostrar status
Write-Host "Pressione Ctrl+C para sair..." -ForegroundColor Gray
try {
    while ($true) {
        Start-Sleep -Seconds 10
        
        # Verificar status dos jobs
        $backendStatus = Get-Job $backendJob.Id -ErrorAction SilentlyContinue
        $frontendStatus = Get-Job $frontendJob.Id -ErrorAction SilentlyContinue
        
        if ($backendStatus.State -eq "Failed") {
            Write-Host "❌ Backend parou de funcionar" -ForegroundColor Red
        }
        
        if ($frontendStatus.State -eq "Failed") {
            Write-Host "❌ Frontend parou de funcionar" -ForegroundColor Red
        }
    }
} catch {
    Write-Host ""
    Write-Host "🛑 Encerrando aplicação..." -ForegroundColor Yellow
    
    # Parar jobs
    Stop-Job $backendJob -ErrorAction SilentlyContinue
    Stop-Job $frontendJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob -ErrorAction SilentlyContinue
    Remove-Job $frontendJob -ErrorAction SilentlyContinue
    
    Write-Host "✅ Aplicação encerrada" -ForegroundColor Green
} 
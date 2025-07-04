@echo off
echo ========================================
echo    GERENCIAMENTO DE PETSHOP
echo ========================================
echo.
echo Iniciando aplicacao...
echo.

REM Navegar para o diretório do projeto
cd /d "C:\Users\Ander\Desktop\Projeto Loja\Projeto novo"

REM Iniciar o backend em uma nova janela
echo [1/3] Iniciando Backend...
start "Backend - Petshop" cmd /k "cd backend && npm start"

REM Aguardar 3 segundos para o backend inicializar
timeout /t 3 /nobreak >nul

REM Iniciar o frontend em uma nova janela
echo [2/3] Iniciando Frontend...
start "Frontend - Petshop" cmd /k "cd frontend && npm run dev"

REM Aguardar 8 segundos para ambos os servidores inicializarem
echo [3/3] Aguardando servidores inicializarem...
timeout /t 8 /nobreak >nul

REM Abrir o navegador
echo Abrindo navegador...
explorer http://localhost:5173

echo.
echo ========================================
echo    APLICACAO INICIADA COM SUCESSO!
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Pressione qualquer tecla para sair...
pause >nul 
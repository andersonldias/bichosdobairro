@echo off
echo ========================================
echo    INICIANDO APLICACAO PETSHOP
echo ========================================
echo.

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js nao encontrado!
    echo Instale o Node.js em: https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar se as dependências estão instaladas
if not exist "backend\node_modules" (
    echo [1/4] Instalando dependencias do Backend...
    cd backend
    npm install
    cd ..
)

if not exist "frontend\node_modules" (
    echo [2/4] Instalando dependencias do Frontend...
    cd frontend
    npm install
    cd ..
)

REM Iniciar o backend em background
echo [3/4] Iniciando Backend...
start /min "" cmd /c "cd backend && npm start"

REM Aguardar 3 segundos para o backend inicializar
echo [4/4] Aguardando servidores inicializarem...
timeout /t 3 /nobreak >nul

REM Iniciar o frontend em background
echo Iniciando Frontend...
start /min "" cmd /c "cd frontend && npm run dev"

REM Aguardar mais 5 segundos para o frontend inicializar
echo Aguardando frontend inicializar...
timeout /t 5 /nobreak >nul

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
echo As janelas dos servidores estao rodando em background.
echo Para parar os servidores, feche as janelas do CMD.
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause >nul

REM Fechar esta janela automaticamente
exit 
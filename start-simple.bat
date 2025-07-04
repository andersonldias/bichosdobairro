@echo off
echo Iniciando Sistema de Gerenciamento de Petshop...
echo.

cd /d "C:\Users\Ander\Desktop\Projeto Loja\Projeto novo"

echo Iniciando Backend...
start "" cmd /k "cd backend && npm start"

echo Aguardando backend inicializar...
timeout /t 5

echo Iniciando Frontend...
start "" cmd /k "cd frontend && npm run dev"

echo Aguardando frontend inicializar...
timeout /t 8

echo Abrindo navegador...
explorer http://localhost:5173

echo.
echo Aplicacao iniciada com sucesso!
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
pause 
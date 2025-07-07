#!/bin/bash

echo "🚀 Iniciando deploy do sistema petshop para bichosdobairro.com.br..."

# Configurações
BACKUP_DIR="./backups"
LOG_FILE="./deploy.log"

# Criar diretório de backup se não existir
mkdir -p $BACKUP_DIR

# Função para log
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# Backup do banco de dados
log "📦 Fazendo backup do banco de dados..."
mysqldump -u petshop_user -p bichosdobairro_petshop > $BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql
if [ $? -eq 0 ]; then
    log "✅ Backup do banco concluído"
else
    log "❌ Erro no backup do banco"
    exit 1
fi

# Atualizar backend
log "🔧 Atualizando backend..."
cd backend/
if [ -d ".git" ]; then
    git pull origin main
fi
npm install --production
if [ $? -eq 0 ]; then
    log "✅ Backend atualizado"
else
    log "❌ Erro na atualização do backend"
    exit 1
fi

# Reiniciar serviço PM2
log "🔄 Reiniciando serviço PM2..."
pm2 restart petshop-api
if [ $? -eq 0 ]; then
    log "✅ Serviço PM2 reiniciado"
else
    log "❌ Erro ao reiniciar PM2"
    exit 1
fi

# Atualizar frontend
log "🎨 Atualizando frontend..."
cd ../frontend/
if [ -d ".git" ]; then
    git pull origin main
fi
npm install
npm run build
if [ $? -eq 0 ]; then
    log "✅ Frontend buildado"
else
    log "❌ Erro no build do frontend"
    exit 1
fi

# Copiar arquivos para produção
log "📁 Copiando arquivos para produção..."
cp -r dist/* /var/www/bichosdobairro.com.br/public_html/
if [ $? -eq 0 ]; then
    log "✅ Arquivos copiados para produção"
else
    log "❌ Erro ao copiar arquivos"
    exit 1
fi

# Verificar status dos serviços
log "🔍 Verificando status dos serviços..."
pm2 status
pm2 logs petshop-api --lines 10

log "✅ Deploy concluído com sucesso!"
log "🌐 Acesse: https://www.bichosdobairro.com.br"
log "🔗 API: https://www.bichosdobairro.com.br/api"

echo ""
echo "🎉 Sistema petshop atualizado e online!"
echo "📊 Para monitorar: pm2 monit"
echo "📋 Para logs: pm2 logs petshop-api" 
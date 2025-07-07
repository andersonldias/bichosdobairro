# 🚀 Guia de Deploy - Sistema Petshop para bichosdobairro.com.br

## 📋 Pré-requisitos

- Servidor web com Node.js instalado
- MySQL configurado no servidor
- Acesso SSH ao servidor
- Domínio configurado (www.bichosdobairro.com.br)

## 🗄️ Configuração do Banco de Dados

### 1. Criar banco de dados no MySQL
```sql
CREATE DATABASE bichosdobairro_petshop;
CREATE USER 'petshop_user'@'localhost' IDENTIFIED BY 'sua_senha_segura';
GRANT ALL PRIVILEGES ON bichosdobairro_petshop.* TO 'petshop_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Executar script de criação das tabelas
```bash
# No servidor, na pasta do projeto
mysql -u petshop_user -p bichosdobairro_petshop < database.sql
```

## 🔧 Configuração do Backend

### 1. Upload dos arquivos
```bash
# Fazer upload da pasta backend/ para o servidor
# Exemplo: /var/www/bichosdobairro.com.br/petshop-backend/
```

### 2. Instalar dependências
```bash
cd /var/www/bichosdobairro.com.br/petshop-backend/
npm install --production
```

### 3. Configurar variáveis de ambiente
```bash
# Copiar env.production para .env
cp env.production .env

# Editar .env com suas credenciais reais
nano .env
```

### 4. Configurar PM2 (Process Manager)
```bash
# Instalar PM2 globalmente
npm install -g pm2

# Criar arquivo de configuração PM2
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'petshop-api',
    script: 'src/server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
}
EOF

# Iniciar aplicação
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🌐 Configuração do Frontend

### 1. Build para produção
```bash
# Localmente ou no servidor
cd frontend/
npm install
npm run build
```

### 2. Upload dos arquivos
```bash
# Fazer upload da pasta dist/ para o servidor
# Exemplo: /var/www/bichosdobairro.com.br/public_html/
```

## 🔗 Configuração do Apache/Nginx

### Opção 1: Subdomínio para API
```apache
# /etc/apache2/sites-available/api.bichosdobairro.com.br
<VirtualHost *:80>
    ServerName api.bichosdobairro.com.br
    
    ProxyPreserveHost On
    ProxyPass / http://localhost:3001/
    ProxyPassReverse / http://localhost:3001/
    
    ErrorLog ${APACHE_LOG_DIR}/api_error.log
    CustomLog ${APACHE_LOG_DIR}/api_access.log combined
</VirtualHost>
```

### Opção 2: Subpasta para API
```apache
# No arquivo principal do site
<VirtualHost *:80>
    ServerName www.bichosdobairro.com.br
    DocumentRoot /var/www/bichosdobairro.com.br/public_html
    
    # Proxy para API
    ProxyPass /api http://localhost:3001/api
    ProxyPassReverse /api http://localhost:3001/api
    
    # Configurações para SPA React
    <Directory /var/www/bichosdobairro.com.br/public_html>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

## 🔒 Configuração SSL (HTTPS)

### 1. Instalar Certbot
```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-apache
```

### 2. Gerar certificado SSL
```bash
sudo certbot --apache -d www.bichosdobairro.com.br -d bichosdobairro.com.br
```

## 📱 Configuração Final

### 1. Atualizar URLs no frontend
Editar `frontend/src/services/api.js` para usar a URL de produção:
```javascript
const getBaseURL = () => {
  return 'https://www.bichosdobairro.com.br/api';
};
```

### 2. Testar a aplicação
- Acessar: https://www.bichosdobairro.com.br
- Verificar se a API responde: https://www.bichosdobairro.com.br/api

## 🔄 Scripts de Deploy Automatizado

### deploy.sh
```bash
#!/bin/bash
echo "🚀 Iniciando deploy do sistema petshop..."

# Backup do banco
mysqldump -u petshop_user -p bichosdobairro_petshop > backup_$(date +%Y%m%d_%H%M%S).sql

# Atualizar backend
cd /var/www/bichosdobairro.com.br/petshop-backend/
git pull origin main
npm install --production
pm2 restart petshop-api

# Atualizar frontend
cd /var/www/bichosdobairro.com.br/frontend/
git pull origin main
npm install
npm run build
cp -r dist/* /var/www/bichosdobairro.com.br/public_html/

echo "✅ Deploy concluído!"
```

## 📞 Suporte

Em caso de problemas:
1. Verificar logs: `pm2 logs petshop-api`
2. Verificar status: `pm2 status`
3. Reiniciar serviço: `pm2 restart petshop-api`
4. Verificar banco: `mysql -u petshop_user -p bichosdobairro_petshop -e "SHOW TABLES;"`

## 🔐 Segurança

- ✅ Usar senhas fortes
- ✅ Configurar firewall
- ✅ Manter Node.js atualizado
- ✅ Fazer backups regulares
- ✅ Monitorar logs de acesso 
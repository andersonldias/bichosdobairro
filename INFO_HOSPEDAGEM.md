# 📋 Informações para Hospedagem - Sistema Petshop

## 🎯 Objetivo
Integrar um sistema de gerenciamento de petshop no domínio `www.bichosdobairro.com.br`

## 🏗️ Arquitetura do Sistema

### **Backend (API)**
- **Tecnologia**: Node.js + Express
- **Porta**: 3001 (interna)
- **Banco de dados**: MySQL (já existente no servidor)
- **Gerenciador de processo**: PM2

### **Frontend (Interface)**
- **Tecnologia**: React + Vite
- **Arquivos estáticos**: HTML, CSS, JavaScript
- **Roteamento**: React Router (SPA)

## 📁 Estrutura de Arquivos

```
/var/www/bichosdobairro.com.br/
├── public_html/                    # Frontend (site atual + petshop)
│   ├── index.html                  # Sistema petshop
│   ├── assets/                     # CSS, JS, imagens
│   └── [arquivos do site atual]
├── petshop-backend/               # Backend (nova pasta)
│   ├── src/
│   ├── package.json
│   ├── ecosystem.config.js
│   └── .env
└── backups/                       # Backups do banco
```

## 🗄️ Requisitos do Banco de Dados

### **Novo banco necessário:**
```sql
CREATE DATABASE bichosdobairro_petshop;
```

### **Tabelas que serão criadas:**
- `clients` (clientes)
- `pets` (pets)
- `service_types` (tipos de serviço)
- `appointments` (agendamentos)

### **Usuário MySQL:**
- Usuário existente ou novo usuário específico
- Permissões: SELECT, INSERT, UPDATE, DELETE, CREATE, DROP

## 🔧 Requisitos do Servidor

### **Software necessário:**
- ✅ Node.js (versão 14 ou superior)
- ✅ npm (Node Package Manager)
- ✅ PM2 (Process Manager)
- ✅ MySQL (já disponível)

### **Módulos Apache necessários:**
- `mod_proxy`
- `mod_proxy_http`
- `mod_rewrite`

## 🌐 Configuração de URLs

### **Opção 1: Subpasta (Recomendada)**
- **Sistema petshop**: `https://www.bichosdobairro.com.br/`
- **API**: `https://www.bichosdobairro.com.br/api/`

### **Opção 2: Subdomínio**
- **Sistema petshop**: `https://petshop.bichosdobairro.com.br/`
- **API**: `https://api.bichosdobairro.com.br/`

## 🔗 Configuração Apache

### **Para Opção 1 (Subpasta):**
```apache
<VirtualHost *:80>
    ServerName www.bichosdobairro.com.br
    DocumentRoot /var/www/bichosdobairro.com.br/public_html
    
    # Proxy para API Node.js
    ProxyPass /api http://localhost:3001/api
    ProxyPassReverse /api http://localhost:3001/api
    
    # Configuração para SPA React
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

## 📋 Checklist para Hospedagem

### **1. Preparação do servidor:**
- [ ] Instalar Node.js (se não estiver instalado)
- [ ] Instalar PM2 globalmente: `npm install -g pm2`
- [ ] Verificar módulos Apache necessários

### **2. Configuração do banco:**
- [ ] Criar banco `bichosdobairro_petshop`
- [ ] Configurar usuário MySQL com permissões
- [ ] Executar script de criação das tabelas

### **3. Upload dos arquivos:**
- [ ] Upload da pasta `backend/` para `/var/www/bichosdobairro.com.br/petshop-backend/`
- [ ] Upload dos arquivos do frontend para `public_html/`
- [ ] Configurar arquivo `.env` com credenciais do banco

### **4. Configuração do serviço:**
- [ ] Instalar dependências: `npm install --production`
- [ ] Iniciar com PM2: `pm2 start ecosystem.config.js`
- [ ] Configurar PM2 para iniciar com o servidor

### **5. Configuração Apache:**
- [ ] Adicionar configuração de proxy
- [ ] Configurar rewrite rules para SPA
- [ ] Reiniciar Apache

## 🔐 Segurança

### **Configurações recomendadas:**
- Usar HTTPS (SSL)
- Configurar firewall para porta 3001 (apenas localhost)
- Usar senhas fortes para MySQL
- Configurar backup automático do banco

## 📞 Contato para Suporte

### **Em caso de dúvidas técnicas:**
- Arquivos de configuração estão nos arquivos criados
- Script de deploy automatizado disponível
- Logs detalhados configurados

### **Comandos úteis para monitoramento:**
```bash
# Verificar status do serviço
pm2 status

# Ver logs
pm2 logs petshop-api

# Reiniciar serviço
pm2 restart petshop-api

# Monitorar recursos
pm2 monit
```

## 📊 Recursos Estimados

### **Uso de recursos:**
- **RAM**: ~100-200MB para Node.js
- **CPU**: Baixo uso (aplicação simples)
- **Disco**: ~50MB para arquivos + espaço para logs
- **Banco**: ~10-50MB inicial (cresce conforme uso)

### **Tráfego:**
- Aplicação web padrão
- API REST com cache
- Otimizada para baixo consumo de recursos 
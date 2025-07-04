# 🗄️ Configuração do Banco de Dados

Este guia explica como configurar o banco de dados MySQL para o sistema de gerenciamento de petshop.

## 📋 Pré-requisitos

- MySQL 8.0+ ou MariaDB 10.5+
- Node.js 18+
- Acesso ao servidor de banco de dados

## 🔧 Configurações Disponíveis

### 1. Banco Local (Desenvolvimento)

```bash
# Copie o arquivo de exemplo
cp env.example .env

# Edite o arquivo .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=petshop_db
DB_PORT=3306
DB_SSL=false
```

### 2. Banco Externo (Produção)

```bash
# Para banco externo (ex: PlanetScale, Railway, etc.)
DB_HOST=seu-host-externo.com
DB_USER=seu_usuario
DB_PASSWORD=sua_senha_forte
DB_NAME=petshop_db
DB_PORT=3306
DB_SSL=true
```

### 3. Banco na Nuvem (Exemplos)

#### PlanetScale
```bash
DB_HOST=aws.connect.psdb.cloud
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=petshop_db
DB_PORT=3306
DB_SSL=true
```

#### Railway
```bash
DB_HOST=containers-us-west-XX.railway.app
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=railway
DB_PORT=XXXXX
DB_SSL=true
```

#### AWS RDS
```bash
DB_HOST=seu-cluster.cluster-xxxxx.region.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=sua_senha
DB_NAME=petshop_db
DB_PORT=3306
DB_SSL=true
```

## 🚀 Configuração Automática

### 1. Configurar variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp env.example .env

# Edite com suas configurações
nano .env
```

### 2. Executar configuração automática
```bash
# Instalar dependências
npm install

# Configurar banco de dados
npm run db:setup

# Iniciar servidor
npm run dev
```

## 🔍 Verificação da Conexão

O sistema irá automaticamente:

1. ✅ Testar a conexão com o banco
2. ✅ Criar o banco de dados se não existir
3. ✅ Criar as tabelas necessárias
4. ✅ Inserir dados iniciais
5. ✅ Verificar a integridade

## 📊 Estrutura do Banco

### Tabelas Criadas:
- `users` - Usuários do sistema
- `clients` - Clientes cadastrados
- `pets` - Pets dos clientes
- `service_types` - Tipos de serviços
- `appointments` - Agendamentos
- `service_history` - Histórico de serviços
- `cash_register` - Controle de caixa

### Dados Iniciais:
- Tipos de serviços (Banho, Tosa, Vacinação, etc.)
- Usuário administrador padrão

## 🛠️ Comandos Úteis

```bash
# Configurar banco de dados
npm run db:setup

# Resetar banco de dados
npm run db:reset

# Verificar status da API
curl http://localhost:3001/health

# Testar conexão com banco
curl http://localhost:3001/api/clients/stats
```

## 🔒 Segurança

### Para Produção:
1. ✅ Use senhas fortes
2. ✅ Habilite SSL (DB_SSL=true)
3. ✅ Configure firewall
4. ✅ Use usuário específico (não root)
5. ✅ Configure backup automático

### Variáveis Sensíveis:
```bash
# Nunca commite o arquivo .env
echo ".env" >> .gitignore

# Use variáveis de ambiente do servidor
export DB_PASSWORD="sua_senha_super_secreta"
```

## 🐛 Solução de Problemas

### Erro: "Access denied"
```bash
# Verifique as credenciais
mysql -u seu_usuario -p -h seu_host

# Teste a conexão
mysql -u root -p -e "SELECT 1;"
```

### Erro: "Connection timeout"
```bash
# Verifique se o host está correto
ping seu-host-externo.com

# Verifique a porta
telnet seu-host-externo.com 3306
```

### Erro: "SSL connection"
```bash
# Para bancos que não suportam SSL
DB_SSL=false

# Para bancos que exigem SSL
DB_SSL=true
```

## 📞 Suporte

Se encontrar problemas:

1. ✅ Verifique as configurações no `.env`
2. ✅ Teste a conexão manualmente
3. ✅ Verifique os logs do servidor
4. ✅ Consulte a documentação do seu provedor

---

**💡 Dica:** Para desenvolvimento local, você pode usar Docker:

```bash
# Instalar MySQL com Docker
docker run --name mysql-petshop -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=petshop_db -p 3306:3306 -d mysql:8.0

# Configurar .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=petshop_db
``` 
# 🔒 Sistema de Segurança - Petshop

## 🎯 Visão Geral

O sistema de segurança implementado oferece autenticação robusta, autorização baseada em roles e proteção contra ataques comuns.

## 🏗️ Arquitetura de Segurança

### **Backend (Node.js + Express)**
- ✅ **JWT (JSON Web Tokens)** - Autenticação stateless
- ✅ **bcryptjs** - Criptografia de senhas
- ✅ **Helmet** - Headers de segurança
- ✅ **Rate Limiting** - Proteção contra brute force
- ✅ **CORS** - Controle de origens
- ✅ **Validação de entrada** - Sanitização de dados

### **Frontend (React)**
- ✅ **Context API** - Gerenciamento de estado de autenticação
- ✅ **Protected Routes** - Rotas protegidas
- ✅ **Role-based Access** - Controle de acesso por função
- ✅ **Token Storage** - Armazenamento seguro de tokens

## 👥 Sistema de Usuários

### **Tipos de Usuário (Roles)**

#### **🥇 Administrador (admin)**
- **Acesso total** ao sistema
- **Gerenciar usuários** (criar, editar, ativar/desativar)
- **Configurações** do sistema
- **Relatórios** completos
- **Permissões** especiais

#### **🥈 Veterinário (veterinario)**
- **Gerenciar pets** e agendamentos
- **Serviços veterinários**
- **Relatórios** médicos
- **Histórico** de tratamentos

#### **🥉 Atendente (atendente)**
- **Cadastrar clientes** e pets
- **Agendamentos** básicos
- **Atendimento** ao cliente
- **Caixa** e pagamentos

### **Hierarquia de Permissões**
```
Admin > Veterinário > Atendente
```

## 🔐 Autenticação

### **Processo de Login**
1. **Validação** de email e senha
2. **Verificação** de usuário ativo
3. **Geração** de token JWT
4. **Armazenamento** seguro no frontend
5. **Redirecionamento** para dashboard

### **Segurança de Senhas**
- ✅ **Criptografia bcrypt** (12 rounds)
- ✅ **Validação** de força da senha
- ✅ **Proteção** contra rainbow tables
- ✅ **Salt único** por usuário

### **Tokens JWT**
- ✅ **Expiração** configurável (24h padrão)
- ✅ **Assinatura** segura
- ✅ **Payload** mínimo
- ✅ **Renovação** automática

## 🛡️ Proteções Implementadas

### **Rate Limiting**
```javascript
// Máximo 5 tentativas de login em 15 minutos
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
});
```

### **Headers de Segurança (Helmet)**
- ✅ **Content Security Policy** (CSP)
- ✅ **X-Frame-Options** - Proteção contra clickjacking
- ✅ **X-Content-Type-Options** - Prevenção MIME sniffing
- ✅ **X-XSS-Protection** - Proteção XSS
- ✅ **Strict-Transport-Security** - Forçar HTTPS

### **Validação de Entrada**
- ✅ **Sanitização** de dados
- ✅ **Validação** de tipos
- ✅ **Prevenção** de SQL Injection
- ✅ **Escape** de caracteres especiais

## 🔍 Middlewares de Segurança

### **Autenticação**
```javascript
// Verificar token JWT
const authenticateToken = async (req, res, next) => {
  // Verificação do token
  // Validação do usuário
  // Adição à requisição
};
```

### **Autorização**
```javascript
// Verificar permissões específicas
const requireRole = (roles) => {
  return (req, res, next) => {
    // Verificação de role
    // Acesso negado se não autorizado
  };
};
```

### **Logging de Atividades**
```javascript
// Registrar todas as ações
const logActivity = (action) => {
  return (req, res, next) => {
    // Log com timestamp, usuário, IP, ação
  };
};
```

## 📱 Frontend Seguro

### **Context de Autenticação**
```javascript
const AuthContext = createContext();

// Gerenciamento de estado
const [user, setUser] = useState(null);
const [isAuthenticated, setIsAuthenticated] = useState(false);
```

### **Rotas Protegidas**
```javascript
const ProtectedRoute = ({ children, requiredRole = null }) => {
  // Verificação de autenticação
  // Verificação de permissões
  // Redirecionamento se necessário
};
```

### **Armazenamento Seguro**
- ✅ **localStorage** para tokens
- ✅ **Limpeza** automática em logout
- ✅ **Verificação** de validade
- ✅ **Renovação** automática

## 🚀 Como Usar

### **1. Configuração Inicial**
```bash
# Instalar dependências
npm install

# Configurar banco de dados
npm run db:setup

# Criar usuário administrador
npm run create-admin
```

### **2. Credenciais Padrão**
```
Email: admin@petshop.com
Senha: admin123
```

### **3. Primeiro Login**
1. Acesse o sistema
2. Use as credenciais padrão
3. **IMPORTANTE**: Altere a senha imediatamente
4. Configure outros usuários

## 🔧 Configuração de Produção

### **Variáveis de Ambiente**
```bash
# Segurança
JWT_SECRET=sua_chave_super_secreta_aqui
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=https://seu-dominio.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### **Recomendações de Segurança**
1. ✅ **Use HTTPS** em produção
2. ✅ **Configure firewall** adequadamente
3. ✅ **Monitore logs** de acesso
4. ✅ **Faça backups** regulares
5. ✅ **Mantenha dependências** atualizadas
6. ✅ **Use senhas fortes** para todos os usuários

## 📊 Monitoramento

### **Logs de Segurança**
- ✅ **Tentativas de login** (sucesso/falha)
- ✅ **Ações de usuários** (CRUD)
- ✅ **Acessos negados** (403/401)
- ✅ **Erros de sistema** (500)

### **Métricas Importantes**
- **Taxa de sucesso** de login
- **Tentativas falhadas** por IP
- **Acessos** por usuário
- **Recursos** mais acessados

## 🆘 Solução de Problemas

### **Erro: "Token expirado"**
```javascript
// Renovar token automaticamente
const refreshToken = async () => {
  // Lógica de renovação
};
```

### **Erro: "Acesso negado"**
```javascript
// Verificar permissões
const hasPermission = (resource, action) => {
  // Verificação de permissão
};
```

### **Erro: "Usuário inativo"**
```javascript
// Verificar status do usuário
const checkUserStatus = async (userId) => {
  // Verificação de status
};
```

## 🔄 Atualizações de Segurança

### **Checklist de Atualização**
- [ ] **Atualizar dependências** de segurança
- [ ] **Revisar logs** de acesso
- [ ] **Testar** funcionalidades críticas
- [ ] **Backup** antes da atualização
- [ ] **Monitorar** após atualização

### **Boas Práticas**
1. **Princípio do menor privilégio**
2. **Defesa em profundidade**
3. **Fail securely**
4. **Logging completo**
5. **Monitoramento contínuo**

## 📞 Suporte

### **Em caso de problemas:**
1. ✅ Verifique os logs do servidor
2. ✅ Confirme as configurações de banco
3. ✅ Teste a conectividade
4. ✅ Verifique as permissões de arquivo
5. ✅ Consulte a documentação

### **Contatos:**
- **Logs**: `pm2 logs petshop-api`
- **Status**: `pm2 status`
- **Banco**: `mysql -u root -p`

---

**🔒 Sistema de segurança implementado e ativo!** 
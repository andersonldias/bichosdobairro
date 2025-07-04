# 🐾 Sistema de Gerenciamento de PetShop

Sistema completo para gerenciamento de petshops com frontend em React + Tailwind CSS e backend em Node.js + Express + MySQL.

[![GitHub stars](https://img.shields.io/github/stars/andersonldias/bichosdobairro?style=social)](https://github.com/andersonldias/bichosdobairro)
[![GitHub forks](https://img.shields.io/github/forks/andersonldias/bichosdobairro?style=social)](https://github.com/andersonldias/bichosdobairro)
[![GitHub issues](https://img.shields.io/github/issues/andersonldias/bichosdobairro)](https://github.com/andersonldias/bichosdobairro/issues)
[![GitHub license](https://img.shields.io/github/license/andersonldias/bichosdobairro)](https://github.com/andersonldias/bichosdobairro/blob/main/LICENSE)

## 📋 Funcionalidades

### ✅ Implementadas
- **Dashboard** com estatísticas e agenda do dia
- **Layout responsivo** com sidebar e header
- **Navegação** entre páginas
- **Backend API** com estrutura básica
- **Banco de dados** MySQL configurado
- **Design system** com Tailwind CSS

### 🚧 Em Desenvolvimento
- Cadastro de clientes e pets
- Agendamentos de serviços
- Controle de caixa
- Estatísticas detalhadas
- Sistema de permissões
- Autenticação de usuários

## 🛠️ Tecnologias

### Frontend
- **React 18** - Biblioteca JavaScript
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **Lucide React** - Ícones
- **React Router** - Navegação
- **React Hook Form** - Formulários
- **Axios** - Requisições HTTP

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MySQL2** - Driver MySQL
- **CORS** - Cross-origin requests
- **Jest** - Testes unitários

## 📁 Estrutura do Projeto

```
Projeto novo/
├── frontend/                 # Aplicação React
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── services/        # Serviços de API
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Utilitários
│   │   └── contexts/        # Contextos React
│   ├── tailwind.config.js   # Configuração Tailwind
│   └── package.json
├── backend/                  # API Node.js
│   ├── src/
│   │   ├── controllers/     # Controladores
│   │   ├── models/          # Modelos de dados
│   │   ├── routes/          # Rotas da API
│   │   ├── middlewares/     # Middlewares
│   │   ├── services/        # Serviços
│   │   ├── utils/           # Utilitários
│   │   └── config/          # Configurações
│   ├── database.sql         # Script do banco
│   └── package.json
└── README.md
```

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+ 
- MySQL 8.0+
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/andersonldias/bichosdobairro.git
cd bichosdobairro
```

### 2. Configure o banco de dados
```bash
# Acesse o MySQL
mysql -u root -p

# Execute o script de criação
source backend/database.sql
```

### 3. Configure as variáveis de ambiente
```bash
# No backend, copie o arquivo de exemplo
cp backend/env.example backend/.env

# Edite o arquivo .env com suas configurações
```

### 4. Instale as dependências
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

## 🏃‍♂️ Executando o Projeto

### Desenvolvimento

**Backend:**
```bash
cd backend
npm run dev
```
Servidor rodará em: http://localhost:3001

**Frontend:**
```bash
cd frontend
npm run dev
```
Aplicação rodará em: http://localhost:5173

### Produção

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📚 API Endpoints

### Clientes
- `GET /api/clients` - Listar todos os clientes
- `GET /api/clients/:id` - Buscar cliente por ID
- `POST /api/clients` - Criar novo cliente
- `PUT /api/clients/:id` - Atualizar cliente
- `DELETE /api/clients/:id` - Deletar cliente
- `GET /api/clients/search?q=termo` - Buscar clientes
- `GET /api/clients/stats` - Estatísticas dos clientes

### Health Check
- `GET /health` - Status da API

## 🎨 Design System

### Cores
- **Primary**: Tons de azul (#3b82f6)
- **Secondary**: Tons de cinza (#64748b)
- **Success**: Verde (#10b981)
- **Warning**: Amarelo (#f59e0b)
- **Error**: Vermelho (#ef4444)

### Componentes
- `.btn-primary` - Botão primário
- `.btn-secondary` - Botão secundário
- `.btn-danger` - Botão de perigo
- `.input-field` - Campo de entrada
- `.card` - Card de conteúdo
- `.sidebar-item` - Item do menu lateral

## 🔧 Scripts Disponíveis

### Frontend
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run lint` - Linter (quando configurado)

### Backend
- `npm run dev` - Servidor com nodemon
- `npm start` - Servidor de produção
- `npm test` - Executar testes
- `npm run test:watch` - Testes em modo watch

## 📝 Próximos Passos

1. **Implementar autenticação** com JWT
2. **Criar formulários** de cadastro de clientes
3. **Desenvolver sistema** de agendamentos
4. **Implementar controle** de caixa
5. **Adicionar gráficos** e estatísticas
6. **Configurar testes** automatizados
7. **Implementar upload** de imagens
8. **Adicionar notificações** em tempo real

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato:
- Email: suporte@petshop.com
- Documentação: [Link para documentação]

---

**Desenvolvido com ❤️ para petshops** 
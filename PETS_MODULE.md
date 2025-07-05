# 🐾 Módulo de Pets - Documentação

## Visão Geral

O módulo de Pets é um sistema completo para gerenciamento de pets dos clientes do petshop, com integração total ao módulo de clientes.

## 🏗️ Arquitetura

### Backend
- **Model**: `backend/src/models/Pet.js`
- **Controller**: `backend/src/controllers/petController.js`
- **Rotas**: `backend/src/routes/pets.js`
- **Banco**: Tabela `pets` com relacionamento com `clients`

### Frontend
- **Serviço**: `frontend/src/services/petService.js`
- **Hook**: `frontend/src/hooks/usePets.js`
- **Formulário**: `frontend/src/components/PetForm.jsx`
- **Página**: `frontend/src/pages/Pets.jsx`
- **Lista**: `frontend/src/components/PetList.jsx`

## 📊 Estrutura do Banco

```sql
CREATE TABLE pets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  species VARCHAR(50) NOT NULL,
  breed VARCHAR(100),
  age INT,
  weight DECIMAL(5,2),
  observations TEXT,
  client_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);
```

## 🔧 Funcionalidades

### Backend

#### Operações CRUD
- ✅ **CREATE**: Criar novo pet
- ✅ **READ**: Listar, buscar por ID, por cliente, por espécie
- ✅ **UPDATE**: Atualizar dados do pet
- ✅ **DELETE**: Remover pet

#### Funcionalidades Avançadas
- ✅ **Busca**: Por nome, raça, espécie ou cliente
- ✅ **Estatísticas**: Contadores e métricas
- ✅ **Validações**: Dados obrigatórios e tipos
- ✅ **Verificação de Duplicatas**: Nome único por cliente
- ✅ **Relacionamentos**: Integração com clientes

#### Endpoints da API

```
GET    /api/pets                    # Listar todos os pets
GET    /api/pets/:id               # Buscar pet por ID
GET    /api/pets/stats             # Estatísticas dos pets
GET    /api/pets/species           # Listar espécies disponíveis
GET    /api/pets/search?q=termo    # Buscar pets
GET    /api/pets/client/:clientId  # Pets por cliente
GET    /api/pets/species/:species  # Pets por espécie
GET    /api/pets/check-duplicate   # Verificar duplicata
POST   /api/pets                   # Criar novo pet
PUT    /api/pets/:id               # Atualizar pet
DELETE /api/pets/:id               # Deletar pet
```

### Frontend

#### Página Principal (`/pets`)
- ✅ **Listagem**: Tabela com todos os pets
- ✅ **Busca**: Por nome, raça ou cliente
- ✅ **Filtros**: Por espécie
- ✅ **Estatísticas**: Cards com métricas
- ✅ **Operações**: Criar, editar, deletar, visualizar

#### Formulário
- ✅ **Validações**: Campos obrigatórios e tipos
- ✅ **Integração**: Seleção de cliente
- ✅ **Verificação**: Duplicatas em tempo real
- ✅ **Responsivo**: Design mobile-friendly

#### Componente PetList
- ✅ **Reutilizável**: Para outras páginas
- ✅ **Integração**: Com página de clientes
- ✅ **Compacto**: Cards em grid

## 🚀 Como Usar

### 1. Configuração do Banco

```bash
cd backend
npm run db:tables
```

### 2. Testar o Backend

```bash
cd backend
npm run test:pets
```

### 3. Iniciar o Sistema

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 4. Acessar a Aplicação

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Pets**: http://localhost:5173/pets

## 📋 Campos do Pet

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `name` | String | ✅ | Nome do pet |
| `species` | String | ✅ | Espécie (Cachorro, Gato, etc.) |
| `breed` | String | ❌ | Raça do pet |
| `age` | Number | ❌ | Idade em anos |
| `weight` | Number | ❌ | Peso em kg |
| `observations` | Text | ❌ | Observações adicionais |
| `client_id` | Number | ✅ | ID do cliente proprietário |

## 🔍 Validações

### Backend
- Nome obrigatório (mínimo 2 caracteres)
- Espécie obrigatória
- Cliente obrigatório e deve existir
- Idade: 0-30 anos
- Peso: 0.1-200 kg
- Nome único por cliente

### Frontend
- Validação em tempo real
- Verificação de duplicatas
- Feedback visual de erros
- Campos obrigatórios destacados

## 📊 Estatísticas Disponíveis

```javascript
{
  total_pets: 150,
  total_clients_with_pets: 120,
  new_today: 3,
  dogs_count: 85,
  cats_count: 45,
  other_species_count: 20
}
```

## 🎨 Interface

### Cores e Ícones
- **Cachorros**: Azul (#3B82F6) + ícone Dog
- **Gatos**: Laranja (#F97316) + ícone Cat
- **Outros**: Cinza (#6B7280) + ícone Dog

### Layout
- **Desktop**: Tabela responsiva
- **Mobile**: Cards em grid
- **Modais**: Formulários e confirmações

## 🔗 Integrações

### Com Módulo de Clientes
- Relacionamento 1:N (Cliente → Pets)
- Seleção de cliente no formulário
- Lista de pets na página do cliente
- Exclusão em cascata

### Com Outros Módulos (Futuro)
- **Agendamentos**: Seleção de pet
- **Serviços**: Histórico por pet
- **Caixa**: Faturamento por pet

## 🧪 Testes

### Backend
```bash
npm run test:pets
```

### Frontend
- Testes manuais de interface
- Validação de formulários
- Teste de responsividade

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com banco**
   - Verificar se MySQL está rodando
   - Verificar credenciais no .env
   - Executar `npm run db:test`

2. **Pet não aparece na lista**
   - Verificar se cliente existe
   - Verificar relacionamento client_id
   - Recarregar página

3. **Erro de validação**
   - Verificar campos obrigatórios
   - Verificar tipos de dados
   - Verificar duplicatas

### Logs
- Backend: Console com timestamps
- Frontend: Console do navegador
- API: Logs de requisições

## 📈 Melhorias Futuras

- [ ] **Fotos**: Upload de imagens dos pets
- [ ] **Histórico Médico**: Registros de saúde
- [ ] **Vacinas**: Controle de vacinação
- [ ] **Agendamentos**: Integração direta
- [ ] **Relatórios**: Exportação de dados
- [ ] **Notificações**: Lembretes de serviços

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar logs do console
2. Testar endpoints da API
3. Verificar configurações do banco
4. Consultar esta documentação

---

**Versão**: 1.0.0  
**Última atualização**: Dezembro 2024  
**Autor**: Sistema PetShop 
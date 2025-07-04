# 🚀 Como Iniciar o Sistema de Gerenciamento de Petshop

## Scripts Disponíveis

### 1. Script Simples (Recomendado)
```bash
start-simple.bat
```
- **Mais rápido e direto**
- Inicia backend e frontend em janelas separadas
- Abre navegador automaticamente após 8 segundos

### 2. Script Completo
```bash
start-app.bat
```
- **Com interface mais detalhada**
- Mostra progresso passo a passo
- Aguarda confirmação antes de sair

### 3. Script PowerShell (Avançado)
```bash
start-app.ps1
```
- **Mais robusto e inteligente**
- Verifica se portas estão disponíveis
- Monitora status dos servidores
- Cores e interface melhorada

## Como Usar

### Opção 1: Duplo Clique
1. Navegue até a pasta do projeto
2. Dê duplo clique em `start-simple.bat`
3. Aguarde os servidores iniciarem
4. O navegador abrirá automaticamente

### Opção 2: Linha de Comando
```bash
# No PowerShell
.\start-app.ps1

# No CMD
start-simple.bat
```

## O que acontece quando você executa:

1. **Backend inicia** na porta 3001
2. **Frontend inicia** na porta 5173  
3. **Navegador abre** automaticamente em http://localhost:5173
4. **Sistema fica pronto** para uso

## URLs dos Serviços

- **Frontend (Interface)**: http://localhost:5173
- **Backend (API)**: http://localhost:3001
- **API de Clientes**: http://localhost:3001/api/clients

## Para Parar os Servidores

- **Feche as janelas do terminal** que foram abertas
- Ou pressione `Ctrl+C` em cada janela

## Solução de Problemas

### Se o navegador não abrir:
- Verifique se as portas 3001 e 5173 estão livres
- Aguarde mais tempo (às vezes demora para inicializar)
- Abra manualmente: http://localhost:5173

### Se der erro de porta em uso:
- Feche outros terminais que possam estar rodando
- Reinicie o computador se necessário
- Use `netstat -an | findstr :3001` para verificar

### Se o backend não conectar:
- Verifique se o banco de dados está acessível
- Confirme as configurações no arquivo `.env`

## Estrutura do Projeto

```
Projeto novo/
├── backend/          # API Node.js + Express
├── frontend/         # React + Vite + Tailwind
├── start-simple.bat  # Script de inicialização
├── start-app.bat     # Script completo
├── start-app.ps1     # Script PowerShell
└── COMO-USAR.md      # Este arquivo
```

## Funcionalidades Disponíveis

✅ **Dashboard** - Visão geral do sistema
✅ **Clientes** - Cadastro, edição, busca e exclusão
✅ **Pets** - Gerenciamento de pets (em desenvolvimento)
✅ **Serviços** - Tipos de serviços (em desenvolvimento)
✅ **Agenda** - Agendamentos (em desenvolvimento)
✅ **Caixa** - Controle financeiro (em desenvolvimento)
✅ **Estatísticas** - Relatórios (em desenvolvimento)
✅ **Permissões** - Controle de acesso (em desenvolvimento)

---

**Desenvolvido com ❤️ para facilitar o gerenciamento do seu petshop!** 
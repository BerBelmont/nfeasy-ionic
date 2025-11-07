# NFEasy - Ionic React (Pure)

Sistema de gestão empresarial construído com **Ionic React**, **Vite**, **TypeScript** e **Capacitor** para builds mobile.

## 🏗️ Arquitetura

Este projeto foi **convertido de Next.js + Ionic para Ionic React puro**, utilizando:

- **Vite** como bundler (substituindo Next.js)
- **React Router DOM** para roteamento
- **Ionic React** para componentes UI
- **Express** como servidor backend standalone
- **Capacitor** para builds Android/iOS

## 📁 Estrutura do Projeto

```
nfeasy/
├── src/
│   ├── main.tsx              # Entry point React
│   ├── App.tsx               # Configuração de rotas
│   ├── pages/
│   │   ├── Login.tsx         # Tela de login
│   │   ├── Home.tsx          # Dashboard com métricas
│   │   └── CadastroProdutos.tsx # Cadastro de produtos
│   ├── components/
│   │   ├── Sidebar.tsx       # Menu lateral
│   │   └── PrivateRoute.tsx  # Proteção de rotas
│   ├── contexts/
│   │   └── AuthContext.tsx   # Contexto de autenticação
│   └── theme/
│       ├── variables.css     # Variáveis Ionic
│       └── global.css        # Estilos globais
├── server/
│   ├── server.js             # API Express
│   └── package.json          # Deps do servidor
├── index.html                # HTML root
├── vite.config.ts            # Configuração Vite
└── package.json              # Deps do frontend

```

## 🚀 Como Rodar o Projeto

### 1. Instalar Dependências

**Frontend:**
```powershell
npm install
```

**Backend:**
```powershell
cd server
npm install
cd ..
```

### 2. Iniciar o Servidor Backend

Em um terminal:
```powershell
npm run server:dev
```

Ou, se preferir sem hot-reload:
```powershell
npm run server
```

O servidor vai rodar em: `http://localhost:3001`

### 3. Iniciar o Frontend

Em outro terminal:
```powershell
npm run dev
```

O app vai abrir em: `http://localhost:3000`

## 🔑 Credenciais de Teste

| Usuário | Email | Senha | Permissões |
|---------|-------|-------|------------|
| Admin | admin@nfeasy.com | admin123 | Todas |
| Gerente | gerente@nfeasy.com | gerente123 | Dashboard + Produtos |
| Operador | operador@nfeasy.com | operador123 | Somente leitura |

## 📱 Telas Implementadas

### 1. **Login** (`/login`)
- Formulário de autenticação
- Validação de credenciais
- Redirecionamento automático
- **API:** `POST /api/login`

### 2. **Dashboard** (`/home`)
- Gráfico de vendas por hora (Chart.js)
- Métricas: Faturamento, Total Vendas, Ticket Médio
- Lista de produtos com estoque baixo
- **API:** `GET /api/home`

### 3. **Cadastro de Produtos** (`/cadastro-produtos`)
- Formulário completo de produto
- Validações (NCM, campos obrigatórios)
- Toggle ativo/inativo
- **API:** `POST /api/cadastro_produtos`

## 🔌 Endpoints da API

**Base URL:** `http://localhost:3001`

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/login` | Autenticação | Não |
| GET | `/api/home` | Dados do dashboard | Sim |
| POST | `/api/cadastro_produtos` | Criar produto | Sim |
| GET | `/api/produtos` | Listar produtos | Sim |

### Exemplo de Requisição:

```javascript
// Login
const response = await fetch('http://localhost:3001/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// Dashboard (com token)
const response = await fetch('http://localhost:3001/api/home', {
  headers: { 
    'Authorization': `Bearer ${token}` 
  }
});
```

## 📦 Build para Produção

### Build Web
```powershell
npm run build
npm run preview
```

### Build Android

1. **Gerar build do frontend:**
```powershell
npm run build
```

2. **Sincronizar com Capacitor:**
```powershell
npx cap sync android
```

3. **Abrir no Android Studio:**
```powershell
npx cap open android
```

4. **Build APK/AAB no Android Studio:**
- Build > Generate Signed Bundle / APK
- Escolha APK ou AAB
- Configure assinatura
- Build

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Ionic React** 8.7.9 - Componentes UI
- **React** 18.3.1 - Biblioteca base
- **React Router DOM** 6.22.3 - Roteamento
- **Vite** 5.1.6 - Bundler
- **TypeScript** 5.4.5 - Tipagem
- **Chart.js** 4.5.0 - Gráficos
- **Ionicons** 8.0.13 - Ícones

### Backend
- **Express** 4.18.2 - Servidor HTTP
- **CORS** 2.8.5 - Controle de acesso

### Mobile
- **Capacitor** 7.4.4 - Build nativo
- **Capacitor Android** 7.4.4 - Plataforma Android

## 📝 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia frontend em modo dev |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm run server` | Inicia servidor backend |
| `npm run server:dev` | Servidor com hot-reload |

## 🔄 Diferenças vs Versão Next.js

| Aspecto | Next.js + Ionic | Ionic Puro (Atual) |
|---------|----------------|-------------------|
| Bundler | Next.js | Vite |
| Roteamento | Next.js App Router | React Router DOM |
| Server | Next.js API Routes | Express standalone |
| SSR | Sim | Não (SPA) |
| Build | `next build` | `vite build` |
| Dev Server | `next dev` | `vite` |

## ⚠️ Observações Importantes

1. **Backend separado:** O servidor Express **deve** estar rodando antes do frontend
2. **CORS configurado:** Backend aceita requisições de `localhost:3000`
3. **Tokens mock:** Sistema de autenticação é mockado (use JWT em produção)
4. **Hot Reload:** Frontend tem HMR do Vite, backend usa nodemon

## 🐛 Troubleshooting

### Erro de conexão com API
- Verifique se o backend está rodando em `http://localhost:3001`
- Confirme que não há firewall bloqueando a porta

### Erro ao buildar
```powershell
# Limpe node_modules e reinstale
rm -r node_modules
npm install
```

### TypeScript errors
```powershell
# Atualize as definições de tipos
npm install --save-dev @types/react @types/react-dom @types/react-router-dom
```

## 📄 Licença

MIT

---

**Desenvolvido com Ionic Framework** ⚡

# 🧾 NFEasy - Sistema de Gestão e PDV com Ionic Framework

Sistema completo de gestão comercial e ponto de venda (PDV) desenvolvido com **Next.js 14**, **Ionic React**, **TypeScript** e **React**. Refatorado com **Ionic Framework** para uma interface moderna, responsiva e mobile-friendly.

![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18.3.1-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4.5-blue?style=flat-square&logo=typescript)
![Ionic](https://img.shields.io/badge/Ionic-8.x-blue?style=flat-square&logo=ionic)

---

## 🎯 Sobre a Refatoração

Este projeto foi **completamente refatorado** para utilizar o **Ionic Framework**, proporcionando:

✅ **Interface Moderna** - Componentes nativos do Ionic  
✅ **Totalmente Responsivo** - Desktop, tablet e mobile  
✅ **Menu Lateral** - IonMenu com navegação intuitiva  
✅ **3 Telas Completas** - Todas integradas com backend mockado  
✅ **Backend Mockado** - Sem necessidade de banco de dados  

---

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Como Usar](#-como-usar)
- [Telas Implementadas](#-telas-implementadas)
- [Documentação](#-documentação)
- [API Routes](#-api-routes)
- [Desenvolvimento](#-desenvolvimento)

---

## ✨ Funcionalidades

### 🔐 Sistema de Autenticação
- Login com diferentes níveis de acesso (Admin e Caixa)
- Proteção de rotas baseada em roles
- Sessão persistente com localStorage
- Logout automático em caso de token inválido
- **Componentes:** IonPage, IonCard, IonInput, IonButton

### 📊 Dashboard Administrativo
- Gráficos interativos de vendas por hora (Chart.js)
- Cards de resumo diário (faturamento, vendas, ticket médio)
- Monitoramento de produtos com baixo estoque
- Interface com **IonCard**, **IonGrid**, **IonList**
- Menu lateral acessível (**IonMenu**)

### 📦 Gestão de Produtos
- Cadastro completo de produtos com validação
- Código de barras, NCM, CST (IPI, Cofins, PIS)
- Controle de estoque
- Formulário com **IonInput**, **IonSelect**, **IonToggle**
- Validações em tempo real
- Interface intuitiva e responsiva

- Busca em tempo real
- **Relatórios financeiros em PDF** com totalizadores
- **Confirmação de vendas** com geração automática de NF
- **Sistema de devoluções** parciais ou totais
- Rastreamento completo de vendas e devoluções

### 📄 Relatórios em PDF
- Geração automática de relatórios financeiros
- Filtros por período e forma de pagamento
- Tabelas detalhadas com vendas e devoluções
- Totalizadores por forma de pagamento
- Download automático do arquivo

### 🔄 Gestão de Devoluções
- Modal intuitivo para seleção de itens
- Devolução parcial ou total de produtos
- Validação de quantidades
- Registro de motivo da devolução
- Vínculo com venda original
- Valores negativos para controle contábil

### 🛒 PDV (Ponto de Venda)
- Interface intuitiva de venda
- Busca de produtos por código de barras
- Autocompletar de produtos por nome
- Carrinho de compras dinâmico
- Múltiplas formas de pagamento
- Emissão de NFC-e (Nota Fiscal do Consumidor Eletrônica)

---

## 🚀 Tecnologias

### Frontend
- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Ionic React** - Framework de componentes UI
- **Ionicons** - Biblioteca de ícones
- **Chart.js** - Gráficos interativos
- **React Chart.js 2** - Integração Chart.js com React

### Backend
- **Next.js API Routes** - Endpoints serverless
- **Sistema Mock** - Banco de dados em memória (sem BD real)
- **Autenticação JWT** - Tokens mockados para autenticação

### Desenvolvimento
- **ESLint** - Linting de código
- **TypeScript** - Tipagem estática completa
- **Hot Reload** - Atualização instantânea

---

## 📥 Instalação

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Passo a passo

1. **Clone o repositório**
```bash
git clone https://github.com/berbelmont/nfeasy-ionic.git
cd nfeasy-ionic
```

2. **Instale as dependências**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

4. **Acesse no navegador**
```
http://localhost:3000
```

---

## 📱 Telas Implementadas

### 1. 🔐 Login (`/login`)
- Autenticação de usuários
- Validação de credenciais
- Redirecionamento baseado em role
- **Backend:** `POST /api/Login`
- **Componentes:** IonPage, IonCard, IonInput, IonButton

### 2. 📊 Dashboard (`/home`)
- Gráfico de vendas por hora
- Métricas do dia (faturamento, vendas, ticket médio)
- Lista de produtos com estoque baixo
- **Backend:** `GET /api/Home`
- **Componentes:** IonPage, IonHeader, IonCard, IonGrid, IonList

### 3. 📦 Cadastro de Produtos (`/cadastro-produtos`)
- Formulário completo de cadastro
- Validações em tempo real
- Toggle ativo/inativo
- **Backend:** `POST /api/cadastro_produtos`
- **Componentes:** IonPage, IonInput, IonSelect, IonToggle

---

## 📚 Documentação

Este projeto inclui documentação completa:

- **README_IONIC.md** - Documentação detalhada do projeto com Ionic
- **BACKEND_DOCUMENTATION.md** - Documentação completa das APIs
- **TESTING_GUIDE.md** - Guia completo de testes
- **RESUMO_EXECUTIVO.md** - Resumo executivo do projeto
- **CHECKLIST.md** - Checklist de verificação
- **PROJETO_COMPLETO.md** - Status final do projeto

---

## 🎯 Como Usar

### 1. Faça Login

Acesse `http://localhost:3000` e você será redirecionado para a tela de login.

**Credenciais de teste:**

| Usuário | Senha | Perfil | Acesso |
|---------|-------|--------|--------|
| `admin` | `1234` | Administrador | Todas as funcionalidades |
| `caixa` | `1234` | Operador de Caixa | PDV e Cadastro de Produtos |

### 2. Navegue pelo Sistema

Após o login, você terá acesso ao menu lateral com as seguintes opções:

- **NFCE** - Ponto de Venda
- **Produtos** - Cadastro de Produtos
- **Financeiro** - Movimentação Financeira
- **Dashboard** - (Apenas Admin)

### 3. Realize uma Venda

1. Acesse **NFCE**
2. Digite ou escaneie o código de barras do produto
3. Ou busque pelo nome (com autocompletar)
4. Clique em **Finalizar $**
5. Informe a forma de pagamento
6. Venda concluída!

---

## 📁 Estrutura do Projeto

```
nfeasy/
├── app/                          # Aplicação Next.js (App Router)
│   ├── globals.css               # Estilos globais
│   ├── layout.tsx                # Layout raiz
│   ├── page.tsx                  # Página inicial (redirect)
│   │
│   ├── login/                    # 🔐 Login
│   │   └── page.tsx
│   │
│   ├── home/                     # 📊 Dashboard
│   │   └── page.tsx
│   │
│   ├── cadastro-produtos/        # 📦 Gestão de Produtos
│   │   └── page.tsx
│   │
│   ├── mov-financeira/           # 💰 Financeiro
│   │   └── page.tsx
│   │
│   ├── produto-notafiscal/       # 🛒 PDV
│   │   └── page.tsx
│   │
│   └── api/                      # 🔌 API Routes
│       ├── cadastro_produtos/
│       ├── Home/
│       ├── Login/
│       ├── Movimentacao_financeira/
│       └── produtos_notafiscal/
│
├── components/                   # Componentes reutilizáveis
│   ├── Sidebar.tsx               # Menu lateral
│   └── AuthGuard.tsx             # Proteção de rotas
│
├── lib/                          # Utilitários
│   ├── auth.ts                   # Lógica de autenticação
│   ├── authFetch.ts              # Fetch com autenticação
│   └── mockdb.ts                 # Banco de dados mock
│
├── public/                       # Arquivos estáticos
│   └── img/                      # Imagens
│
├── middleware.ts                 # Middleware Next.js
├── types.ts                      # Tipos TypeScript globais
├── next.config.mjs               # Configuração Next.js
├── tsconfig.json                 # Configuração TypeScript
└── package.json                  # Dependências
```

---

## 🗺️ Páginas e Rotas

| Rota | Arquivo | Descrição | Autenticação |
|------|---------|-----------|--------------|
| `/` | `app/page.tsx` | Redirect para `/login` | ❌ |
| `/login` | `app/login/page.tsx` | Tela de login | ❌ |
| `/home` | `app/home/page.tsx` | Dashboard com gráficos | ✅ Admin |
| `/cadastro-produtos` | `app/cadastro-produtos/page.tsx` | Cadastro de produtos | ✅ Admin/Caixa |
| `/mov-financeira` | `app/mov-financeira/page.tsx` | Movimentação financeira | ✅ Admin |
| `/produto-notafiscal` | `app/produto-notafiscal/page.tsx` | PDV / Emissão de NFC-e | ✅ Admin/Caixa |

---

## 🔐 Autenticação

### Como Funciona

1. **Login**: Usuário envia credenciais para `/api/Login`
2. **Token**: Sistema retorna JWT token e role
3. **Armazenamento**: Token guardado no `localStorage`
4. **Validação**: Cada requisição envia token no header `Authorization`
5. **Proteção**: `AuthGuard` verifica token antes de renderizar páginas

### Uso nos Componentes

```tsx
import { authFetch } from '@/lib/authFetch';

// Fazer requisição autenticada
const response = await authFetch('/api/minha-rota');
const data = await response.json();
```

### Verificar Role

```tsx
import { getRole } from '@/lib/authFetch';

const role = getRole(); // 'admin' ou 'caixa'

if (role === 'admin') {
  // Mostrar funcionalidades de admin
}
```

### Logout

```tsx
import { clearToken } from '@/lib/authFetch';
import { useRouter } from 'next/navigation';

const router = useRouter();

const handleLogout = () => {
  clearToken();
  router.push('/login');
};
```

---

## 🔌 API Routes

### Endpoints Disponíveis

#### `POST /api/Login`
Autenticação de usuário
```json
{
  "usuario": "admin",
  "senha": "1234"
}
```

#### `GET /api/Home`
Dados do dashboard (requer autenticação)

#### `GET /api/cadastro_produtos`
Lista todos os produtos (requer autenticação)

#### `POST /api/cadastro_produtos`
Cadastra ou atualiza produto (requer autenticação)

#### `GET /api/Movimentacao_financeira?periodo=hoje&forma=Pix`
Movimentações financeiras com filtros (requer autenticação)

#### `POST /api/relatorios/financeiro`
Gera relatório financeiro em PDF (requer autenticação)
```json
{
  "periodo": "hoje|semana|mes",
  "pagamentos": ["PIX", "DINHEIRO", "CREDITO"],
  "vendasIds": ["uuid-1", "uuid-2"]
}
```
**Retorna:** Arquivo PDF para download

#### `POST /api/mov/confirmar`
Confirma e finaliza uma venda aberta (requer autenticação)
```json
{
  "vendaId": "uuid-da-venda",
  "formaPagamento": "PIX",
  "descontoValor": 0,
  "acrescimoValor": 0
}
```

#### `POST /api/mov/devolucao`
Registra devolução de produtos (requer autenticação)
```json
{
  "vendaOriginalId": "uuid-da-venda",
  "itens": [
    { "itemId": "uuid-item", "qtdDevolver": 2 }
  ],
  "motivo": "Produto com defeito"
}
```

#### `GET /api/produtos_notafiscal`
Retorna carrinho atual (requer autenticação)

#### `POST /api/produtos_notafiscal`
Operações do PDV (adicionar, remover, buscar, finalizar)

---

## 💻 Desenvolvimento

### Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor em modo dev (port 3000)

# Build
npm run build            # Cria build de produção
npm start                # Executa build de produção

# Linting
npm run lint             # Verifica problemas no código

# Instalação
npm install              # Instala todas as dependências
```

### Adicionar Nova Página

1. Crie uma pasta em `app/`:
```bash
mkdir app/minha-pagina
```

2. Crie o arquivo `page.tsx`:
```tsx
'use client';

import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';

export default function MinhaPagina() {
  return (
    <AuthGuard>
      <div className="app">
        <Sidebar />
        <main className="main">
          <h1>Minha Nova Página</h1>
        </main>
      </div>
    </AuthGuard>
  );
}
```

3. Acesse em: `http://localhost:3000/minha-pagina`

### Classes CSS Disponíveis

```css
/* Layouts */
.app          /* Container principal com grid sidebar + main */
.main         /* Área de conteúdo principal */
.card         /* Card com borda, shadow e padding */

/* Botões */
.btn          /* Botão base */
.btn.green    /* Botão verde (ações positivas) */
.btn.red      /* Botão vermelho (ações destrutivas) */
.btn.navy     /* Botão azul escuro (ações secundárias) */

/* Formulários */
.input        /* Input estilizado */

/* Tabelas */
.table        /* Tabela com bordas arredondadas */

/* Outros */
.center-title /* Título grande centralizado */
.pills        /* Container de filtros tipo pill */
.pill         /* Botão pill individual */
.pill.active  /* Pill selecionado */
```

---

## 🏗️ Build e Deploy

### Build Local

```bash
npm run build
npm start
```

### Deploy na Vercel

1. Conecte seu repositório no [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente (se necessário)
3. Deploy automático a cada push

### Deploy em Servidor VPS

```bash
# 1. Build
npm run build

# 2. Inicie com PM2
npm install -g pm2
pm2 start npm --name "nfeasy" -- start

# 3. Configure proxy reverso (nginx/apache)
```

---

## 🎨 Customização

### Cores

Edite as variáveis CSS em `app/globals.css`:

```css
:root {
  --navy: #0b2a3c;      /* Azul escuro principal */
  --blue: #3b79c5;      /* Azul dos botões */
  --green: #27ae60;     /* Verde de sucesso */
  --red: #e74c3c;       /* Vermelho de erro */
  --border: #cfd3d6;    /* Cor das bordas */
}
```

### Logo

Substitua o SVG na `Sidebar.tsx` ou adicione uma imagem em `public/img/logo.png`.

---

## 🐛 Troubleshooting

### Erro: "Cannot find module 'react'"
```bash
npm install
```

### Erro: Página em branco
Verifique se tem `'use client'` no topo do arquivo da página.

### Token não persiste
`localStorage` só funciona em client components. Adicione `'use client'`.

### CSS não aplica
Verifique se `globals.css` está importado em `layout.tsx`.

---

## 📝 Licença

Este projeto é de uso livre para fins educacionais e comerciais.

---

## 👨‍💻 Desenvolvido com

- ☕ Café
- 💙 Next.js
- 🎯 TypeScript
- ⚡ Vercel

---

## 📧 Suporte

Para dúvidas ou sugestões, abra uma issue no repositório.

---

**NFEasy** - Gestão comercial simplificada 🚀

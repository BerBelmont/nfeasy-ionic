# NF Easy - Refatoração com Ionic Framework

## 📱 Sobre o Projeto

O **NF Easy** foi completamente refatorado para utilizar o **Ionic Framework**, um framework para desenvolvimento de aplicações mobile e web com componentes modernos e responsivos.

## ✨ Principais Mudanças

### 🎨 Framework Ionic
- Implementação completa dos componentes Ionic React
- Interface moderna e responsiva
- Componentes nativos otimizados para mobile e desktop

### 📄 Telas Implementadas (Mínimo 3)

#### 1. **Tela de Login** (`/login`)
- Componentes Ionic: `IonPage`, `IonContent`, `IonCard`, `IonInput`, `IonButton`
- **Chamada ao Backend**: `POST /api/Login` - Autentica usuário e retorna token
- Design moderno com card centralizado
- Validação de credenciais

#### 2. **Dashboard/Home** (`/home`)
- Componentes Ionic: `IonPage`, `IonHeader`, `IonToolbar`, `IonCard`, `IonGrid`, `IonList`
- **Chamada ao Backend**: `GET /api/Home` - Retorna dados do dashboard (faturamento, vendas, estoque baixo)
- Visualização de:
  - Gráfico de vendas por hora (Chart.js integrado)
  - Cards com métricas do dia (faturamento, total de vendas, ticket médio)
  - Lista de produtos com estoque baixo
- Menu lateral integrado (IonMenu)

#### 3. **Cadastro de Produtos** (`/cadastro-produtos`)
- Componentes Ionic: `IonPage`, `IonInput`, `IonSelect`, `IonToggle`, `IonButton`
- **Chamada ao Backend**: `POST /api/cadastro_produtos` - Salva novo produto no sistema
- Formulário completo com:
  - Campos de texto (código, nome, NCM, etc.)
  - Seletores (subgrupo, unidade de medida)
  - Toggle para ativar/desativar produto
  - Campos numéricos (preço, peso, estoque)
- Validação de dados obrigatórios
- Botões de ação: Salvar, Limpar, Excluir

### 🔧 Componentes Refatorados

#### **Sidebar** → **IonMenu**
- Menu lateral nativo do Ionic
- Navegação entre telas
- Ícones do Ionicons
- Sistema de permissões (admin vs caixa)
- Botão de logout

### 🎯 Requisitos Atendidos

✅ **Mínimo de 3 telas implementadas**
- Login
- Dashboard/Home
- Cadastro de Produtos

✅ **Cada tela com pelo menos 1 chamada ao backend**
- Login: `POST /api/Login`
- Home: `GET /api/Home`
- Cadastro de Produtos: `POST /api/cadastro_produtos`

✅ **Backend com informações mockadas**
- Todas as APIs usam dados mockados
- Não há conexão com banco de dados real
- Dados armazenados em memória (arquivo `mockdb.ts`)

## 🚀 Tecnologias Utilizadas

- **Next.js 14** - Framework React
- **Ionic React** - Componentes UI
- **Ionicons** - Ícones
- **TypeScript** - Tipagem estática
- **Chart.js** - Gráficos
- **React Chart.js 2** - Integração Chart.js com React

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev
```

## 🎨 Componentes Ionic Utilizados

### Navegação e Layout
- `IonPage` - Container principal de página
- `IonHeader` - Cabeçalho da página
- `IonToolbar` - Barra de ferramentas
- `IonContent` - Área de conteúdo
- `IonMenu` - Menu lateral
- `IonMenuButton` - Botão para abrir menu

### Formulários
- `IonInput` - Campo de entrada de texto
- `IonSelect` / `IonSelectOption` - Seletor dropdown
- `IonToggle` - Interruptor on/off
- `IonButton` - Botão
- `IonItem` - Item de lista/formulário
- `IonLabel` - Rótulo de campo

### Conteúdo
- `IonCard` / `IonCardHeader` / `IonCardContent` - Cards
- `IonList` - Listas
- `IonGrid` / `IonRow` / `IonCol` - Sistema de grid responsivo
- `IonIcon` - Ícones

## 🔐 Autenticação

O sistema possui dois tipos de usuário:

### Admin
- Acesso total ao sistema
- Usuário: `admin`
- Senha: `1234`

### Caixa
- Acesso limitado (NFCE e Produtos)
- Usuário: `caixa`
- Senha: `1234`

## 📱 Responsividade

Todos os componentes são responsivos e se adaptam a diferentes tamanhos de tela:
- Desktop
- Tablet
- Mobile

## 🎨 Tema Personalizado

O projeto utiliza cores personalizadas do Ionic:

```css
--ion-color-primary: #3b79c5 (Azul)
--ion-color-secondary: #0b2a3c (Navy)
--ion-color-success: #27ae60 (Verde)
--ion-color-danger: #e74c3c (Vermelho)
```

## 📂 Estrutura do Projeto

```
nfeasy/
├── app/
│   ├── api/                    # Rotas de API (Backend mockado)
│   │   ├── Login/
│   │   ├── Home/
│   │   └── cadastro_produtos/
│   ├── login/                  # Tela de Login
│   ├── home/                   # Dashboard
│   ├── cadastro-produtos/      # Cadastro de Produtos
│   ├── globals.css             # Estilos globais + Ionic CSS
│   └── layout.tsx              # Layout principal
├── components/
│   ├── Sidebar.tsx             # Menu lateral (IonMenu)
│   └── AuthGuard.tsx           # Proteção de rotas
├── lib/
│   ├── auth.ts                 # Lógica de autenticação
│   ├── authFetch.ts            # Fetch com autenticação
│   ├── mockdb.ts               # Banco de dados mockado
│   └── setupIonic.ts           # Configuração do Ionic
└── package.json
```

## 🔄 Fluxo da Aplicação

1. **Login** (`/login`)
   - Usuário insere credenciais
   - Sistema valida via `POST /api/Login`
   - Token e role são armazenados no localStorage
   - Redirecionamento baseado na role

2. **Dashboard** (`/home`)
   - Carrega dados via `GET /api/Home`
   - Exibe gráficos e métricas
   - Acesso ao menu lateral

3. **Cadastro de Produtos** (`/cadastro-produtos`)
   - Formulário com validações
   - Salva via `POST /api/cadastro_produtos`
   - Feedback de sucesso/erro

## 📝 Observações

- Todos os dados são mockados (não há banco de dados real)
- O sistema persiste dados apenas durante a execução
- Tokens de autenticação são simulados
- O projeto está pronto para expansão com banco de dados real

## 🎯 Diferenciais da Implementação

✨ **Design Moderno**: Interface limpa e profissional com Ionic
✨ **Responsivo**: Funciona em qualquer dispositivo
✨ **Componentização**: Código organizado e reutilizável
✨ **TypeScript**: Tipagem completa para maior segurança
✨ **Validações**: Formulários com validação de dados
✨ **Navegação Intuitiva**: Menu lateral com ícones claros
✨ **Feedback Visual**: Alertas e mensagens para o usuário

---

**Desenvolvido com Ionic Framework + Next.js + TypeScript**

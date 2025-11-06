# 🧪 Guia de Testes - NF Easy com Ionic

## 🚀 Como Executar o Projeto

### 1. Instalar Dependências
```bash
npm install
```

### 2. Executar em Modo de Desenvolvimento
```bash
npm run dev
```

O servidor estará disponível em: **http://localhost:3000**

---

## 🔍 Roteiro de Testes

### ✅ Teste 1: Tela de Login

1. Acesse: **http://localhost:3000/login**
2. Verifique os componentes Ionic:
   - ✅ `IonPage` - Página completa
   - ✅ `IonContent` - Conteúdo com fundo azul escuro
   - ✅ `IonCard` - Card branco centralizado
   - ✅ `IonInput` - Campos de entrada modernos
   - ✅ `IonButton` - Botão verde de login

3. **Testar Login como Admin:**
   - Usuário: `admin`
   - Senha: `1234`
   - Clique em "Entrar"
   - ✅ Deve redirecionar para `/home`
   - ✅ Backend chamado: `POST /api/Login`

4. **Testar Login como Caixa:**
   - Usuário: `caixa`
   - Senha: `1234`
   - Clique em "Entrar"
   - ✅ Deve redirecionar para `/produto-notafiscal`
   - ✅ Backend chamado: `POST /api/Login`

5. **Testar Login Inválido:**
   - Usuário: `teste`
   - Senha: `errado`
   - ✅ Deve exibir alerta "Usuário ou senha inválidos"

---

### ✅ Teste 2: Tela Dashboard/Home

1. Faça login como **admin**
2. Você será redirecionado para: **http://localhost:3000/home**
3. Verifique os componentes Ionic:
   - ✅ `IonPage` - Estrutura da página
   - ✅ `IonHeader` com `IonToolbar` azul
   - ✅ `IonMenuButton` - Botão de menu no canto superior esquerdo
   - ✅ `IonCard` - Cards com dados
   - ✅ `IonGrid`, `IonRow`, `IonCol` - Layout responsivo
   - ✅ `IonList` e `IonItem` - Lista de produtos com estoque baixo

4. **Verificar Dados Carregados:**
   - ✅ Gráfico de vendas por hora (Chart.js integrado)
   - ✅ Card com Faturamento Diário (R$ valor)
   - ✅ Card com Total de Vendas (número)
   - ✅ Card com Ticket Médio (R$ valor)
   - ✅ Lista de produtos com baixo estoque
   - ✅ Backend chamado: `GET /api/Home`

5. **Testar Menu Lateral:**
   - Clique no botão de menu (☰) no header
   - ✅ Menu lateral deve abrir da esquerda
   - ✅ Verificar itens: Dashboard, NFCE, Produtos, Financeiro, Sair
   - ✅ Ícones do Ionicons visíveis
   - Clique em "Produtos"
   - ✅ Deve navegar para `/cadastro-produtos`

---

### ✅ Teste 3: Tela Cadastro de Produtos

1. Acesse via menu: **Produtos** ou direto: **http://localhost:3000/cadastro-produtos**
2. Verifique os componentes Ionic:
   - ✅ `IonPage` - Estrutura da página
   - ✅ `IonHeader` com `IonToolbar` azul
   - ✅ `IonCard` - Card com formulário
   - ✅ `IonInput` - Campos de texto
   - ✅ `IonSelect` - Seletores dropdown
   - ✅ `IonToggle` - Interruptor para Ativo/Inativo
   - ✅ `IonButton` - Botões de ação com ícones

3. **Testar Cadastro de Produto Válido:**
   - Preencha os campos:
     - Código: `123`
     - Produto: `Arroz Branco 5kg`
     - Subgrupo: `Mercearia`
     - Preço: `25.90`
     - Código de Barras: `7891234567890`
     - Unidade: `UN`
     - NCM: `10063021` (8 dígitos)
     - Peso: `5.0`
     - Estoque: `100`
     - Ativo: ✅ (toggle ligado)
   - Clique em "Salvar" (botão verde)
   - ✅ Deve exibir alerta "Produto salvo com sucesso!"
   - ✅ Formulário deve limpar automaticamente
   - ✅ Backend chamado: `POST /api/cadastro_produtos`

4. **Testar Validações:**
   
   **Teste A - Campos Obrigatórios:**
   - Deixe "Código" em branco
   - Clique em "Salvar"
   - ✅ Deve exibir "Preencha os campos obrigatórios"
   
   **Teste B - NCM Inválido:**
   - Código: `456`
   - Nome: `Feijão`
   - NCM: `123` (menos de 8 dígitos)
   - Clique em "Salvar"
   - ✅ Deve exibir "Use 8 dígitos no NCM"

5. **Testar Botão Limpar:**
   - Preencha alguns campos
   - Clique em "Limpar" (botão azul escuro)
   - ✅ Todos os campos devem voltar aos valores padrão

6. **Testar Toggle "Ativo":**
   - ✅ Toggle deve alternar entre ligado/desligado
   - ✅ Visual deve mudar de cor

---

## 🎨 Verificações Visuais

### Design Ionic

✅ **Cores:**
- Header: Azul (`--ion-color-primary: #3b79c5`)
- Menu: Azul escuro (`--ion-color-secondary: #0b2a3c`)
- Botão Salvar: Verde (`--ion-color-success: #27ae60`)
- Botão Excluir: Vermelho (`--ion-color-danger: #e74c3c`)

✅ **Componentes:**
- Cards com sombra suave
- Inputs com bordas arredondadas
- Botões com ícones do Ionicons
- Menu lateral com animação de abertura
- Layout responsivo (grid system)

✅ **Tipografia:**
- Títulos grandes e legíveis
- Labels claros nos formulários
- Textos com contraste adequado

---

## 📱 Teste de Responsividade

### Desktop (> 992px)
1. Redimensione a janela para desktop
2. ✅ Cards devem aparecer lado a lado
3. ✅ Formulário deve usar grid de 2 colunas em campos

### Tablet (768px - 992px)
1. Redimensione para tablet
2. ✅ Layout deve ajustar automaticamente
3. ✅ Grid deve reorganizar

### Mobile (< 768px)
1. Redimensione para mobile ou use DevTools
2. ✅ Cards devem empilhar verticalmente
3. ✅ Menu lateral deve ocupar mais espaço
4. ✅ Formulário deve ter 1 coluna

---

## 🔐 Teste de Autenticação

### Teste de Proteção de Rotas
1. Abra uma aba anônima
2. Tente acessar: **http://localhost:3000/home**
3. ✅ Deve redirecionar para `/login` (AuthGuard ativo)

### Teste de Permissões
1. Faça login como **caixa** (senha: 1234)
2. Tente acessar "Financeiro" pelo menu
3. ✅ Deve exibir "Permissão negada"
4. Acesse "Produtos"
5. ✅ Deve funcionar normalmente

### Teste de Logout
1. Clique no menu lateral
2. Clique em "Sair"
3. ✅ Deve voltar para `/login`
4. ✅ Token deve ser removido do localStorage

---

## 🔍 Inspecionar Network (DevTools)

### Verificar Chamadas ao Backend

1. Abra DevTools (F12)
2. Vá para aba "Network"
3. Filtre por "Fetch/XHR"

**Login:**
- ✅ Requisição: `POST http://localhost:3000/api/Login`
- ✅ Status: 200
- ✅ Response deve conter: `{ ok: true, token, role }`

**Home:**
- ✅ Requisição: `GET http://localhost:3000/api/Home`
- ✅ Header: `Authorization: Bearer <token>`
- ✅ Status: 200
- ✅ Response: dados do dashboard

**Cadastro Produtos:**
- ✅ Requisição: `POST http://localhost:3000/api/cadastro_produtos`
- ✅ Header: `Authorization: Bearer <token>`
- ✅ Body: dados do produto em JSON
- ✅ Status: 200

---

## ✅ Checklist Final

### Requisitos do Projeto
- ✅ Mínimo de 3 telas implementadas
  - [x] Login
  - [x] Dashboard/Home
  - [x] Cadastro de Produtos
  
- ✅ Cada tela com pelo menos 1 chamada ao backend
  - [x] Login → `POST /api/Login`
  - [x] Home → `GET /api/Home`
  - [x] Cadastro → `POST /api/cadastro_produtos`

- ✅ Backend com informações mockadas
  - [x] Dados em memória
  - [x] Sem banco de dados
  - [x] APIs funcionais

### Ionic Framework
- ✅ Componentes Ionic utilizados
  - [x] IonPage, IonContent, IonHeader
  - [x] IonCard, IonInput, IonSelect
  - [x] IonButton, IonToggle, IonMenu
  - [x] IonGrid, IonList, IonIcon
  
- ✅ Tema personalizado
  - [x] Cores customizadas
  - [x] CSS do Ionic importado
  
- ✅ Responsividade
  - [x] Desktop
  - [x] Tablet
  - [x] Mobile

---

## 🐛 Problemas Comuns e Soluções

### Problema: "Cannot find module @ionic/react"
**Solução:**
```bash
npm install @ionic/react @ionic/react-router ionicons
```

### Problema: Estilos do Ionic não aparecem
**Solução:** Verifique se `globals.css` importa os CSS do Ionic:
```css
@import '@ionic/react/css/core.css';
```

### Problema: Menu lateral não abre
**Solução:** Verifique se o `IonPage` tem o atributo `id="main-content"`

### Problema: Autenticação não funciona
**Solução:** Limpe o localStorage:
```javascript
localStorage.clear();
```

---

## 📊 Métricas de Sucesso

✅ **100% dos componentes usando Ionic**
✅ **100% das telas com backend integrado**
✅ **0 erros de compilação**
✅ **Responsivo em todos os dispositivos**
✅ **Interface moderna e profissional**

---

## 🎉 Conclusão

Projeto **NF Easy** totalmente refatorado com **Ionic Framework**!

- ✨ 3 telas completas e funcionais
- 🔌 Todas com integração backend
- 🎨 Interface moderna com Ionic
- 📱 Totalmente responsivo
- 🔒 Sistema de autenticação
- 📊 Dados mockados

**Pronto para demonstração e avaliação!**

---

**Desenvolvido com ❤️ usando Ionic + Next.js + TypeScript**

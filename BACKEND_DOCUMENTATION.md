# 📡 Documentação das Chamadas ao Backend

Este documento descreve todas as chamadas ao backend implementadas nas telas do sistema NF Easy.

## 🔐 1. Tela de Login (`/login`)

### Endpoint: `POST /api/Login`

**Arquivo:** `app/api/Login/route.ts`

**Descrição:** Autentica o usuário no sistema e retorna um token de acesso.

**Request Body:**
```json
{
  "usuario": "admin",
  "senha": "1234"
}
```

**Response (Sucesso - 200):**
```json
{
  "ok": true,
  "token": "mock-token-123",
  "role": "admin"
}
```

**Response (Erro - 401):**
```json
{
  "ok": false,
  "message": "Usuário ou senha inválidos"
}
```

**Usuários Disponíveis:**
- **Admin:** usuario: `admin`, senha: `1234`
- **Caixa:** usuario: `caixa`, senha: `1234`

**Implementação no Frontend:**
```typescript
const res = await fetch('/api/Login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ usuario: usuario.trim(), senha: senha.trim() }),
});

const data = await res.json();
```

---

## 📊 2. Tela Home/Dashboard (`/home`)

### Endpoint: `GET /api/Home`

**Arquivo:** `app/api/Home/route.ts`

**Descrição:** Retorna dados estatísticos do dashboard, incluindo faturamento, vendas e produtos com estoque baixo.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "faturamentoDiario": 15420.50,
  "totalVendasDia": 87,
  "ticketMedio": 177.25,
  "vendasPorHora": [
    {
      "hora": "08:00",
      "sexta": 850.00,
      "sabado": 920.00,
      "domingo": 780.00
    },
    {
      "hora": "09:00",
      "sexta": 1200.00,
      "sabado": 1350.00,
      "domingo": 1100.00
    }
    // ... mais horas
  ],
  "baixoEstoque": [
    {
      "codigo": "001",
      "produto": "Arroz Tipo 1",
      "quantidade": 5,
      "valor": 25.90
    },
    {
      "codigo": "015",
      "produto": "Feijão Preto",
      "quantidade": 3,
      "valor": 8.50
    }
    // ... mais produtos
  ]
}
```

**Implementação no Frontend:**
```typescript
useEffect(() => {
  const loadData = async () => {
    const res = await authFetch('/api/Home');
    const homeData = await res.json();
    setData(homeData);
  };
  
  loadData();
}, []);
```

**Dados Exibidos:**
- 💰 Faturamento Diário
- 🛍️ Total de Vendas
- 🏷️ Ticket Médio
- 📊 Gráfico de Vendas por Hora
- 📦 Produtos com Baixo Estoque

---

## 📦 3. Tela de Cadastro de Produtos (`/cadastro-produtos`)

### Endpoint: `POST /api/cadastro_produtos`

**Arquivo:** `app/api/cadastro_produtos/route.ts`

**Descrição:** Salva um novo produto no sistema.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "codigo": "123",
  "nome": "Arroz Branco 5kg",
  "subgrupo": "Mercearia",
  "preco": 25.90,
  "codigoBarras": "7891234567890",
  "unidade": "UN",
  "ncm": "10063021",
  "peso": 5.0,
  "cstIpi": "99",
  "cstCofins": "01",
  "cstPis": "01",
  "ativo": true,
  "estoque": 100
}
```

**Response (Sucesso - 200):**
```json
{
  "ok": true,
  "produto": {
    "id": "uuid-gerado",
    "codigo": "123",
    "nome": "Arroz Branco 5kg",
    // ... demais campos
  }
}
```

**Response (Erro - 400):**
```json
{
  "ok": false,
  "error": {
    "codigo": ["Campo obrigatório"],
    "ncm": ["NCM deve ter 8 dígitos"]
  }
}
```

**Validações:**
- ✅ Código é obrigatório
- ✅ Nome é obrigatório
- ✅ Subgrupo é obrigatório
- ✅ Unidade é obrigatória
- ✅ NCM é obrigatório e deve ter exatamente 8 dígitos
- ✅ Preço deve ser número positivo

**Implementação no Frontend:**
```typescript
const handleSalvar = async () => {
  if (!form.codigo || !form.nome || !form.subgrupo || !form.unidade || !form.ncm) {
    alert('Preencha os campos obrigatórios');
    return;
  }

  if (!/^\d{8}$/.test(form.ncm)) {
    alert('Use 8 dígitos no NCM');
    return;
  }

  const res = await authFetch('/api/cadastro_produtos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });

  if (!res.ok) {
    const err = await res.json();
    alert('Erro: ' + (err?.error ? JSON.stringify(err.error) : res.statusText));
    return;
  }

  alert('Produto salvo com sucesso!');
  handleLimpar();
};
```

**Campos do Formulário:**
- 📝 Código do Produto
- 🏷️ Nome do Produto
- 📂 Subgrupo (Mercearia, Frios, Higiene, Limpeza, Bebidas)
- 💰 Preço
- 🔢 Código de Barras (EAN-13)
- 📏 Unidade de Medida (UN, KG, L)
- 🏷️ NCM (8 dígitos)
- ⚖️ Peso
- 📋 CST IPI, COFINS, PIS
- ✅ Status Ativo/Inativo (Toggle)
- 📦 Quantidade em Estoque

---

## 🔒 Autenticação

Todas as chamadas ao backend (exceto Login) requerem autenticação via token:

**Header:**
```
Authorization: Bearer <token>
```

**Implementação (`lib/authFetch.ts`):**
```typescript
export async function authFetch(url: string, options?: RequestInit) {
  const token = getToken();
  
  return fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      'Authorization': `Bearer ${token}`,
    },
  });
}
```

---

## 🗄️ Banco de Dados Mockado

Todos os dados são armazenados em memória no arquivo `lib/mockdb.ts`:

```typescript
export const mockDatabase = {
  produtos: [],
  vendas: [],
  usuarios: [
    { usuario: 'admin', senha: '1234', role: 'admin' },
    { usuario: 'caixa', senha: '1234', role: 'caixa' }
  ]
};
```

**Características:**
- ✅ Dados persistem apenas durante a execução do servidor
- ✅ Reiniciar o servidor limpa todos os dados
- ✅ Não há conexão com banco de dados real
- ✅ Perfeito para demonstração e testes

---

## ✅ Resumo das Telas e Endpoints

| Tela | Rota | Endpoint | Método | Autenticação |
|------|------|----------|--------|--------------|
| Login | `/login` | `/api/Login` | POST | ❌ Não |
| Dashboard | `/home` | `/api/Home` | GET | ✅ Sim |
| Cadastro Produtos | `/cadastro-produtos` | `/api/cadastro_produtos` | POST | ✅ Sim |

---

## 🎯 Requisitos Atendidos

✅ **3 telas implementadas**
✅ **Cada tela tem pelo menos 1 chamada ao backend**
✅ **Backend com informações mockadas**
✅ **Sem conexão com banco de dados**

---

**Nota:** Este sistema foi desenvolvido como exemplo educacional. Para uso em produção, seria necessário implementar um banco de dados real, validações mais robustas, e medidas de segurança adicionais.

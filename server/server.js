const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock Database
const mockUsers = [
  { id: '1', email: 'admin@nfeasy.com', password: 'admin123', name: 'Administrador', role: 'admin' },
  { id: '2', email: 'gerente@nfeasy.com', password: 'gerente123', name: 'Gerente', role: 'gerente' },
  { id: '3', email: 'operador@nfeasy.com', password: 'operador123', name: 'Operador', role: 'operador' }
];

const mockProdutos = [
  { 
    id: '1', 
    codigo: 'PROD001', 
    nome: 'Arroz 5kg', 
    subgrupo: 'Mercearia', 
    preco: 25.90,
    codigoBarras: '7891234567890',
    unidade: 'UN',
    ncm: '10063000',
    peso: 5.0,
    ativo: true,
    estoque: 50
  },
  { 
    id: '2', 
    codigo: 'PROD002', 
    nome: 'Feijão Preto 1kg', 
    subgrupo: 'Mercearia', 
    preco: 8.50,
    codigoBarras: '7891234567891',
    unidade: 'UN',
    ncm: '07133300',
    peso: 1.0,
    ativo: true,
    estoque: 30
  },
  { 
    id: '3', 
    codigo: 'PROD003', 
    nome: 'Leite Integral 1L', 
    subgrupo: 'Frios', 
    preco: 4.20,
    codigoBarras: '7891234567892',
    unidade: 'L',
    ncm: '04011010',
    peso: 1.03,
    ativo: true,
    estoque: 100
  }
];

// Token mock (em produção, use JWT)
const generateToken = (userId) => {
  return `mock-token-${userId}-${Date.now()}`;
};

// Verificar token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];
  if (!token || !token.startsWith('mock-token-')) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  next();
};

// === ROTAS ===

// POST /api/login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  const user = mockUsers.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const token = generateToken(user.id);

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// GET /api/home
app.get('/api/home', verifyToken, (req, res) => {
  const homeData = {
    vendasPorHora: [
      { hora: '08:00', sexta: 120, sabado: 180, domingo: 150 },
      { hora: '09:00', sexta: 200, sabado: 250, domingo: 220 },
      { hora: '10:00', sexta: 350, sabado: 400, domingo: 380 },
      { hora: '11:00', sexta: 500, sabado: 600, domingo: 550 },
      { hora: '12:00', sexta: 700, sabado: 850, domingo: 800 },
      { hora: '13:00', sexta: 650, sabado: 750, domingo: 700 },
      { hora: '14:00', sexta: 550, sabado: 650, domingo: 600 },
      { hora: '15:00', sexta: 600, sabado: 700, domingo: 650 },
      { hora: '16:00', sexta: 750, sabado: 850, domingo: 800 },
      { hora: '17:00', sexta: 850, sabado: 950, domingo: 900 },
      { hora: '18:00', sexta: 900, sabado: 1000, domingo: 950 },
      { hora: '19:00', sexta: 800, sabado: 900, domingo: 850 },
    ],
    faturamentoDiario: 15500.75,
    totalVendas: 342,
    ticketMedio: 45.32,
    produtosBaixoEstoque: [
      { nome: 'Feijão Preto 1kg', estoque: 5 },
      { nome: 'Açúcar 1kg', estoque: 8 },
      { nome: 'Café 500g', estoque: 3 },
    ]
  };

  res.json(homeData);
});

// POST /api/cadastro_produtos
app.post('/api/cadastro_produtos', verifyToken, (req, res) => {
  const produto = req.body;

  // Validações
  if (!produto.codigo || !produto.nome || !produto.subgrupo || !produto.unidade || !produto.ncm) {
    return res.status(400).json({ 
      error: 'Campos obrigatórios: codigo, nome, subgrupo, unidade, ncm' 
    });
  }

  if (!/^\d{8}$/.test(produto.ncm)) {
    return res.status(400).json({ 
      error: 'NCM deve ter exatamente 8 dígitos' 
    });
  }

  // Verificar se código já existe
  const existente = mockProdutos.find(p => p.codigo === produto.codigo);
  if (existente) {
    return res.status(400).json({ 
      error: 'Já existe um produto com este código' 
    });
  }

  // Adicionar produto
  const novoProduto = {
    id: String(mockProdutos.length + 1),
    ...produto
  };

  mockProdutos.push(novoProduto);

  res.status(201).json({
    message: 'Produto cadastrado com sucesso',
    produto: novoProduto
  });
});

// GET /api/produtos (opcional - listar produtos)
app.get('/api/produtos', verifyToken, (req, res) => {
  res.json(mockProdutos);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
  console.log(`📡 Endpoints disponíveis:`);
  console.log(`   POST /api/login`);
  console.log(`   GET  /api/home`);
  console.log(`   POST /api/cadastro_produtos`);
  console.log(`   GET  /api/produtos`);
});

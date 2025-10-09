// Mock de banco de dados para o sistema NFEasy
// Tipos e dados mockados para vendas, produtos, devoluções

export type Pagamento = "PIX" | "DINHEIRO" | "CREDITO" | "DEBITO" | "BOLETO";
export type StatusVenda = "ABERTA" | "FINALIZADA";
export type TipoDoc = "VENDA" | "DEVOLUCAO";

export interface ItemVenda {
  itemId: string;
  produtoId: string;
  descricao: string;
  qtd: number;
  valorUnit: number;
  subtotal: number;
}

export interface Venda {
  id: string;
  tipo: TipoDoc;
  numeroNF?: string;
  data: string; // ISO format
  status: StatusVenda;
  formaPagamento?: Pagamento;
  itens: ItemVenda[];
  desconto?: number;
  acrescimo?: number;
  total: number;
  referenciaVendaId?: string; // Para devoluções
  cliente?: { id?: string; nome?: string; cpf?: string } | null;
  motivo?: string; // Para devoluções
  dataFechamento?: string; // ISO format
}

export interface Produto {
  id: string;
  codigo: string;
  nome: string;
  subgrupo: string;
  preco: number;
  codigoBarras?: string;
  unidade: string;
  ncm: string;
  peso?: number;
  cstIpi?: string;
  cstCofins?: string;
  cstPis?: string;
  imagemUrl?: string;
  ativo: boolean;
  estoque: number;
}

// Mock de produtos
export const produtos: Produto[] = [
  {
    id: "prod-001",
    codigo: "001",
    nome: "Arroz Branco 5kg",
    subgrupo: "Mercearia",
    preco: 25.90,
    codigoBarras: "7891234567890",
    unidade: "UN",
    ncm: "10063021",
    peso: 5.0,
    cstIpi: "99",
    cstCofins: "01",
    cstPis: "01",
    ativo: true,
    estoque: 150,
  },
  {
    id: "prod-002",
    codigo: "002",
    nome: "Feijão Preto 1kg",
    subgrupo: "Mercearia",
    preco: 8.50,
    codigoBarras: "7891234567891",
    unidade: "UN",
    ncm: "07133300",
    peso: 1.0,
    ativo: true,
    estoque: 200,
  },
  {
    id: "prod-003",
    codigo: "003",
    nome: "Óleo de Soja 900ml",
    subgrupo: "Mercearia",
    preco: 7.90,
    codigoBarras: "7891234567892",
    unidade: "UN",
    ncm: "15079010",
    peso: 0.9,
    ativo: true,
    estoque: 100,
  },
  {
    id: "prod-004",
    codigo: "004",
    nome: "Leite Integral 1L",
    subgrupo: "Frios",
    preco: 4.50,
    codigoBarras: "7891234567893",
    unidade: "L",
    ncm: "04012010",
    peso: 1.0,
    ativo: true,
    estoque: 80,
  },
  {
    id: "prod-005",
    codigo: "005",
    nome: "Refrigerante Cola 2L",
    subgrupo: "Bebidas",
    preco: 6.50,
    codigoBarras: "7891234567894",
    unidade: "UN",
    ncm: "22021000",
    peso: 2.0,
    ativo: true,
    estoque: 120,
  },
];

// Mock de vendas
export let vendas: Venda[] = [
  {
    id: "venda-001",
    tipo: "VENDA",
    numeroNF: "000001",
    data: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
    status: "FINALIZADA",
    formaPagamento: "PIX",
    itens: [
      {
        itemId: "item-001",
        produtoId: "prod-001",
        descricao: "Arroz Branco 5kg",
        qtd: 2,
        valorUnit: 25.90,
        subtotal: 51.80,
      },
      {
        itemId: "item-002",
        produtoId: "prod-002",
        descricao: "Feijão Preto 1kg",
        qtd: 1,
        valorUnit: 8.50,
        subtotal: 8.50,
      },
    ],
    desconto: 0,
    acrescimo: 0,
    total: 60.30,
    cliente: { nome: "João Silva", cpf: "12345678901" },
    dataFechamento: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "venda-002",
    tipo: "VENDA",
    numeroNF: "000002",
    data: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 horas atrás
    status: "FINALIZADA",
    formaPagamento: "DINHEIRO",
    itens: [
      {
        itemId: "item-003",
        produtoId: "prod-003",
        descricao: "Óleo de Soja 900ml",
        qtd: 3,
        valorUnit: 7.90,
        subtotal: 23.70,
      },
    ],
    desconto: 0,
    acrescimo: 0,
    total: 23.70,
    dataFechamento: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "venda-003",
    tipo: "VENDA",
    numeroNF: "000003",
    data: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hora atrás
    status: "FINALIZADA",
    formaPagamento: "CREDITO",
    itens: [
      {
        itemId: "item-004",
        produtoId: "prod-004",
        descricao: "Leite Integral 1L",
        qtd: 6,
        valorUnit: 4.50,
        subtotal: 27.00,
      },
      {
        itemId: "item-005",
        produtoId: "prod-005",
        descricao: "Refrigerante Cola 2L",
        qtd: 2,
        valorUnit: 6.50,
        subtotal: 13.00,
      },
    ],
    desconto: 2.00,
    acrescimo: 0,
    total: 38.00,
    cliente: { nome: "Maria Santos" },
    dataFechamento: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "venda-004",
    tipo: "VENDA",
    numeroNF: "000004",
    data: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias atrás
    status: "FINALIZADA",
    formaPagamento: "DEBITO",
    itens: [
      {
        itemId: "item-006",
        produtoId: "prod-001",
        descricao: "Arroz Branco 5kg",
        qtd: 1,
        valorUnit: 25.90,
        subtotal: 25.90,
      },
    ],
    desconto: 0,
    acrescimo: 0,
    total: 25.90,
    dataFechamento: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "venda-005",
    tipo: "VENDA",
    numeroNF: "000005",
    data: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 dias atrás
    status: "FINALIZADA",
    formaPagamento: "BOLETO",
    itens: [
      {
        itemId: "item-007",
        produtoId: "prod-002",
        descricao: "Feijão Preto 1kg",
        qtd: 5,
        valorUnit: 8.50,
        subtotal: 42.50,
      },
      {
        itemId: "item-008",
        produtoId: "prod-003",
        descricao: "Óleo de Soja 900ml",
        qtd: 2,
        valorUnit: 7.90,
        subtotal: 15.80,
      },
    ],
    desconto: 0,
    acrescimo: 0,
    total: 58.30,
    cliente: { nome: "Pedro Oliveira", cpf: "98765432100" },
    dataFechamento: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "venda-006",
    tipo: "VENDA",
    numeroNF: "000006",
    data: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutos atrás
    status: "FINALIZADA",
    formaPagamento: "PIX",
    itens: [
      {
        itemId: "item-009",
        produtoId: "prod-005",
        descricao: "Refrigerante Cola 2L",
        qtd: 4,
        valorUnit: 6.50,
        subtotal: 26.00,
      },
    ],
    desconto: 0,
    acrescimo: 0,
    total: 26.00,
    dataFechamento: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "venda-007",
    tipo: "VENDA",
    data: new Date().toISOString(), // Agora
    status: "ABERTA",
    itens: [
      {
        itemId: "item-010",
        produtoId: "prod-001",
        descricao: "Arroz Branco 5kg",
        qtd: 1,
        valorUnit: 25.90,
        subtotal: 25.90,
      },
    ],
    desconto: 0,
    acrescimo: 0,
    total: 25.90,
  },
];

// Helpers para filtros de período
export function rangePeriodo(periodo: "hoje" | "semana" | "mes"): { inicio: Date; fim: Date } {
  const agora = new Date();
  const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 0, 0, 0, 0);
  const fim = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 23, 59, 59, 999);

  switch (periodo) {
    case "hoje":
      return { inicio: hoje, fim };
    case "semana": {
      const diaSemana = agora.getDay();
      const inicioSemana = new Date(hoje);
      inicioSemana.setDate(hoje.getDate() - diaSemana);
      return { inicio: inicioSemana, fim };
    }
    case "mes": {
      const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1, 0, 0, 0, 0);
      return { inicio: inicioMes, fim };
    }
  }
}

// Helper para filtrar vendas por período e formas de pagamento
export function filtrarVendas(
  periodo: "hoje" | "semana" | "mes",
  formasPagamento?: Pagamento[]
): Venda[] {
  const { inicio, fim } = rangePeriodo(periodo);

  return vendas.filter((venda) => {
    const dataVenda = new Date(venda.data);
    const dentroPeríodo = dataVenda >= inicio && dataVenda <= fim;
    const statusValido = venda.status === "FINALIZADA";

    if (!formasPagamento || formasPagamento.length === 0) {
      return dentroPeríodo && statusValido;
    }

    return dentroPeríodo && statusValido && venda.formaPagamento && formasPagamento.includes(venda.formaPagamento);
  });
}

// Helper para calcular totais por forma de pagamento
export function totaisPorPagamento(vendasFiltradas: Venda[]): Record<Pagamento, number> {
  const totais: Record<Pagamento, number> = {
    PIX: 0,
    DINHEIRO: 0,
    CREDITO: 0,
    DEBITO: 0,
    BOLETO: 0,
  };

  vendasFiltradas.forEach((venda) => {
    if (venda.formaPagamento && venda.tipo === "VENDA") {
      totais[venda.formaPagamento] += venda.total;
    } else if (venda.tipo === "DEVOLUCAO" && venda.formaPagamento) {
      // Devoluções reduzem o total
      totais[venda.formaPagamento] -= venda.total;
    }
  });

  return totais;
}

// Helper para calcular total geral
export function totalGeral(vendasFiltradas: Venda[]): number {
  return vendasFiltradas.reduce((acc, venda) => {
    if (venda.tipo === "VENDA") {
      return acc + venda.total;
    } else if (venda.tipo === "DEVOLUCAO") {
      return acc - venda.total;
    }
    return acc;
  }, 0);
}

// Helper para calcular totais de devoluções
export function totalDevolucoes(vendasFiltradas: Venda[]): number {
  return vendasFiltradas
    .filter((venda) => venda.tipo === "DEVOLUCAO")
    .reduce((acc, venda) => acc + venda.total, 0);
}

// Helper para gerar número de NF sequencial
let ultimoNumeroNF = 6;
export function gerarNumeroNF(): string {
  ultimoNumeroNF += 1;
  return String(ultimoNumeroNF).padStart(6, "0");
}

// Helper para gerar UUID simples
export function gerarUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

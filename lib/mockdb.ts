import { Produto, Venda, VendaItem, FormaPagamento } from '../types';
let _produtos: Produto[] = [
  { id: 'p1', codigo: '101', nome: 'Arroz Branco 5kg', preco: 24.90, estoque: 12, unidade: 'UN', subgrupo: 'Mercearia', codigoBarras: '7891000101101', ncm: '10063021', peso: 5.0, cstIpi: '50', cstCofins: '01', cstPis: '01', imagemUrl: '', ativo: true },
  { id: 'p2', codigo: '102', nome: 'Feijão Carioca 1kg', preco: 7.99, estoque: 5, unidade: 'UN', subgrupo: 'Mercearia', codigoBarras: '7891000201202', ncm: '07133319', peso: 1.0, cstIpi: '50', cstCofins: '01', cstPis: '01', imagemUrl: '', ativo: true },
  { id: 'p3', codigo: '103', nome: 'Açúcar Refinado 1kg', preco: 4.49, estoque: 18, unidade: 'UN', subgrupo: 'Mercearia', codigoBarras: '7891000301303', ncm: '17019900', peso: 1.0, cstIpi: '50', cstCofins: '01', cstPis: '01', imagemUrl: '', ativo: true },
  { id: 'p4', codigo: '104', nome: 'Café Torrado 500g', preco: 15.99, estoque: 3, unidade: 'UN', subgrupo: 'Mercearia', codigoBarras: '7891000401404', ncm: '09012100', peso: 0.5, cstIpi: '50', cstCofins: '01', cstPis: '01', imagemUrl: '', ativo: true },
  { id: 'p5', codigo: '105', nome: 'Leite UHT 1L', preco: 4.79, estoque: 30, unidade: 'L', subgrupo: 'Mercearia', codigoBarras: '7891000501505', ncm: '04012010', peso: 1.0, cstIpi: '50', cstCofins: '01', cstPis: '01', imagemUrl: '', ativo: true },
  { id: 'p6', codigo: '106', nome: 'Óleo de Soja 900ml', preco: 6.49, estoque: 10, unidade: 'L', subgrupo: 'Mercearia', codigoBarras: '7891000601606', ncm: '15071000', peso: 0.9, cstIpi: '50', cstCofins: '01', cstPis: '01', imagemUrl: '', ativo: true },
  { id: 'p7', codigo: '107', nome: 'Macarrão Espaguete 500g', preco: 3.99, estoque: 22, unidade: 'UN', subgrupo: 'Mercearia', codigoBarras: '7891000701707', ncm: '19021900', peso: 0.5, cstIpi: '50', cstCofins: '01', cstPis: '01', imagemUrl: '', ativo: true },
  { id: 'p8', codigo: '108', nome: 'Detergente 500ml', preco: 2.49, estoque: 40, unidade: 'UN', subgrupo: 'Limpeza', codigoBarras: '7891000801808', ncm: '34022000', peso: 0.5, cstIpi: '50', cstCofins: '01', cstPis: '01', imagemUrl: '', ativo: true },
  { id: 'p9', codigo: '109', nome: 'Papel Higiênico 12 rolos', preco: 18.90, estoque: 6, unidade: 'UN', subgrupo: 'Higiene', codigoBarras: '7891000901909', ncm: '48181000', peso: 1.2, cstIpi: '50', cstCofins: '01', cstPis: '01', imagemUrl: '', ativo: true },
  { id: 'p10', codigo: '512', nome: 'VEJA DESINFETANTE', preco: 19.99, estoque: 25, unidade: 'UN', subgrupo: 'Limpeza', codigoBarras: '7890322341312', ncm: '38089429', peso: 0.75, cstIpi: '50', cstCofins: '01', cstPis: '01', imagemUrl: '/img/veja.png', ativo: true }
];
let _vendas: Venda[] = [];
let _carrinho: { itens: VendaItem[] } = { itens: [] };
function uid(prefix='id'){ return prefix + Math.random().toString(36).slice(2,9); }
export const db = {
  listProdutos: () => _produtos,
  getProduto: (id: string) => _produtos.find(p => p.id === id),
  buscarPorCodigoBarras: (barcode: string) => _produtos.find(p => p.codigoBarras === barcode && p.ativo !== false),
  buscarPorCodigo: (codigo: string) => _produtos.find(p => p.codigo === codigo && p.ativo !== false),
  buscarPorNome: (nome: string) => _produtos.find(p => p.nome.toLowerCase().includes(nome.toLowerCase()) && p.ativo !== false),
  createProduto: (p: Omit<Produto, 'id'>) => { const novo: Produto = { ...p, id: uid('p') }; _produtos.push(novo); return novo; },
  updateProduto: (id: string, p: Partial<Produto>) => { const idx = _produtos.findIndex(x => x.id === id); if (idx === -1) return null; _produtos[idx] = { ..._produtos[idx], ...p }; return _produtos[idx]; },
  deleteProduto: (id: string) => { const before = _produtos.length; _produtos = _produtos.filter(p => p.id != id); return before !== _produtos.length; },
  listVendas: (start: Date, end: Date, forma?: FormaPagamento) => {
    return _vendas.filter(v => {
      const d = new Date(v.data);
      const okRange = d >= start && d < end;
      const okForma = forma ? v.formaPagamento === forma : true;
      return okRange && okForma;
    });
  },
  addVenda: (v: Omit<Venda, 'id' | 'total'>) => {
    const total = v.itens.reduce((s, it) => s + it.quantidade * it.valorUnitario, 0);
    const venda: Venda = { ...v, id: uid('v'), total };
    _vendas.push(venda);
    venda.itens.forEach(it => {
      const p = _produtos.find(pr => pr.id === it.produtoId);
      if (p) p.estoque = Math.max(0, p.estoque - it.quantidade);
    });
    return venda;
  },
  carrinhoGet: () => _carrinho,
  carrinhoClear: () => { _carrinho = { itens: [] }; },
  carrinhoAddItem: (produtoId: string, quantidade: number, valorUnitario?: number) => {
    const p = _produtos.find(pr => pr.id === produtoId);
    if (!p) return null;
    if (p.ativo === false) return { error: 'Produto inativo' } as any;
    const item: VendaItem = { id: uid('i'), produtoId, quantidade, valorUnitario: valorUnitario ?? p.preco };
    _carrinho.itens.push(item); return item;
  },
  carrinhoRemoveItem: (itemId: string) => { _carrinho.itens = _carrinho.itens.filter(i => i.id !== itemId); },
  carrinhoAlterarItem: (itemId: string, quantidade?: number, valorUnitario?: number) => {
    const it = _carrinho.itens.find(i => i.id === itemId);
    if(!it) return null;
    if(typeof quantidade === 'number') it.quantidade = quantidade;
    if(typeof valorUnitario === 'number') it.valorUnitario = valorUnitario;
    return it;
  }
};

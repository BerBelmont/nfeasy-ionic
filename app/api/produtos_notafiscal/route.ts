import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/mockdb';
import type { FormaPagamento } from '../../../types';

export async function GET() {
  const carrinho = db.carrinhoGet();
  const itens = carrinho.itens.map(i => {
    const p = db.getProduto(i.produtoId)!;
    return { id: i.id, codigo: p.codigo, produto: p.nome, valor: i.valorUnitario, un: p.unidade || 'UN', quantidade: i.quantidade };
  });
  const total = carrinho.itens.reduce((s,i)=> s + i.quantidade * i.valorUnitario, 0);
  return NextResponse.json({ itens, total });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(()=>({}));
  const { action } = body;

  if (action === 'buscar') {
    const { barcode, codigo, nome } = body;
    const p = (barcode && db.buscarPorCodigoBarras(barcode)) ||
              (codigo && db.buscarPorCodigo(codigo)) ||
              (nome && db.buscarPorNome(nome));
    if (!p) return NextResponse.json({ found: false }, { status: 404 });
    return NextResponse.json({ found: true, produto: p });
  }

  if (action === 'sugerir') {
    const { nome } = body;
    const q = String(nome||'').toLowerCase();
    const list = db.listProdutos().filter(p => (p.ativo !== false) && p.nome.toLowerCase().includes(q)).slice(0, 8);
    return NextResponse.json({ results: list });
  }

  if (action === 'adicionar') {
    const { produtoId, quantidade = 1, valorUnitario } = body;
    const item = db.carrinhoAddItem(produtoId, quantidade, valorUnitario);
    if (!item) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    if ((item as any).error) return NextResponse.json({ error: (item as any).error }, { status: 400 });
    return NextResponse.json(item, { status: 201 });
  }

  if (action === 'remover') {
    const { itemId } = body;
    db.carrinhoRemoveItem(itemId);
    return NextResponse.json({ ok: true });
  }

  if (action === 'alterar') {
    const { itemId, quantidade, valorUnitario } = body;
    const it = db.carrinhoAlterarItem(itemId, quantidade, valorUnitario);
    if(!it) return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 });
    return NextResponse.json({ ok: true, item: it });
  }

  if (action === 'finalizar') {
    const { formaPagamento = 'Pix', cpf = null } = body as { formaPagamento: FormaPagamento, cpf?: string|null };
    const car = db.carrinhoGet();
    const venda = db.addVenda({ data: new Date().toISOString(), formaPagamento, cpf: cpf || undefined, itens: car.itens });
    db.carrinhoClear();
    return NextResponse.json({ ok: true, venda });
  }

  if (action === 'cancelar') {
    db.carrinhoClear();
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
}

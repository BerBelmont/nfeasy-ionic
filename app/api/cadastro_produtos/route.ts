import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/mockdb';
import { z } from 'zod';
const ProdutoSchema = z.object({
  codigo: z.string().min(1), nome: z.string().min(1), subgrupo: z.string().min(1),
  preco: z.number().nonnegative(),
  codigoBarras: z.string().optional().refine(v => !v || /(\d{8}|\d{12,14})/.test(v), 'EAN deve ter 8/12/13/14 dígitos'),
  unidade: z.enum(['UN','KG','L']), ncm: z.string().length(8),
  peso: z.number().nonnegative().optional(), cstIpi: z.string().optional(), cstCofins: z.string().optional(), cstPis: z.string().optional(),
  imagemUrl: z.string().optional(), ativo: z.boolean().default(true), estoque: z.number().int().nonnegative()
});
export async function GET(){ return NextResponse.json(db.listProdutos()); }
export async function POST(req: NextRequest){
  const body = await req.json(); const parsed = ProdutoSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  const novo = db.createProduto(parsed.data); return NextResponse.json(novo, { status: 201 });
}
export async function PUT(req: NextRequest){
  const body = await req.json(); const { id, ...rest } = body;
  if (!id) return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 });
  const parsed = ProdutoSchema.partial().safeParse(rest);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  const updated = db.updateProduto(String(id), parsed.data);
  if (!updated) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
  return NextResponse.json(updated);
}
export async function DELETE(req: NextRequest){
  const { searchParams } = new URL(req.url); const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 });
  const ok = db.deleteProduto(id); return NextResponse.json({ ok });
}

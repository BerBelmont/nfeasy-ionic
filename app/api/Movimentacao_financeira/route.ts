import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/mockdb';
import type { FormaPagamento } from '../../../types';
export async function GET(req: NextRequest){
  const { searchParams } = new URL(req.url);
  const periodo = searchParams.get('periodo') ?? 'hoje';
  const forma = searchParams.get('forma') as FormaPagamento | null;
  const now = new Date(); let start: Date; const end = new Date(now);
  if (periodo === 'semana') { const day = (now.getDay()+6)%7; start = new Date(now); start.setDate(now.getDate() - day); start.setHours(0,0,0,0); end.setHours(23,59,59,999); }
  else if (periodo === 'mes') { start = new Date(now.getFullYear(), now.getMonth(), 1); }
  else { start = new Date(now.getFullYear(), now.getMonth(), now.getDate()); }
  const vendas = db.listVendas(start, end, forma || undefined);
  return NextResponse.json({ periodo, forma: forma || 'Todas', totalRegistros: vendas.length,
    vendas: vendas.map(v => ({ codigo: v.id, formaPagamento: v.formaPagamento, cpf: v.cpf || null, valor: v.total, qnt: v.itens.reduce((s,i)=>s+i.quantidade,0), data: v.data })) });
}

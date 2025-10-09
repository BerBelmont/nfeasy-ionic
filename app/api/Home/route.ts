import { NextResponse } from 'next/server';
import { db } from '../../../lib/mockdb';
import type { DashboardResumo } from '../../../types';
export async function GET(){
  const hoje = new Date();
  const start = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const end = new Date(start); end.setDate(start.getDate()+1);
  const vendasHoje = db.listVendas(start, end);
  const faturamentoDiario = vendasHoje.reduce((s,v)=> s+v.total, 0);
  const totalVendasDia = vendasHoje.length;
  const ticketMedio = totalVendasDia ? +(faturamentoDiario/totalVendasDia).toFixed(2) : 0;
  const vendasPorHora = Array.from({length:24}, (_,h)=>({
    hora: h, sexta: Math.max(0, Math.round(Math.sin((h/24)*Math.PI)*300)),
    sabado: Math.max(0, Math.round(Math.sin((h/24)*Math.PI)*450)),
    domingo: Math.max(0, h>=18? Math.round(Math.sin(((h-10)/14)*Math.PI)*340):0),
  }));
  const baixo = db.listProdutos().filter(p => p.estoque <= 7).map(p => ({ codigo: p.codigo, produto: p.nome, quantidade: p.estoque, valor: p.preco }));
  const resumo: DashboardResumo = { faturamentoDiario, totalVendasDia, ticketMedio, vendasPorHora, baixoEstoque: baixo };
  return NextResponse.json(resumo);
}

import { NextRequest, NextResponse } from 'next/server';
import { vendas, gerarNumeroNF, Pagamento } from '../../_mock/db';

/**
 * POST /api/mov/confirmar
 * 
 * Finaliza uma venda em aberto (status ABERTA) e marca como FINALIZADA.
 * Aplica descontos/acréscimos e registra a forma de pagamento.
 * 
 * Body:
 * {
 *   "vendaId": "uuid-da-venda",
 *   "formaPagamento": "PIX" | "DINHEIRO" | "CREDITO" | "DEBITO" | "BOLETO",
 *   "descontoValor": 0,
 *   "acrescimoValor": 0
 * }
 * 
 * Retorna: Venda atualizada
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vendaId, formaPagamento, descontoValor, acrescimoValor } = body;

    // Validações
    if (!vendaId) {
      return NextResponse.json(
        { error: 'vendaId é obrigatório' },
        { status: 400 }
      );
    }

    if (!formaPagamento || !['PIX', 'DINHEIRO', 'CREDITO', 'DEBITO', 'BOLETO'].includes(formaPagamento)) {
      return NextResponse.json(
        { error: 'formaPagamento inválida. Use: PIX, DINHEIRO, CREDITO, DEBITO ou BOLETO' },
        { status: 400 }
      );
    }

    // Buscar venda
    const venda = vendas.find((v) => v.id === vendaId);

    if (!venda) {
      return NextResponse.json(
        { error: 'Venda não encontrada' },
        { status: 404 }
      );
    }

    if (venda.status !== 'ABERTA') {
      return NextResponse.json(
        { error: 'Apenas vendas com status ABERTA podem ser confirmadas' },
        { status: 400 }
      );
    }

    if (venda.itens.length === 0) {
      return NextResponse.json(
        { error: 'Não é possível confirmar venda sem itens' },
        { status: 400 }
      );
    }

    // Calcular total
    const subtotal = venda.itens.reduce((acc, item) => acc + item.subtotal, 0);
    const desconto = descontoValor || 0;
    const acrescimo = acrescimoValor || 0;
    const total = subtotal - desconto + acrescimo;

    // Atualizar venda
    venda.status = 'FINALIZADA';
    venda.formaPagamento = formaPagamento as Pagamento;
    venda.desconto = desconto;
    venda.acrescimo = acrescimo;
    venda.total = total;
    venda.dataFechamento = new Date().toISOString();
    
    // Gerar número de NF se não existir
    if (!venda.numeroNF) {
      venda.numeroNF = gerarNumeroNF();
    }

    return NextResponse.json(
      {
        message: 'Venda confirmada com sucesso',
        venda,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao confirmar venda:', error);
    return NextResponse.json(
      { error: 'Erro ao confirmar venda' },
      { status: 500 }
    );
  }
}

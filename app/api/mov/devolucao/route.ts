import { NextRequest, NextResponse } from 'next/server';
import { vendas, gerarNumeroNF, gerarUUID, Venda, ItemVenda } from '../../_mock/db';

/**
 * POST /api/mov/devolucao
 * 
 * Gera um documento de devolução vinculado a uma venda finalizada.
 * Pode ser devolução total ou parcial por item.
 * 
 * Body:
 * {
 *   "vendaOriginalId": "uuid-finalizada",
 *   "itens": [
 *     { "itemId": "uuid-item", "qtdDevolver": 1 }
 *   ],
 *   "motivo": "produto com defeito"
 * }
 * 
 * Retorna: Documento de devolução criado
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vendaOriginalId, itens, motivo } = body;

    // Validações
    if (!vendaOriginalId) {
      return NextResponse.json(
        { error: 'vendaOriginalId é obrigatório' },
        { status: 400 }
      );
    }

    if (!itens || !Array.isArray(itens) || itens.length === 0) {
      return NextResponse.json(
        { error: 'itens é obrigatório e deve conter ao menos um item' },
        { status: 400 }
      );
    }

    // Buscar venda original
    const vendaOriginal = vendas.find((v) => v.id === vendaOriginalId);

    if (!vendaOriginal) {
      return NextResponse.json(
        { error: 'Venda original não encontrada' },
        { status: 404 }
      );
    }

    if (vendaOriginal.status !== 'FINALIZADA') {
      return NextResponse.json(
        { error: 'Apenas vendas FINALIZADAS podem ser devolvidas' },
        { status: 400 }
      );
    }

    // Validar itens a devolver
    const itensDevolvidos: ItemVenda[] = [];
    let totalDevolucao = 0;

    for (const itemDev of itens) {
      const { itemId, qtdDevolver } = itemDev;

      if (!itemId || qtdDevolver === undefined || qtdDevolver <= 0) {
        return NextResponse.json(
          { error: 'itemId e qtdDevolver são obrigatórios e qtdDevolver deve ser maior que 0' },
          { status: 400 }
        );
      }

      // Buscar item na venda original
      const itemOriginal = vendaOriginal.itens.find((i) => i.itemId === itemId);

      if (!itemOriginal) {
        return NextResponse.json(
          { error: `Item ${itemId} não encontrado na venda original` },
          { status: 404 }
        );
      }

      // Validar quantidade
      if (qtdDevolver > itemOriginal.qtd) {
        return NextResponse.json(
          { error: `Quantidade a devolver (${qtdDevolver}) é maior que a quantidade vendida (${itemOriginal.qtd}) para o item ${itemOriginal.descricao}` },
          { status: 400 }
        );
      }

      // Criar item devolvido
      const subtotalDev = itemOriginal.valorUnit * qtdDevolver;
      itensDevolvidos.push({
        itemId: gerarUUID(),
        produtoId: itemOriginal.produtoId,
        descricao: itemOriginal.descricao,
        qtd: qtdDevolver,
        valorUnit: itemOriginal.valorUnit,
        subtotal: subtotalDev,
      });

      totalDevolucao += subtotalDev;
    }

    // Criar documento de devolução
    const devolucao: Venda = {
      id: gerarUUID(),
      tipo: 'DEVOLUCAO',
      numeroNF: gerarNumeroNF(),
      data: new Date().toISOString(),
      status: 'FINALIZADA',
      formaPagamento: vendaOriginal.formaPagamento,
      itens: itensDevolvidos,
      desconto: 0,
      acrescimo: 0,
      total: totalDevolucao,
      referenciaVendaId: vendaOriginalId,
      cliente: vendaOriginal.cliente,
      motivo: motivo || 'Não informado',
      dataFechamento: new Date().toISOString(),
    };

    // Adicionar devolução ao mock
    vendas.push(devolucao);

    // Comentário para o professor:
    // Em um sistema real, aqui seria atualizado o estoque dos produtos devolvidos
    // e possivelmente registrado em uma tabela de devoluções separada.
    // No mock, apenas adicionamos o documento de devolução à lista de vendas.

    return NextResponse.json(
      {
        message: 'Devolução registrada com sucesso',
        devolucao,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao registrar devolução:', error);
    return NextResponse.json(
      { error: 'Erro ao registrar devolução' },
      { status: 500 }
    );
  }
}

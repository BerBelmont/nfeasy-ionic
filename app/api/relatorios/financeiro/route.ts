import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { vendas, Pagamento, filtrarVendas, totaisPorPagamento, totalGeral, totalDevolucoes } from '../../_mock/db';

/**
 * POST /api/relatorios/financeiro
 * 
 * Gera um relatório financeiro em PDF com as vendas filtradas.
 * 
 * Body:
 * {
 *   "periodo": "hoje" | "semana" | "mes",
 *   "pagamentos": ["PIX", "DINHEIRO", ...],
 *   "vendasIds": ["uuid-1", "uuid-2", ...]
 * }
 * 
 * Retorna: PDF com cabeçalho, tabela de vendas e totais
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { periodo, pagamentos, vendasIds } = body;

    // Validações
    if (!periodo || !['hoje', 'semana', 'mes'].includes(periodo)) {
      return NextResponse.json(
        { error: 'Período inválido. Use: hoje, semana ou mes' },
        { status: 400 }
      );
    }

    // Filtrar vendas pelo período
    let vendasFiltradas = filtrarVendas(periodo, pagamentos as Pagamento[]);

    // Restringir aos IDs especificados se fornecidos
    if (vendasIds && Array.isArray(vendasIds) && vendasIds.length > 0) {
      vendasFiltradas = vendasFiltradas.filter((v) => vendasIds.includes(v.id));
    }

    // Gerar PDF
    const pdfBytes = await gerarPDF(vendasFiltradas, periodo, pagamentos);
    
    // Criar headers para response
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', `attachment; filename="relatorio_financeiro_${periodo}_${Date.now()}.pdf"`);
    headers.set('Content-Length', pdfBytes.length.toString());
    
    // Retornar PDF usando NextResponse com Uint8Array convertido para stream
    return new NextResponse(pdfBytes as any, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar relatório financeiro' },
      { status: 500 }
    );
  }
}

/**
 * Gera o PDF do relatório financeiro
 */
async function gerarPDF(
  vendasFiltradas: any[],
  periodo: string,
  pagamentos?: string[]
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const page = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();
  const fontSize = 10;
  const titleSize = 16;
  const subtitleSize = 12;

  let y = height - 50;

  // Cabeçalho
  page.drawText('RELATÓRIO FINANCEIRO - NFEASY', {
    x: 50,
    y,
    size: titleSize,
    font: timesRomanBold,
    color: rgb(0.043, 0.165, 0.235), // navy
  });

  y -= 25;
  const dataGeracao = new Date().toLocaleString('pt-BR');
  page.drawText(`Data de Geração: ${dataGeracao}`, {
    x: 50,
    y,
    size: fontSize,
    font: timesRomanFont,
  });

  y -= 15;
  const periodoText = periodo === 'hoje' ? 'Hoje' : periodo === 'semana' ? 'Esta Semana' : 'Este Mês';
  page.drawText(`Período: ${periodoText}`, {
    x: 50,
    y,
    size: fontSize,
    font: timesRomanFont,
  });

  y -= 15;
  const formasPagamentoText = pagamentos && pagamentos.length > 0
    ? pagamentos.join(', ')
    : 'Todas';
  page.drawText(`Formas de Pagamento: ${formasPagamentoText}`, {
    x: 50,
    y,
    size: fontSize,
    font: timesRomanFont,
  });

  y -= 30;

  // Linha separadora
  page.drawLine({
    start: { x: 50, y },
    end: { x: width - 50, y },
    thickness: 1,
    color: rgb(0.5, 0.5, 0.5),
  });

  y -= 20;

  // Cabeçalho da tabela
  page.drawText('Data', { x: 50, y, size: fontSize, font: timesRomanBold });
  page.drawText('NF', { x: 120, y, size: fontSize, font: timesRomanBold });
  page.drawText('Cliente', { x: 170, y, size: fontSize, font: timesRomanBold });
  page.drawText('Itens', { x: 270, y, size: fontSize, font: timesRomanBold });
  page.drawText('Pagamento', { x: 380, y, size: fontSize, font: timesRomanBold });
  page.drawText('Total', { x: 480, y, size: fontSize, font: timesRomanBold });

  y -= 15;

  // Linha abaixo do cabeçalho
  page.drawLine({
    start: { x: 50, y },
    end: { x: width - 50, y },
    thickness: 0.5,
    color: rgb(0.7, 0.7, 0.7),
  });

  y -= 15;

  // Vendas e Devoluções
  const vendas = vendasFiltradas.filter((v) => v.tipo === 'VENDA');
  const devolucoes = vendasFiltradas.filter((v) => v.tipo === 'DEVOLUCAO');

  // Listar vendas
  for (const venda of vendas) {
    if (y < 100) {
      // Nova página se necessário
      const newPage = pdfDoc.addPage([595, 842]);
      y = height - 50;
    }

    const dataVenda = new Date(venda.data).toLocaleDateString('pt-BR');
    const numeroNF = venda.numeroNF || '-';
    const cliente = venda.cliente?.nome || '-';
    const qtdItens = venda.itens.length;
    const pagamento = venda.formaPagamento || '-';
    const total = venda.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    page.drawText(dataVenda, { x: 50, y, size: fontSize - 1, font: timesRomanFont });
    page.drawText(numeroNF, { x: 120, y, size: fontSize - 1, font: timesRomanFont });
    page.drawText(cliente.substring(0, 15), { x: 170, y, size: fontSize - 1, font: timesRomanFont });
    page.drawText(`${qtdItens} item(ns)`, { x: 270, y, size: fontSize - 1, font: timesRomanFont });
    page.drawText(pagamento, { x: 380, y, size: fontSize - 1, font: timesRomanFont });
    page.drawText(total, { x: 480, y, size: fontSize - 1, font: timesRomanFont });

    y -= 12;
  }

  // Seção de Devoluções (se houver)
  if (devolucoes.length > 0) {
    y -= 10;
    page.drawText('DEVOLUÇÕES', { x: 50, y, size: subtitleSize, font: timesRomanBold, color: rgb(0.9, 0.3, 0.2) });
    y -= 15;

    for (const dev of devolucoes) {
      if (y < 100) {
        const newPage = pdfDoc.addPage([595, 842]);
        y = height - 50;
      }

      const dataVenda = new Date(dev.data).toLocaleDateString('pt-BR');
      const numeroNF = dev.numeroNF || '-';
      const motivo = dev.motivo || 'Não informado';
      const qtdItens = dev.itens.length;
      const total = dev.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

      page.drawText(dataVenda, { x: 50, y, size: fontSize - 1, font: timesRomanFont });
      page.drawText(numeroNF, { x: 120, y, size: fontSize - 1, font: timesRomanFont });
      page.drawText(motivo.substring(0, 20), { x: 170, y, size: fontSize - 1, font: timesRomanFont });
      page.drawText(`${qtdItens} item(ns)`, { x: 270, y, size: fontSize - 1, font: timesRomanFont });
      page.drawText('DEVOLUÇÃO', { x: 380, y, size: fontSize - 1, font: timesRomanFont });
      page.drawText(`-${total}`, { x: 480, y, size: fontSize - 1, font: timesRomanFont, color: rgb(0.9, 0.3, 0.2) });

      y -= 12;
    }
  }

  y -= 20;

  // Linha antes dos totais
  page.drawLine({
    start: { x: 50, y },
    end: { x: width - 50, y },
    thickness: 1,
    color: rgb(0.5, 0.5, 0.5),
  });

  y -= 20;

  // Totais por forma de pagamento
  page.drawText('TOTAIS POR FORMA DE PAGAMENTO', { x: 50, y, size: subtitleSize, font: timesRomanBold });
  y -= 18;

  const totais = totaisPorPagamento(vendasFiltradas);
  for (const [forma, valor] of Object.entries(totais)) {
    if (valor !== 0) {
      const valorText = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      page.drawText(`${forma}:`, { x: 50, y, size: fontSize, font: timesRomanFont });
      page.drawText(valorText, { x: 480, y, size: fontSize, font: timesRomanFont });
      y -= 12;
    }
  }

  y -= 10;

  // Total Geral
  const totalGeralValor = totalGeral(vendasFiltradas);
  const totalDevolucaoValor = totalDevolucoes(vendasFiltradas);

  if (totalDevolucaoValor > 0) {
    page.drawText('Total Vendas:', { x: 50, y, size: fontSize, font: timesRomanBold });
    const totalVendas = (totalGeralValor + totalDevolucaoValor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    page.drawText(totalVendas, { x: 480, y, size: fontSize, font: timesRomanBold });
    y -= 12;

    page.drawText('Total Devoluções:', { x: 50, y, size: fontSize, font: timesRomanBold, color: rgb(0.9, 0.3, 0.2) });
    const totalDevText = totalDevolucaoValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    page.drawText(`-${totalDevText}`, { x: 480, y, size: fontSize, font: timesRomanBold, color: rgb(0.9, 0.3, 0.2) });
    y -= 12;
  }

  page.drawText('TOTAL LÍQUIDO:', { x: 50, y, size: subtitleSize, font: timesRomanBold, color: rgb(0.043, 0.165, 0.235) });
  const totalText = totalGeralValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  page.drawText(totalText, { x: 480, y, size: subtitleSize, font: timesRomanBold, color: rgb(0.043, 0.165, 0.235) });

  // Rodapé
  page.drawText(`Gerado por NFEasy - ${new Date().toLocaleDateString('pt-BR')}`, {
    x: 50,
    y: 30,
    size: 8,
    font: timesRomanFont,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

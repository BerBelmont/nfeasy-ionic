'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';
import { authFetch } from '@/lib/authFetch';

interface ItemVenda {
  itemId: string;
  produtoId: string;
  descricao: string;
  qtd: number;
  valorUnit: number;
  subtotal: number;
}

interface Venda {
  id: string;
  tipo: 'VENDA' | 'DEVOLUCAO';
  numeroNF?: string;
  data: string;
  status: 'ABERTA' | 'FINALIZADA';
  formaPagamento?: string;
  itens: ItemVenda[];
  desconto?: number;
  acrescimo?: number;
  total: number;
  referenciaVendaId?: string;
  cliente?: { id?: string; nome?: string; cpf?: string } | null;
  motivo?: string;
}

interface ItemDevolucao {
  itemId: string;
  descricao: string;
  qtdVendida: number;
  qtdDevolver: number;
}

export default function MovFinanceiraPage() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [busca, setBusca] = useState('');
  const [periodo, setPeriodo] = useState<'hoje' | 'semana' | 'mes'>('hoje');
  const [forma, setForma] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estado para devolução
  const [modalDevolucao, setModalDevolucao] = useState(false);
  const [vendaParaDevolver, setVendaParaDevolver] = useState<Venda | null>(null);
  const [itensDevolucao, setItensDevolucao] = useState<ItemDevolucao[]>([]);
  const [motivoDevolucao, setMotivoDevolucao] = useState('');

  const loadData = async () => {
    try {
      const { filtrarVendas } = await import('../api/_mock/db');
      const formasPagamento = forma ? [forma.toUpperCase()] : undefined;
      const vendasFiltradas = filtrarVendas(periodo as any, formasPagamento as any);
      setVendas(vendasFiltradas as any);
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
      const { vendas: todasVendas } = await import('../api/_mock/db');
      setVendas(todasVendas as any);
    }
  };

  useEffect(() => {
    loadData();
  }, [periodo, forma]);

  const filteredVendas = vendas.filter((v) => {
    if (!busca) return true;
    const searchText = JSON.stringify(v).toLowerCase();
    return searchText.includes(busca.toLowerCase());
  });

  // Gerar relatório PDF
  const handleGerarRelatorio = async () => {
    try {
      setLoading(true);
      
      const formasPagamento = forma ? [forma.toUpperCase()] : ['PIX', 'DINHEIRO', 'CREDITO', 'DEBITO', 'BOLETO'];
      const vendasIds = filteredVendas.map((v) => v.id);

      const res = await authFetch('/api/relatorios/financeiro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          periodo,
          pagamentos: formasPagamento,
          vendasIds,
        }),
      });

      if (!res.ok) {
        throw new Error('Erro ao gerar relatório');
      }

      // Download do PDF
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio_financeiro_${periodo}_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      alert('Relatório gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar relatório. Verifique o console.');
    } finally {
      setLoading(false);
    }
  };

  // Confirmar venda
  const handleConfirmar = async (venda: Venda) => {
    if (!venda.formaPagamento) {
      alert('Selecione uma forma de pagamento antes de confirmar.');
      return;
    }

    if (venda.itens.length === 0) {
      alert('Não é possível confirmar uma venda sem itens.');
      return;
    }

    try {
      const res = await authFetch('/api/mov/confirmar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendaId: venda.id,
          formaPagamento: venda.formaPagamento,
          descontoValor: venda.desconto || 0,
          acrescimoValor: venda.acrescimo || 0,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao confirmar venda');
      }

      alert('Venda confirmada com sucesso!');
      await loadData();
    } catch (error: any) {
      console.error('Erro ao confirmar venda:', error);
      alert(error.message || 'Erro ao confirmar venda');
    }
  };

  // Abrir modal de devolução
  const handleAbrirDevolucao = (venda: Venda) => {
    if (venda.status !== 'FINALIZADA') {
      alert('Apenas vendas finalizadas podem ser devolvidas.');
      return;
    }

    setVendaParaDevolver(venda);
    setItensDevolucao(
      venda.itens.map((item) => ({
        itemId: item.itemId,
        descricao: item.descricao,
        qtdVendida: item.qtd,
        qtdDevolver: 0,
      }))
    );
    setMotivoDevolucao('');
    setModalDevolucao(true);
  };

  // Marcar devolução total
  const handleDevolucaoTotal = () => {
    setItensDevolucao((prev) =>
      prev.map((item) => ({ ...item, qtdDevolver: item.qtdVendida }))
    );
  };

  // Confirmar devolução
  const handleConfirmarDevolucao = async () => {
    if (!vendaParaDevolver) return;

    const itensParaDevolver = itensDevolucao.filter((item) => item.qtdDevolver > 0);

    if (itensParaDevolver.length === 0) {
      alert('Selecione ao menos um item para devolver.');
      return;
    }

    // Validar quantidades
    for (const item of itensParaDevolver) {
      if (item.qtdDevolver > item.qtdVendida) {
        alert(`Quantidade a devolver de "${item.descricao}" é maior que a vendida.`);
        return;
      }
    }

    try {
      const res = await authFetch('/api/mov/devolucao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendaOriginalId: vendaParaDevolver.id,
          itens: itensParaDevolver.map((item) => ({
            itemId: item.itemId,
            qtdDevolver: item.qtdDevolver,
          })),
          motivo: motivoDevolucao,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao registrar devolução');
      }

      alert('Devolução registrada com sucesso!');
      setModalDevolucao(false);
      await loadData();
    } catch (error: any) {
      console.error('Erro ao registrar devolução:', error);
      alert(error.message || 'Erro ao registrar devolução');
    }
  };

  return (
    <AuthGuard>
      <div className="app">
        <Sidebar />
        <main className="main">
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'space-between' }}>
              <div style={{ flex: 1, display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  className="input"
                  style={{ flex: 1 }}
                  placeholder="Buscar..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
                <div className="pills">
                  <button
                    className={`pill ${periodo === 'hoje' ? 'active' : ''}`}
                    onClick={() => setPeriodo('hoje')}
                  >
                    Hoje
                  </button>
                  <button
                    className={`pill ${periodo === 'semana' ? 'active' : ''}`}
                    onClick={() => setPeriodo('semana')}
                  >
                    Semana
                  </button>
                  <button
                    className={`pill ${periodo === 'mes' ? 'active' : ''}`}
                    onClick={() => setPeriodo('mes')}
                  >
                    Mês
                  </button>
                </div>
              </div>
              <div>
                <select className="input" value={forma} onChange={(e) => setForma(e.target.value)}>
                  <option value="">Todas as Formas</option>
                  <option value="PIX">PIX</option>
                  <option value="DINHEIRO">Dinheiro</option>
                  <option value="CREDITO">Crédito</option>
                  <option value="DEBITO">Débito</option>
                  <option value="BOLETO">Boleto</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '12px' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>NF</th>
                    <th>Data</th>
                    <th>Cliente</th>
                    <th>Forma</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendas.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', color: '#9aa0a6' }}>
                        Nenhuma venda encontrada
                      </td>
                    </tr>
                  ) : (
                    filteredVendas.map((v) => (
                      <tr key={v.id}>
                        <td>
                          <span style={{ 
                            color: v.tipo === 'DEVOLUCAO' ? '#e74c3c' : '#27ae60',
                            fontWeight: 'bold'
                          }}>
                            {v.tipo}
                          </span>
                        </td>
                        <td>{v.numeroNF || '-'}</td>
                        <td>{new Date(v.data).toLocaleDateString('pt-BR')}</td>
                        <td>{v.cliente?.nome || '-'}</td>
                        <td>{v.formaPagamento || '-'}</td>
                        <td>
                          <span style={{ color: v.tipo === 'DEVOLUCAO' ? '#e74c3c' : 'inherit' }}>
                            {v.tipo === 'DEVOLUCAO' && '-'}
                            {v.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                        </td>
                        <td>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            background: v.status === 'FINALIZADA' ? '#d4edda' : '#fff3cd',
                            color: v.status === 'FINALIZADA' ? '#155724' : '#856404',
                          }}>
                            {v.status}
                          </span>
                        </td>
                        <td>
                          {v.status === 'ABERTA' && (
                            <button
                              onClick={() => handleConfirmar(v)}
                              style={{
                                padding: '4px 8px',
                                background: '#27ae60',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                              }}
                            >
                              Confirmar
                            </button>
                          )}
                          {v.status === 'FINALIZADA' && v.tipo === 'VENDA' && (
                            <button
                              onClick={() => handleAbrirDevolucao(v)}
                              style={{
                                padding: '4px 8px',
                                background: '#e74c3c',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                              }}
                            >
                              Devolver
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'space-between', marginTop: '22px' }}>
              <button 
                className="btn navy" 
                onClick={handleGerarRelatorio}
                disabled={loading}
                style={{ opacity: loading ? 0.6 : 1 }}
              >
                {loading ? 'Gerando...' : 'Relatório Financeiro'}
              </button>
              <div style={{ color: '#666', fontSize: '14px', alignSelf: 'center' }}>
                Total de registros: {filteredVendas.length}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal de Devolução */}
      {modalDevolucao && vendaParaDevolver && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setModalDevolucao(false)}
        >
          <div
            className="card"
            style={{
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
              padding: '24px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0 }}>Devolução - NF {vendaParaDevolver.numeroNF}</h2>
            
            <p style={{ color: '#666' }}>
              Selecione os itens e quantidades a devolver:
            </p>

            <div style={{ marginBottom: '16px' }}>
              {itensDevolucao.map((item, index) => (
                <div
                  key={item.itemId}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '3fr 1fr 1fr',
                    gap: '12px',
                    alignItems: 'center',
                    padding: '12px',
                    background: '#f9f9f9',
                    borderRadius: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <div>
                    <strong>{item.descricao}</strong>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      Vendido: {item.qtdVendida}
                    </div>
                  </div>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '12px' }}>Devolver:</span>
                    <input
                      type="number"
                      className="input"
                      min="0"
                      max={item.qtdVendida}
                      value={item.qtdDevolver}
                      onChange={(e) => {
                        const valor = parseInt(e.target.value) || 0;
                        setItensDevolucao((prev) =>
                          prev.map((it, i) =>
                            i === index ? { ...it, qtdDevolver: Math.min(valor, it.qtdVendida) } : it
                          )
                        );
                      }}
                      style={{ height: '36px' }}
                    />
                  </label>
                </div>
              ))}
            </div>

            <button
              className="btn"
              onClick={handleDevolucaoTotal}
              style={{ width: '100%', marginBottom: '16px', background: '#3b79c5' }}
            >
              Marcar Devolução Total
            </button>

            <label style={{ display: 'block', marginBottom: '16px' }}>
              <span style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Motivo da Devolução:
              </span>
              <textarea
                className="input"
                value={motivoDevolucao}
                onChange={(e) => setMotivoDevolucao(e.target.value)}
                placeholder="Ex: Produto com defeito, troca, etc..."
                style={{ minHeight: '80px', resize: 'vertical' }}
              />
            </label>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="btn red"
                onClick={() => setModalDevolucao(false)}
                style={{ flex: 1 }}
              >
                Cancelar
              </button>
              <button
                className="btn green"
                onClick={handleConfirmarDevolucao}
                style={{ flex: 1 }}
              >
                Confirmar Devolução
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}

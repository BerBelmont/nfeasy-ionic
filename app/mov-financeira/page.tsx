'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';
import { authFetch } from '@/lib/authFetch';

interface Venda {
  codigo: string;
  formaPagamento: string;
  cpf?: string;
  valor: number;
  qnt: number;
}

interface MovimentacaoData {
  vendas: Venda[];
  total: number;
}

export default function MovFinanceiraPage() {
  const [data, setData] = useState<MovimentacaoData>({ vendas: [], total: 0 });
  const [busca, setBusca] = useState('');
  const [periodo, setPeriodo] = useState('hoje');
  const [forma, setForma] = useState('');

  const loadData = async () => {
    const url = `/api/Movimentacao_financeira?periodo=${periodo}${forma ? `&forma=${forma}` : ''}`;
    const res = await authFetch(url);
    const movData = await res.json();
    setData(movData);
  };

  useEffect(() => {
    loadData();
  }, [periodo, forma]);

  const filteredVendas = data.vendas.filter((v) => {
    if (!busca) return true;
    return JSON.stringify(v).toLowerCase().includes(busca.toLowerCase());
  });

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
                  <option value="">Forma de Pagamento</option>
                  <option>Pix</option>
                  <option>Dinheiro</option>
                  <option>Crédito</option>
                  <option>Débito</option>
                  <option>Boleto</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '12px' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Forma de pagamento</th>
                    <th>CPF</th>
                    <th>Valor</th>
                    <th>Qnt</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendas.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', color: '#9aa0a6' }}>
                        Nenhuma venda encontrada
                      </td>
                    </tr>
                  ) : (
                    filteredVendas.map((v, i) => (
                      <tr key={i}>
                        <td>{v.codigo}</td>
                        <td>{v.formaPagamento}</td>
                        <td>{v.cpf || ''}</td>
                        <td>{(v.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        <td>{v.qnt}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'space-between', marginTop: '22px' }}>
              <button className="btn navy">Relatório Financeiro</button>
              <div style={{ display: 'flex', gap: '20px' }}>
                <button className="btn red">Devolução ✖</button>
                <button className="btn green">Confirmar $</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

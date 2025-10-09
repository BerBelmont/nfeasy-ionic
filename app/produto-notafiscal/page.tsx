'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';
import { authFetch } from '@/lib/authFetch';

interface Produto {
  id: string;
  codigo: string;
  nome: string;
  preco: number;
  imagemUrl?: string;
}

interface ItemCarrinho {
  id: string;
  codigo: string;
  produto: string;
  valor: number;
  un: string;
}

interface CarrinhoData {
  itens: ItemCarrinho[];
  total: number;
}

export default function ProdutoNotaFiscalPage() {
  const [carrinho, setCarrinho] = useState<CarrinhoData>({ itens: [], total: 0 });
  const [produtoNome, setProdutoNome] = useState('');
  const [codigoBarras, setCodigoBarras] = useState('');
  const [valorUnitario, setValorUnitario] = useState('');
  const [imagemProduto, setImagemProduto] = useState('');
  const [currentProduto, setCurrentProduto] = useState<Produto | null>(null);
  const [sugestoes, setSugestoes] = useState<Produto[]>([]);
  const [showSugestoes, setShowSugestoes] = useState(false);

  const loadCarrinho = async () => {
    const res = await authFetch('/api/produtos_notafiscal');
    const data = await res.json();
    setCarrinho(data);
  };

  useEffect(() => {
    loadCarrinho();
  }, []);

  const adicionarProduto = async (produto: Produto, quantidade = 1) => {
    const res = await authFetch('/api/produtos_notafiscal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'adicionar',
        produtoId: produto.id,
        quantidade,
        valorUnitario: produto.preco,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data?.error || 'Erro ao adicionar produto');
      return;
    }

    setProdutoNome('');
    setCodigoBarras('');
    setValorUnitario('');
    setShowSugestoes(false);
    await loadCarrinho();
  };

  const handleCodigoBarrasKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;

    const valor = codigoBarras.trim();
    if (!valor) return;

    const res = await authFetch('/api/produtos_notafiscal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'buscar', barcode: valor, codigo: valor }),
    });

    if (res.ok) {
      const d = await res.json();
      const produto = d.produto as Produto;
      setCurrentProduto(produto);
      if (produto?.imagemUrl) setImagemProduto(produto.imagemUrl);
      setProdutoNome(produto.nome);
      setValorUnitario(String(produto.preco).replace('.', ','));
      await adicionarProduto(produto, 1);
    } else {
      alert('Produto não encontrado');
    }
  };

  const handleProdutoNomeChange = (valor: string) => {
    setProdutoNome(valor);

    if (valor.trim().length < 2) {
      setShowSugestoes(false);
      return;
    }

    // Debounce search
    setTimeout(async () => {
      const res = await authFetch('/api/produtos_notafiscal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sugerir', nome: valor }),
      });

      const d = await res.json();
      setSugestoes(d.results || []);
      setShowSugestoes((d.results || []).length > 0);
    }, 200);
  };

  const handleSelecionarSugestao = async (produto: Produto) => {
    setShowSugestoes(false);
    setCurrentProduto(produto);
    if (produto.imagemUrl) setImagemProduto(produto.imagemUrl);
    setProdutoNome(produto.nome);
    setValorUnitario(String(produto.preco).replace('.', ','));
    await adicionarProduto(produto, 1);
  };

  const handleRemoverItem = async (itemId: string) => {
    await authFetch('/api/produtos_notafiscal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'remover', itemId }),
    });
    await loadCarrinho();
  };

  const handleCancelar = async () => {
    await authFetch('/api/produtos_notafiscal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'cancelar' }),
    });
    await loadCarrinho();
  };

  const handleFinalizar = async () => {
    const forma = prompt('Forma de pagamento (Pix/Dinheiro/Crédito/Débito/Boleto)?', 'Pix') || 'Pix';
    const cpf = prompt('CPF (opcional)') || null;

    const res = await authFetch('/api/produtos_notafiscal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'finalizar', formaPagamento: forma, cpf }),
    });

    const d = await res.json();
    if (!res.ok) {
      alert(d?.error || 'Erro ao finalizar venda');
      return;
    }

    alert(
      'Venda concluída. Total: ' +
        (d.venda?.total || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    );
    await loadCarrinho();
  };

  return (
    <AuthGuard>
      <div className="app">
        <Sidebar />
        <main className="main">
          <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: '26px' }}>
            <div className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  height: '300px',
                  background: '#ddd',
                  border: '1px solid #bbb',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {imagemProduto && (
                  <img src={imagemProduto} alt="Produto" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                )}
              </div>

              <label>
                Produto:
                <div className="suggest">
                  <input
                    className="input"
                    placeholder=""
                    value={produtoNome}
                    onChange={(e) => handleProdutoNomeChange(e.target.value)}
                  />
                  {showSugestoes && (
                    <div className="suggest-list" style={{ display: 'block' }}>
                      {sugestoes.map((p) => (
                        <div
                          key={p.id}
                          className="suggest-item"
                          onClick={() => handleSelecionarSugestao(p)}
                        >
                          {p.codigo} — {p.nome}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </label>

              <label>
                Código de barras:
                <input
                  className="input"
                  placeholder="Digite/escaneie e pressione Enter"
                  value={codigoBarras}
                  onChange={(e) => setCodigoBarras(e.target.value)}
                  onKeyDown={handleCodigoBarrasKeyDown}
                />
              </label>

              <label>
                Valor unitário:
                <input
                  className="input"
                  placeholder="0,00"
                  value={valorUnitario}
                  onChange={(e) => setValorUnitario(e.target.value)}
                />
              </label>

              <div className="big-total">{carrinho.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            </div>

            <div className="card" style={{ padding: '12px' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: '120px' }}>Código</th>
                    <th>Produto</th>
                    <th style={{ width: '140px' }}>Valor</th>
                    <th style={{ width: '80px' }}>Un.</th>
                    <th style={{ width: '100px' }}>-</th>
                  </tr>
                </thead>
                <tbody>
                  {carrinho.itens.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ height: '340px' }}>
                        Carrinho vazio.
                      </td>
                    </tr>
                  ) : (
                    carrinho.itens.map((item) => (
                      <tr key={item.id}>
                        <td>{item.codigo}</td>
                        <td>{item.produto}</td>
                        <td>{item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        <td>{item.un}</td>
                        <td>
                          <button onClick={() => handleRemoverItem(item.id)}>Remover</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <div style={{ display: 'flex', gap: '24px', justifyContent: 'space-between', marginTop: '18px' }}>
                <button className="btn red" onClick={handleCancelar}>
                  Cancelar ❗
                </button>
                <button className="btn green" onClick={handleFinalizar}>
                  Finalizar $
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

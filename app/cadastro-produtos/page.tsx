'use client';

import { useEffect, useState, FormEvent } from 'react';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';
import { authFetch } from '@/lib/authFetch';

interface Produto {
  id?: string;
  codigo: string;
  nome: string;
  subgrupo: string;
  preco: number;
  codigoBarras?: string;
  unidade?: string;
  ncm: string;
  peso?: number;
  cstIpi?: string;
  cstCofins?: string;
  cstPis?: string;
  imagemUrl?: string;
  ativo: boolean;
  estoque: number;
}

export default function CadastroProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [form, setForm] = useState<Produto>({
    codigo: '',
    nome: '',
    subgrupo: 'Mercearia',
    preco: 0,
    codigoBarras: '',
    unidade: 'UN',
    ncm: '',
    peso: 0,
    cstIpi: '',
    cstCofins: '',
    cstPis: '',
    ativo: true,
    estoque: 0,
  });

  const loadProdutos = async () => {
    const res = await authFetch('/api/cadastro_produtos');
    const list = await res.json();
    setProdutos(list);
  };

  useEffect(() => {
    loadProdutos();
  }, []);

  const handleSalvar = async () => {
    if (!form.codigo || !form.nome || !form.subgrupo || !form.unidade || !form.ncm) {
      alert('Preencha os campos obrigatórios');
      return;
    }

    if (!/^\d{8}$/.test(form.ncm)) {
      alert('Use 8 dígitos no NCM');
      return;
    }

    const res = await authFetch('/api/cadastro_produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const err = await res.json();
      alert('Erro: ' + (err?.error ? JSON.stringify(err.error) : res.statusText));
      return;
    }

    await loadProdutos();
    alert('Salvo!');
    handleLimpar();
  };

  const handleLimpar = () => {
    setForm({
      codigo: '',
      nome: '',
      subgrupo: 'Mercearia',
      preco: 0,
      codigoBarras: '',
      unidade: 'UN',
      ncm: '',
      peso: 0,
      cstIpi: '',
      cstCofins: '',
      cstPis: '',
      ativo: true,
      estoque: 0,
    });
  };

  const handleEditar = (produto: Produto) => {
    setForm(produto);
  };

  return (
    <AuthGuard>
      <div className="app">
        <Sidebar />
        <main className="main">
          <div className="card">
            <div className="center-title" style={{ letterSpacing: '.5px' }}>
              CADASTRO DE PRODUTOS
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '520px 1fr', gap: '40px' }}>
              <div style={{ display: 'grid', gap: '14px' }}>
                <label style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px', alignItems: 'center' }}>
                  <span>Código</span>
                  <input
                    className="input"
                    value={form.codigo}
                    onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                  />
                </label>

                <label style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px', alignItems: 'center' }}>
                  <span>Produto</span>
                  <input
                    className="input"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  />
                </label>

                <label style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px', alignItems: 'center' }}>
                  <span>Subgrupo</span>
                  <select
                    className="input"
                    value={form.subgrupo}
                    onChange={(e) => setForm({ ...form, subgrupo: e.target.value })}
                  >
                    <option>Mercearia</option>
                    <option>Frios</option>
                    <option>Higiene</option>
                    <option>Limpeza</option>
                    <option>Bebidas</option>
                  </select>
                </label>

                <label style={{ display: 'grid', gridTemplateColumns: '120px 220px', gap: '16px', alignItems: 'center' }}>
                  <span>Preço</span>
                  <input
                    className="input"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.preco}
                    onChange={(e) => setForm({ ...form, preco: Number(e.target.value) })}
                  />
                </label>

                <label style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px', alignItems: 'center' }}>
                  <span>Cód. Barras</span>
                  <input
                    className="input"
                    value={form.codigoBarras}
                    onChange={(e) => setForm({ ...form, codigoBarras: e.target.value })}
                  />
                </label>

                <label style={{ display: 'grid', gridTemplateColumns: '120px 160px', gap: '16px', alignItems: 'center' }}>
                  <span>Un. Medida</span>
                  <select
                    className="input"
                    value={form.unidade}
                    onChange={(e) => setForm({ ...form, unidade: e.target.value })}
                  >
                    <option>UN</option>
                    <option>KG</option>
                    <option>L</option>
                  </select>
                </label>

                <label style={{ display: 'grid', gridTemplateColumns: '120px 340px', gap: '16px', alignItems: 'center' }}>
                  <span>NCM</span>
                  <input
                    className="input"
                    placeholder="8 dígitos"
                    value={form.ncm}
                    onChange={(e) => setForm({ ...form, ncm: e.target.value })}
                  />
                </label>

                <label style={{ display: 'grid', gridTemplateColumns: '120px 160px', gap: '16px', alignItems: 'center' }}>
                  <span>Peso</span>
                  <input
                    className="input"
                    type="number"
                    min="0"
                    step="0.001"
                    value={form.peso}
                    onChange={(e) => setForm({ ...form, peso: Number(e.target.value) })}
                  />
                </label>

                <label style={{ display: 'grid', gridTemplateColumns: '120px 160px', gap: '16px', alignItems: 'center' }}>
                  <span>CST Ipi</span>
                  <input
                    className="input"
                    value={form.cstIpi}
                    onChange={(e) => setForm({ ...form, cstIpi: e.target.value })}
                  />
                </label>

                <label style={{ display: 'grid', gridTemplateColumns: '120px 160px', gap: '16px', alignItems: 'center' }}>
                  <span>CST Cofins</span>
                  <input
                    className="input"
                    value={form.cstCofins}
                    onChange={(e) => setForm({ ...form, cstCofins: e.target.value })}
                  />
                </label>

                <label style={{ display: 'grid', gridTemplateColumns: '120px 160px', gap: '16px', alignItems: 'center' }}>
                  <span>CST Pis</span>
                  <input
                    className="input"
                    value={form.cstPis}
                    onChange={(e) => setForm({ ...form, cstPis: e.target.value })}
                  />
                </label>

                <label style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px', alignItems: 'center' }}>
                  <span>Imagem</span>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '320px', height: '200px', background: '#ddd', border: '1px solid #bbb', borderRadius: '8px' }}></div>
                    <button className="btn" style={{ background: '#cfd3d6', color: '#333' }} type="button">
                      Selecionar
                    </button>
                  </div>
                </label>

                <label style={{ display: 'grid', gridTemplateColumns: '120px 180px', gap: '16px', alignItems: 'center' }}>
                  <span>Ativo</span>
                  <select
                    className="input"
                    value={String(form.ativo)}
                    onChange={(e) => setForm({ ...form, ativo: e.target.value === 'true' })}
                  >
                    <option value="true">Ativo</option>
                    <option value="false">Inativo</option>
                  </select>
                </label>

                <label style={{ display: 'grid', gridTemplateColumns: '120px 140px', gap: '16px', alignItems: 'center' }}>
                  <span>Estoque</span>
                  <input
                    className="input"
                    type="number"
                    min="0"
                    step="1"
                    value={form.estoque}
                    onChange={(e) => setForm({ ...form, estoque: Number(e.target.value) })}
                  />
                </label>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn red" title="Excluir" type="button">
                    🗑
                  </button>
                  <button className="btn green" onClick={handleSalvar} title="Salvar" type="button">
                    ✅
                  </button>
                  <button className="btn navy" onClick={handleLimpar} title="Limpar" type="button">
                    🔎
                  </button>
                </div>
              </div>

              <div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Nome</th>
                      <th>Preço</th>
                      <th>Estoque</th>
                      <th>Ativo</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.map((p) => (
                      <tr key={p.id}>
                        <td>{p.codigo}</td>
                        <td>{p.nome}</td>
                        <td>{p.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        <td>{p.estoque}</td>
                        <td>{p.ativo !== false ? 'Sim' : 'Não'}</td>
                        <td>
                          <button onClick={() => handleEditar(p)}>Editar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

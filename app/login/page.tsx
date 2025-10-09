'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { setToken, setRole } from '@/lib/authFetch';

export default function LoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch('/api/Login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: usuario.trim(), senha: senha.trim() }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data?.message || 'Falha no login');
      return;
    }

    setToken(data.token);
    setRole(data.role);

    if (data.role === 'caixa') {
      router.push('/produto-notafiscal');
    } else {
      router.push('/home');
    }
  };

  return (
    <div style={{ background: '#09253a', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{
        width: '540px',
        background: '#f6f6f6',
        borderRadius: '16px',
        border: '1px solid #dadde1',
        padding: '32px 40px',
        boxShadow: '0 18px 40px rgba(0,0,0,.25)'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center', margin: '6px 0 12px' }}>
          <svg viewBox="0 0 24 24" fill="#3b79c5" style={{ width: '40px', height: '40px' }}>
            <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM14 2v4a1 1 0 0 0 1 1h4" />
          </svg>
          <div style={{ fontWeight: 800, fontSize: '28px', color: '#0b2a3c' }}>NF Easy</div>
        </div>
        <h1 style={{ margin: '0 0 14px', fontSize: '40px', textAlign: 'center' }}>Login</h1>
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginTop: '12px' }}>
            Usuário{' '}
            <input
              className="input"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="admin ou caixa"
            />
          </label>
          <label style={{ display: 'block', marginTop: '12px' }}>
            Senha{' '}
            <input
              className="input"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="1234"
            />
          </label>
          <button className="btn green" type="submit" style={{ width: '100%', marginTop: '18px' }}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

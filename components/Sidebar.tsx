'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();
  const [role, setRole] = useState<string>('admin');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userRole = localStorage.getItem('nf_role') || 'admin';
      setRole(userRole);
    }
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nf_token');
      localStorage.removeItem('nf_role');
    }
    router.push('/login');
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (role === 'caixa') {
      const allowed = href.includes('produto-notafiscal') || href.includes('cadastro-produtos');
      if (!allowed) {
        e.preventDefault();
        alert('Permissão negada');
      }
    }
  };

  return (
    <aside className="aside">
      <div className="brand">NF Easy</div>
      <Link 
        href="/produto-notafiscal" 
        className="navbtn"
        onClick={(e) => handleNavClick(e, '/produto-notafiscal')}
      >
        NFCE
      </Link>
      <Link 
        href="/cadastro-produtos" 
        className="navbtn"
        onClick={(e) => handleNavClick(e, '/cadastro-produtos')}
      >
        Produtos
      </Link>
      <Link 
        href="/mov-financeira" 
        className="navbtn"
        onClick={(e) => handleNavClick(e, '/mov-financeira')}
      >
        Financeiro
      </Link>
      <button className="iconbtn" onClick={handleLogout}>
        ⤴
      </button>
    </aside>
  );
}

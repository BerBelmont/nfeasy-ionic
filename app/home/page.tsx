'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';
import { authFetch } from '@/lib/authFetch';

// Dynamic import for Chart.js to avoid SSR issues
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-chartjs-2').then(mod => mod.Bar), { ssr: false });

// Register Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface VendaPorHora {
  hora: string;
  sexta: number;
  sabado: number;
  domingo: number;
}

interface ProdutoBaixoEstoque {
  codigo: string;
  produto: string;
  quantidade: number;
  valor: number;
}

interface HomeData {
  faturamentoDiario: number;
  totalVendasDia: number;
  ticketMedio: number;
  vendasPorHora: VendaPorHora[];
  baixoEstoque: ProdutoBaixoEstoque[];
}

export default function HomePage() {
  const [data, setData] = useState<HomeData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const res = await authFetch('/api/Home');
      const homeData = await res.json();
      setData(homeData);
    };

    loadData();
  }, []);

  const chartData = data
    ? {
        labels: data.vendasPorHora.map((v) => v.hora),
        datasets: [
          {
            label: 'Sexta',
            data: data.vendasPorHora.map((v) => v.sexta),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'Sábado',
            data: data.vendasPorHora.map((v) => v.sabado),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
          },
          {
            label: 'Domingo',
            data: data.vendasPorHora.map((v) => v.domingo),
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Horas',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Valor Faturado',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <AuthGuard>
      <div className="app">
        <Sidebar />
        <main className="main">
          <div className="chartwrap">
            <h2 className="center-title" style={{ margin: '6px 0 6px' }}>
              Vendas por Hora
            </h2>
            {chartData && <Chart data={chartData} options={chartOptions} height={150} />}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 460px', gap: '24px', marginTop: '14px' }}>
            <div>
              <div className="center-title">Resumo do Dia</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '28px' }}>$</div>
                  <div style={{ fontSize: '28px', fontWeight: 800 }}>
                    {(data?.faturamentoDiario || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                  <div>Faturamento Diário</div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '28px' }}>🛍️</div>
                  <div style={{ fontSize: '28px', fontWeight: 800 }}>{data?.totalVendasDia || 0}</div>
                  <div>Total de Vendas Diária</div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '28px' }}>🏷️</div>
                  <div style={{ fontSize: '28px', fontWeight: 800 }}>
                    {(data?.ticketMedio || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                  <div>Ticket Médio</div>
                </div>
              </div>
            </div>
            <div>
              <div className="center-title" style={{ textAlign: 'left' }}>
                Produtos com baixo estoque
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.baixoEstoque?.map((r, i) => (
                    <tr key={i}>
                      <td>{r.codigo}</td>
                      <td>{r.produto}</td>
                      <td>{r.quantidade}</td>
                      <td>{(r.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

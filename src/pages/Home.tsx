import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonButtons,
  IonMenuButton
} from '@ionic/react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';
import Sidebar from '../components/Sidebar';
import { API_BASE } from '../../lib/config';
import { useAuth } from '../contexts/AuthContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend);

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

const Home: React.FC = () => {
  const [data, setData] = useState<HomeData | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/home`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const homeData = await res.json();
        setData(homeData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    loadData();
  }, [token]);

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
    <>
      <Sidebar />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Dashboard - NF Easy</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="chartwrap">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle style={{ textAlign: 'center', fontSize: '24px' }}>Vendas por Hora</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {chartData && <Bar data={chartData} options={chartOptions} height={150} />}
              </IonCardContent>
            </IonCard>
          </div>

          <IonGrid>
            <IonRow>
              <IonCol size="12" sizeMd="8">
                <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 800 }}>Resumo do Dia</h2>
                <IonGrid>
                  <IonRow>
                    <IonCol size="12" sizeMd="4">
                      <IonCard style={{ textAlign: 'center' }}>
                        <IonCardContent>
                          <div style={{ fontSize: '28px' }}>💰</div>
                          <div style={{ fontSize: '28px', fontWeight: 800 }}>
                            {(data?.faturamentoDiario || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </div>
                          <div>Faturamento Diário</div>
                        </IonCardContent>
                      </IonCard>
                    </IonCol>
                    <IonCol size="12" sizeMd="4">
                      <IonCard style={{ textAlign: 'center' }}>
                        <IonCardContent>
                          <div style={{ fontSize: '28px' }}>🛍️</div>
                          <div style={{ fontSize: '28px', fontWeight: 800 }}>{data?.totalVendasDia || 0}</div>
                          <div>Total de Vendas Diária</div>
                        </IonCardContent>
                      </IonCard>
                    </IonCol>
                    <IonCol size="12" sizeMd="4">
                      <IonCard style={{ textAlign: 'center' }}>
                        <IonCardContent>
                          <div style={{ fontSize: '28px' }}>🏷️</div>
                          <div style={{ fontSize: '28px', fontWeight: 800 }}>
                            {(data?.ticketMedio || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </div>
                          <div>Ticket Médio</div>
                        </IonCardContent>
                      </IonCard>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCol>
              
              <IonCol size="12" sizeMd="4">
                <h2 style={{ fontSize: '28px', fontWeight: 800 }}>Produtos com Baixo Estoque</h2>
                <IonCard>
                  <IonCardContent style={{ padding: 0 }}>
                    <IonList>
                      {data?.baixoEstoque?.map((r, i) => (
                        <IonItem key={i}>
                          <IonLabel>
                            <h3><strong>{r.codigo}</strong> - {r.produto}</h3>
                            <p>Qtd: {r.quantidade} | Valor: {(r.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                          </IonLabel>
                        </IonItem>
                      ))}
                    </IonList>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Home;

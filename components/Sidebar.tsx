'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonMenuToggle,
  IonButton
} from '@ionic/react';
import { 
  documentTextOutline, 
  cubeOutline, 
  cashOutline, 
  logOutOutline,
  menuOutline 
} from 'ionicons/icons';

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

  const handleNavClick = (e: React.MouseEvent<HTMLIonItemElement>, href: string) => {
    if (role === 'caixa') {
      const allowed = href.includes('produto-notafiscal') || href.includes('cadastro-produtos');
      if (!allowed) {
        e.preventDefault();
        alert('Permissão negada');
      }
    }
  };

  return (
    <>
      <IonMenu contentId="main-content" type="overlay">
        <IonHeader>
          <IonToolbar color="secondary">
            <IonTitle>NF Easy</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent style={{ '--background': 'var(--navy)' }}>
          <IonList style={{ background: 'var(--navy)' }}>
            <IonMenuToggle autoHide={false}>
              <IonItem 
                button 
                routerLink="/home"
                style={{ '--background': 'var(--navy)', '--color': '#fff' }}
              >
                <IonIcon icon={documentTextOutline} slot="start" />
                <IonLabel>Dashboard</IonLabel>
              </IonItem>
              
              <IonItem 
                button 
                routerLink="/produto-notafiscal"
                onClick={(e) => handleNavClick(e, '/produto-notafiscal')}
                style={{ '--background': 'var(--navy)', '--color': '#fff' }}
              >
                <IonIcon icon={documentTextOutline} slot="start" />
                <IonLabel>NFCE</IonLabel>
              </IonItem>
              
              <IonItem 
                button 
                routerLink="/cadastro-produtos"
                onClick={(e) => handleNavClick(e, '/cadastro-produtos')}
                style={{ '--background': 'var(--navy)', '--color': '#fff' }}
              >
                <IonIcon icon={cubeOutline} slot="start" />
                <IonLabel>Produtos</IonLabel>
              </IonItem>
              
              <IonItem 
                button 
                routerLink="/mov-financeira"
                onClick={(e) => handleNavClick(e, '/mov-financeira')}
                style={{ '--background': 'var(--navy)', '--color': '#fff' }}
              >
                <IonIcon icon={cashOutline} slot="start" />
                <IonLabel>Financeiro</IonLabel>
              </IonItem>
              
              <IonItem 
                button 
                onClick={handleLogout}
                style={{ '--background': 'var(--navy)', '--color': '#fff', marginTop: '20px' }}
              >
                <IonIcon icon={logOutOutline} slot="start" />
                <IonLabel>Sair</IonLabel>
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonContent>
      </IonMenu>
    </>
  );
}

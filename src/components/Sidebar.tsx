import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
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
  IonMenuToggle
} from '@ionic/react';
import {
  homeOutline,
  cubeOutline,
  logOutOutline
} from 'ionicons/icons';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const { logout, role } = useAuth();

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  const handleNavClick = (path: string) => {
    if (role === 'caixa') {
      const allowed = path.includes('cadastro-produtos') || path.includes('produto-notafiscal');
      if (!allowed) {
        alert('Permissão negada');
        return;
      }
    }
    history.push(path);
  };

  const menuItems = [
    { path: '/home', icon: homeOutline, label: 'Dashboard' },
    { path: '/cadastro-produtos', icon: cubeOutline, label: 'Produtos' },
  ];

  return (
    <IonMenu contentId="main-content" type="overlay">
      <IonHeader>
        <IonToolbar color="secondary">
          <IonTitle>NF Easy</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent style={{ '--background': 'var(--navy)' }}>
        <IonList style={{ background: 'var(--navy)' }}>
          <IonMenuToggle autoHide={false}>
            {menuItems.map((item) => (
              <IonItem
                key={item.path}
                button
                onClick={() => handleNavClick(item.path)}
                style={{
                  '--background': 'var(--navy)',
                  '--color': '#fff',
                  '--border-color': location.pathname === item.path ? '#3b79c5' : 'transparent'
                }}
              >
                <IonIcon icon={item.icon} slot="start" />
                <IonLabel>{item.label}</IonLabel>
              </IonItem>
            ))}
            
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
  );
};

export default Sidebar;

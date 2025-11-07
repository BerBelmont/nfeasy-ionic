import React, { useState, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon
} from '@ionic/react';
import { documentTextOutline } from 'ionicons/icons';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE } from '../../lib/config';

const Login: React.FC = () => {
  const history = useHistory();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Chamada à API de login
      const response = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data?.error || 'Falha no login');
        return;
      }

      // Salvar token e role
      login(data.token, data.user.role);

      // Redirecionar baseado no role
      if (data.user.role === 'operador') {
        history.push('/cadastro-produtos');
      } else {
        history.push('/home');
      }
    } catch (error) {
      alert('Erro ao conectar com o servidor');
      console.error(error);
    }
  };

  // Removido: botões de teste/override. Mantemos apenas o login.

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding login-container">
        <div className="login-container">
          <IonCard className="login-card">
            <IonCardHeader>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center', margin: '6px 0 12px' }}>
                <IonIcon icon={documentTextOutline} style={{ fontSize: '40px', color: '#3b79c5' }} />
                <div style={{ fontWeight: 800, fontSize: '28px', color: '#0b2a3c' }}>NF Easy</div>
              </div>
              <IonCardTitle style={{ fontSize: '40px', textAlign: 'center', margin: '0' }}>Login</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <form onSubmit={handleSubmit}>
                <IonItem>
                  <IonLabel position="stacked">Email</IonLabel>
                  <IonInput
                    value={email}
                    onIonInput={(e) => setEmail(e.detail.value || '')}
                    placeholder="admin@nfeasy.com"
                    type="email"
                    required
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Senha</IonLabel>
                  <IonInput
                    type="password"
                    value={password}
                    onIonInput={(e) => setPassword(e.detail.value || '')}
                    placeholder="admin123"
                    required
                  />
                </IonItem>
                <IonButton expand="block" type="submit" color="success" style={{ marginTop: '18px' }}>
                  Entrar
                </IonButton>
              </form>
              {/* UI de teste removida */}
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;

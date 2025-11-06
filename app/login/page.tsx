'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { setToken, setRole } from '@/lib/authFetch';
import { IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonIcon } from '@ionic/react';
import { documentTextOutline } from 'ionicons/icons';

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
    <IonPage>
      <IonContent fullscreen className="ion-padding" style={{ '--background': '#09253a' }}>
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
                  <IonLabel position="stacked">Usuário</IonLabel>
                  <IonInput
                    value={usuario}
                    onIonInput={(e) => setUsuario(e.detail.value || '')}
                    placeholder="admin ou caixa"
                    required
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Senha</IonLabel>
                  <IonInput
                    type="password"
                    value={senha}
                    onIonInput={(e) => setSenha(e.detail.value || '')}
                    placeholder="1234"
                    required
                  />
                </IonItem>
                <IonButton expand="block" type="submit" color="success" style={{ marginTop: '18px' }}>
                  Entrar
                </IonButton>
              </form>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
}

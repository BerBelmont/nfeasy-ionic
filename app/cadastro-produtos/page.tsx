'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';
import { authFetch } from '@/lib/authFetch';
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
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonButton,
  IonButtons,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonMenuButton
} from '@ionic/react';
import { save, trash, search } from 'ionicons/icons';

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

    alert('Produto salvo com sucesso!');
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

  return (
    <AuthGuard>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Cadastro de Produtos</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <Sidebar />
          
          <IonCard>
            <IonCardHeader>
              <IonCardTitle style={{ textAlign: 'center', fontSize: '28px', letterSpacing: '.5px' }}>
                CADASTRO DE PRODUTOS
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol size="12" sizeMd="6">
                    <IonItem>
                      <IonLabel position="stacked">Código *</IonLabel>
                      <IonInput
                        value={form.codigo}
                        onIonInput={(e) => setForm({ ...form, codigo: e.detail.value || '' })}
                        placeholder="Código do produto"
                      />
                    </IonItem>
                  </IonCol>

                  <IonCol size="12" sizeMd="6">
                    <IonItem>
                      <IonLabel position="stacked">Produto *</IonLabel>
                      <IonInput
                        value={form.nome}
                        onIonInput={(e) => setForm({ ...form, nome: e.detail.value || '' })}
                        placeholder="Nome do produto"
                      />
                    </IonItem>
                  </IonCol>

                  <IonCol size="12" sizeMd="6">
                    <IonItem>
                      <IonLabel position="stacked">Subgrupo *</IonLabel>
                      <IonSelect
                        value={form.subgrupo}
                        onIonChange={(e) => setForm({ ...form, subgrupo: e.detail.value })}
                      >
                        <IonSelectOption value="Mercearia">Mercearia</IonSelectOption>
                        <IonSelectOption value="Frios">Frios</IonSelectOption>
                        <IonSelectOption value="Higiene">Higiene</IonSelectOption>
                        <IonSelectOption value="Limpeza">Limpeza</IonSelectOption>
                        <IonSelectOption value="Bebidas">Bebidas</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonCol>

                  <IonCol size="12" sizeMd="6">
                    <IonItem>
                      <IonLabel position="stacked">Preço (R$)</IonLabel>
                      <IonInput
                        type="number"
                        value={form.preco}
                        onIonInput={(e) => setForm({ ...form, preco: Number(e.detail.value) || 0 })}
                        placeholder="0.00"
                      />
                    </IonItem>
                  </IonCol>

                  <IonCol size="12" sizeMd="6">
                    <IonItem>
                      <IonLabel position="stacked">Código de Barras</IonLabel>
                      <IonInput
                        value={form.codigoBarras}
                        onIonInput={(e) => setForm({ ...form, codigoBarras: e.detail.value || '' })}
                        placeholder="EAN-13"
                      />
                    </IonItem>
                  </IonCol>

                  <IonCol size="12" sizeMd="6">
                    <IonItem>
                      <IonLabel position="stacked">Unidade de Medida *</IonLabel>
                      <IonSelect
                        value={form.unidade}
                        onIonChange={(e) => setForm({ ...form, unidade: e.detail.value })}
                      >
                        <IonSelectOption value="UN">UN</IonSelectOption>
                        <IonSelectOption value="KG">KG</IonSelectOption>
                        <IonSelectOption value="L">L</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonCol>

                  <IonCol size="12" sizeMd="6">
                    <IonItem>
                      <IonLabel position="stacked">NCM (8 dígitos) *</IonLabel>
                      <IonInput
                        value={form.ncm}
                        onIonInput={(e) => setForm({ ...form, ncm: e.detail.value || '' })}
                        placeholder="00000000"
                        maxlength={8}
                      />
                    </IonItem>
                  </IonCol>

                  <IonCol size="12" sizeMd="6">
                    <IonItem>
                      <IonLabel position="stacked">Peso (kg)</IonLabel>
                      <IonInput
                        type="number"
                        value={form.peso}
                        onIonInput={(e) => setForm({ ...form, peso: Number(e.detail.value) || 0 })}
                        placeholder="0.000"
                      />
                    </IonItem>
                  </IonCol>

                  <IonCol size="12" sizeMd="4">
                    <IonItem>
                      <IonLabel position="stacked">CST IPI</IonLabel>
                      <IonInput
                        value={form.cstIpi}
                        onIonInput={(e) => setForm({ ...form, cstIpi: e.detail.value || '' })}
                      />
                    </IonItem>
                  </IonCol>

                  <IonCol size="12" sizeMd="4">
                    <IonItem>
                      <IonLabel position="stacked">CST COFINS</IonLabel>
                      <IonInput
                        value={form.cstCofins}
                        onIonInput={(e) => setForm({ ...form, cstCofins: e.detail.value || '' })}
                      />
                    </IonItem>
                  </IonCol>

                  <IonCol size="12" sizeMd="4">
                    <IonItem>
                      <IonLabel position="stacked">CST PIS</IonLabel>
                      <IonInput
                        value={form.cstPis}
                        onIonInput={(e) => setForm({ ...form, cstPis: e.detail.value || '' })}
                      />
                    </IonItem>
                  </IonCol>

                  <IonCol size="12" sizeMd="6">
                    <IonItem>
                      <IonLabel position="stacked">Estoque</IonLabel>
                      <IonInput
                        type="number"
                        value={form.estoque}
                        onIonInput={(e) => setForm({ ...form, estoque: Number(e.detail.value) || 0 })}
                        placeholder="0"
                      />
                    </IonItem>
                  </IonCol>

                  <IonCol size="12" sizeMd="6">
                    <IonItem>
                      <IonLabel>Produto Ativo</IonLabel>
                      <IonToggle
                        checked={form.ativo}
                        onIonChange={(e) => setForm({ ...form, ativo: e.detail.checked })}
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>
              </IonGrid>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <IonButton color="danger" onClick={() => alert('Função de exclusão não implementada')}>
                  <IonIcon slot="start" icon={trash} />
                  Excluir
                </IonButton>
                <IonButton color="success" onClick={handleSalvar}>
                  <IonIcon slot="start" icon={save} />
                  Salvar
                </IonButton>
                <IonButton color="secondary" onClick={handleLimpar}>
                  <IonIcon slot="start" icon={search} />
                  Limpar
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    </AuthGuard>
  );
}

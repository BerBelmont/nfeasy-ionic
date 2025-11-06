import { setupIonicReact } from '@ionic/react';

// Configuração do Ionic React
export function initializeIonic() {
  setupIonicReact({
    mode: 'md', // Material Design mode
    animated: true,
  });
}

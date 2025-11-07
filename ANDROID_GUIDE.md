# 📱 Guia: Rodando no Android Studio

## ✅ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- ✅ **Node.js** (já instalado - você tem npm funcionando)
- ✅ **Android Studio** (instale se ainda não tiver)
- ✅ **JDK 11 ou superior** (geralmente vem com Android Studio)
- ✅ **Android SDK** (configurado no Android Studio)
- ✅ **Emulador Android** ou **dispositivo físico** com USB debugging

### 📥 Download Android Studio:
https://developer.android.com/studio

---

## 🚀 Passos para Rodar no Android

### 1️⃣ **Build do Frontend**

Primeiro, crie o build de produção:

```powershell
npm run build
```

✅ **Feito!** Isso criará a pasta `dist/` com os arquivos otimizados.

---

### 2️⃣ **Sincronizar com Capacitor**

```powershell
npx cap sync android
```

✅ **Feito!** Isso copia os arquivos web para o projeto Android.

**O que esse comando faz:**
- Copia `dist/` → `android/app/src/main/assets/public/`
- Atualiza plugins do Capacitor
- Sincroniza configurações

---

### 3️⃣ **Abrir no Android Studio**

```powershell
npx cap open android
```

✅ Isso abrirá o Android Studio automaticamente com o projeto Android.

**Alternativa manual:**
1. Abra Android Studio
2. File → Open
3. Navegue até: `C:\Users\berbe\OneDrive\Área de Trabalho\nfeasy\android`
4. Clique em **OK**

---

### 4️⃣ **Configurar Emulador (se necessário)**

No Android Studio:

1. **Tools** → **Device Manager**
2. Clique em **Create Device**
3. Escolha um dispositivo (ex: Pixel 6)
4. Escolha uma imagem do sistema (ex: Android 13 - API 33)
5. Clique em **Finish**

---

### 5️⃣ **Rodar o Aplicativo**

No Android Studio:

1. **Aguarde o Gradle Build** terminar (primeira vez pode demorar)
2. Selecione o **emulador** ou **dispositivo físico** no topo
3. Clique no botão **▶️ Run** (ou pressione Shift+F10)

O app será instalado e aberto automaticamente! 🎉

---

## 📊 Estrutura do Projeto Android

```
android/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── assets/
│   │       │   └── public/          ← Seu código web está aqui!
│   │       ├── java/
│   │       ├── res/                 ← Ícones, splash screen
│   │       └── AndroidManifest.xml  ← Configurações do app
│   └── build.gradle                 ← Dependências
├── gradle/
└── build.gradle
```

---

## 🔧 Configurações Importantes

### 📝 **capacitor.config.ts**

```typescript
const config: CapacitorConfig = {
  appId: 'com.seugrupo.nfeasy',  // ID único do app
  appName: 'nfeasy-ionic',        // Nome do app
  webDir: 'dist',                 // Pasta do build (Vite)
};
```

### 🌐 **Testando com Servidor Local (Opcional)**

Se quiser testar com hot-reload (conectando ao servidor dev):

**capacitor.config.ts:**
```typescript
server: {
  url: 'http://10.0.2.2:3000',  // IP do emulador para localhost
  cleartext: true                // Permitir HTTP (desenvolvimento)
}
```

**Para dispositivo físico:**
```typescript
server: {
  url: 'http://SEU_IP_LOCAL:3000',  // Ex: 192.168.1.100:3000
  cleartext: true
}
```

⚠️ **Lembre-se:** Para produção, remova essa configuração e use o build!

---

## 🔄 Fluxo de Trabalho

### Durante Desenvolvimento:

```powershell
# 1. Faça mudanças no código
# 2. Build novamente
npm run build

# 3. Sincronize
npx cap sync android

# 4. No Android Studio, clique em Run novamente
```

### Build de Produção (APK/Bundle):

No Android Studio:

1. **Build** → **Generate Signed Bundle / APK**
2. Escolha **APK** ou **Android App Bundle**
3. Configure ou crie uma keystore
4. Escolha **release** build variant
5. Clique em **Finish**

O APK estará em: `android/app/build/outputs/apk/release/`

---

## 🐛 Troubleshooting

### ❌ "Gradle build failed"

**Solução:**
```powershell
cd android
./gradlew clean
cd ..
npx cap sync android
```

### ❌ "SDK not found"

**Solução:**
No Android Studio:
1. File → Settings (ou Preferences no Mac)
2. Appearance & Behavior → System Settings → Android SDK
3. Instale uma versão do SDK (recomendado: API 33)

### ❌ "Web assets not found"

**Solução:**
```powershell
npm run build
npx cap sync android
```

### ❌ "Cannot connect to backend"

Se estiver usando backend local:

**Emulador:**
- Use `http://10.0.2.2:3001` (não `localhost`)

**Dispositivo Físico:**
- Use seu IP local (ex: `http://192.168.1.100:3001`)
- Dispositivo e PC devem estar na mesma rede Wi-Fi

**Melhor para produção:** Deploy o backend online e use a URL real.

---

## 📱 Testando no Dispositivo Físico

### 1. Habilite USB Debugging no celular:
1. Configurações → Sobre o telefone
2. Toque 7x em "Número da compilação"
3. Volta → Opções do desenvolvedor
4. Ative "Depuração USB"

### 2. Conecte via USB

### 3. No Android Studio:
- Dispositivo aparecerá na lista de dispositivos
- Clique em **Run**

---

## 🎨 Personalizando o App

### 🖼️ **Ícone do App**

Coloque suas imagens em:
```
android/app/src/main/res/
├── mipmap-hdpi/
├── mipmap-mdpi/
├── mipmap-xhdpi/
├── mipmap-xxhdpi/
└── mipmap-xxxhdpi/
```

Ou use ferramentas:
- https://appicon.co/
- https://icon.kitchen/

### 🌟 **Splash Screen**

Edite:
```
android/app/src/main/res/drawable/splash.png
```

### 🏷️ **Nome do App**

Edite `android/app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">NFEasy</string>
```

---

## 📋 Checklist Completo

- [x] ✅ Build criado (`npm run build`)
- [x] ✅ Capacitor sincronizado (`npx cap sync android`)
- [ ] ⬜ Android Studio instalado
- [ ] ⬜ Emulador ou dispositivo configurado
- [ ] ⬜ Projeto aberto no Android Studio
- [ ] ⬜ Gradle build concluído (primeira vez ~5-10min)
- [ ] ⬜ App rodando no emulador/dispositivo

---

## 🎯 Próximos Passos

### Para desenvolvimento:
1. Continue desenvolvendo no VS Code
2. Quando quiser testar no Android:
   ```powershell
   npm run build
   npx cap sync android
   ```
3. No Android Studio, clique em **Run**

### Para publicação:
1. Gere APK/Bundle assinado
2. Publique na Google Play Store
3. Configure backend em produção (não localhost!)

---

## 📚 Recursos Úteis

- [Capacitor Android Docs](https://capacitorjs.com/docs/android)
- [Android Studio Guide](https://developer.android.com/studio/run)
- [Ionic Deploy](https://ionicframework.com/docs/deployment/app-store)

---

**🎉 Pronto! Agora você pode rodar no Android Studio!** 📱

Execute:
```powershell
npx cap open android
```

E clique em **▶️ Run** no Android Studio! 🚀

# NFEasy (Ionic + Capacitor + Vite + Express)

Aplicação Ionic React com back-end Express e build Android via Capacitor. Este README único explica como clonar, instalar e rodar em três alvos: navegador, API local e emulador Android.

---

## Stack
- Front-end: Ionic React + Vite + TypeScript
- Back-end: Express (mock), porta 3001
- Mobile: Capacitor (Android)

---

## Sobre a aplicação

O NF Easy é uma demonstração funcional de um app de retaguarda para varejo, com foco em autenticação simples, um dashboard operacional e cadastro de produtos. Os dados são mockados no back‑end Express, suficientes para a avaliação funcional da interface e do fluxo de rede.

Funcionalidades principais:
- Login com perfis de usuário (admin, gerente, operador) e armazenamento de token no navegador/dispositivo.
- Dashboard (Home) com:
  - Gráfico de vendas por hora (Chart.js)
  - Cards de faturamento diário, total de vendas e ticket médio
  - Lista de produtos com baixo estoque
- Cadastro de Produtos com validações (código, nome, subgrupo, unidade, NCM com 8 dígitos etc.).
- Proteção de rotas: telas internas exigem token; em caso de 401, o app limpa a sessão e redireciona para Login.

Integração de API:
- Todas as chamadas usam caminho relativo `/api/*` no ambiente de desenvolvimento.
- O Vite faz proxy para `http://localhost:3001`, isolando a rede do emulador.
- Em build com assets locais (file://), o app usa `http://10.0.2.2:3001` para alcançar o host a partir do emulador.

Importante: o back‑end é mockado e não persiste dados — ideal para testes, aulas e apresentação do fluxo Mobile/Web/API.

---

## Requisitos
- Node.js 18+ e npm
- Android Studio (para emulador)

---

## Como rodar depois de clonar

1) Clonar e instalar
```powershell
git clone https://github.com/berbelmont/nfeasy-ionic.git
cd nfeasy-ionic
npm install
```

2) Subir o back-end (porta 3001)
```powershell
cd server
npm ci
npm run dev
# Acesse para checar: http://localhost:3001/api/ping
```

3) Subir o front-end (Vite na porta fixa 5175)
```powershell
cd ..
npm run dev
# Abre em: http://localhost:5175
```

4) Rodar no emulador Android (Capacitor)
- Abra o projeto Android no Android Studio: `c:\nfeasy\android`
- Garanta que o Vite (5175) e o back-end (3001) estão rodando
- Clique em Run ▶ para instalar e iniciar o app

Como funciona no dev: o app Android carrega do Vite (http://10.0.2.2:5175) e todas as chamadas `/api/...` são encaminhadas pelo próprio Vite para `http://localhost:3001` via proxy.
Credenciais de teste
- Email: `admin@nfeasy.com`
- Senha: `admin123`

---

## Build de produção e sincronização (opcional)
```powershell
npm run build
npx cap sync android
# Para gerar APK debug:
.\android\gradlew.bat -p .\android assembleDebug
```

---

## Estrutura relevante
```
server/               # Express (mock API)
  server.js           # Porta 3001, /api/*
src/                  # Ionic React
android/              # Projeto Android (Capacitor)
capacitor.config.ts   # Config do Capacitor (server.url no dev)
vite.config.ts        # Vite (porta 5175 + proxy /api)
```

---

## Problemas comuns
- Vite não sobe na 5175: libere a porta 5175 (ou pare sessões antigas) e rode `npm run dev` novamente.
- Emulador “offline”: aguarde o boot completar e tente novamente instalar/rodar pelo Android Studio.



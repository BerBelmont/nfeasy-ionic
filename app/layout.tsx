'use client';

import './globals.css';
import { ReactNode, useEffect } from 'react';
import { initializeIonic } from '@/lib/setupIonic';

export default function RootLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    initializeIonic();
  }, []);

  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>{children}</body>
    </html>
  );
}
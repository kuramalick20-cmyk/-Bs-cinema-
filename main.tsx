import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Browser } from '@capacitor/browser';
import App from './App.tsx';
import './index.css';

if (Capacitor.isNativePlatform()) {
  StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
  StatusBar.setBackgroundColor({ color: '#0a0a0f' }).catch(() => {});
  SplashScreen.hide({ fadeOutDuration: 300 }).catch(() => {});

  document.addEventListener('click', (e) => {
    const anchor = (e.target as HTMLElement)?.closest('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href) return;
    const url = href.startsWith('http') ? href : `${window.location.origin}${href}`;
    if (url.startsWith('http') && !url.startsWith(window.location.origin)) {
      e.preventDefault();
      Browser.open({ url });
    }
  });
}

// Register service worker for PWA offline support (web only, not in Capacitor native)
if ('serviceWorker' in navigator && !Capacitor.isNativePlatform()) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

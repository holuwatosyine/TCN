import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const GA_ID = (import.meta as any).env?.VITE_GA_ID as string | undefined;
if (GA_ID && !document.getElementById('ga-script')) {
  const s = document.createElement('script');
  s.id = 'ga-script';
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
  const inline = document.createElement('script');
  inline.innerHTML = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GA_ID}');`;
  document.head.appendChild(inline);
}

const ERROR_ENDPOINT = (import.meta as any).env?.VITE_ERROR_ENDPOINT as string | undefined;
function reportError(payload: any) {
  if (!ERROR_ENDPOINT || !navigator.sendBeacon) return;
  const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
  navigator.sendBeacon(ERROR_ENDPOINT, blob);
}

window.addEventListener('error', (e) => reportError({ type: 'error', message: e.message, stack: e.error?.stack }));
window.addEventListener('unhandledrejection', (e) => reportError({ type: 'unhandledrejection', reason: String(e.reason) }));

createRoot(document.getElementById("root")!).render(<App />);

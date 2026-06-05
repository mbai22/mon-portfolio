import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.jsx'
import { AudioPlayerProvider } from './contexts/AudioPlayerContext.jsx'
import { CartProvider } from './contexts/CartContext.jsx'
import { I18nProvider } from './contexts/I18nContext.jsx'

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('Service Worker registration failed: ', registrationError);
      });
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nProvider>
      <AudioPlayerProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AudioPlayerProvider>
    </I18nProvider>
  </StrictMode>,
)

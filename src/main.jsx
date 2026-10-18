import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './css/navbar.css'
import './css/hero.css'
import './css/about.css'
import './css/skills.css'
import './css/services.css'
import './css/cards.css'
import './css/testimonials.css'
import './css/faq.css'
import './css/contact.css'
import './css/footer.css'
import App from './App.jsx'
import { I18nProvider } from './contexts/I18nContext.jsx'

// Register Service Worker for PWA (production only: it caches cache-first and would serve stale modules in dev)
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
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
      <App />
    </I18nProvider>
  </StrictMode>,
)

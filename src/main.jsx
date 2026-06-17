import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './css/navbar.css'
import './css/hero.css'
import './css/scroll-indicator.css'
import './css/about.css'
import './css/skills.css'
import './css/portfolio.css'
import './css/services.css'
import './css/how-i-work.css'
import './css/testimonials.css'
import './css/clients.css'
import './css/blog.css'
import './css/faq.css'
import './css/contact.css'
import './css/projects-page.css'
import './css/dots.css'
import App from './App.jsx'
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
      <App />
    </I18nProvider>
  </StrictMode>,
)

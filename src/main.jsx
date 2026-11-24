import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
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
import './css/blog.css'
import './css/portfolio-page.css'
import './css/tools.css'
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

const app = (
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>
)
const root = document.getElementById('root')

// The home page is prerendered at build time (scripts/prerender.mjs): reuse that HTML.
// Other pages are served from an empty shell (app.html) and rendered from scratch.
if (root.hasChildNodes()) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}

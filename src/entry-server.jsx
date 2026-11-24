// Build-time render of a page to HTML (used by scripts/prerender.mjs).
// The browser then hydrates this markup instead of starting from an empty page,
// so the hero text and portrait show before the JavaScript has run.
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { AppContent } from './App.jsx'
import { I18nProvider } from './contexts/I18nContext.jsx'
import { defaultContent } from './content/defaults'

// What the website assistant knows by default (public/api/chat.php)
export const knowledge = {
  services: defaultContent.services,
  faq: defaultContent.faq,
  estimator: defaultContent.estimator,
  booking: defaultContent.booking,
  projects: defaultContent.projects.map(({ title, client, type, description, stack }) => ({ title, client, type, description, stack })),
  testimonials: defaultContent.testimonials.map(({ name, role, content }) => ({ name, role, content })),
}

export function render(url) {
  return renderToString(
    <StrictMode>
      <I18nProvider>
        <StaticRouter location={url}>
          <AppContent />
        </StaticRouter>
      </I18nProvider>
    </StrictMode>,
  )
}

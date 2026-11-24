// Build-time render of a page to HTML (used by scripts/prerender.mjs).
// The browser then hydrates this markup instead of starting from an empty page,
// so the hero text and portrait show before the JavaScript has run.
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { AppContent } from './App.jsx'
import { I18nProvider } from './contexts/I18nContext.jsx'

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

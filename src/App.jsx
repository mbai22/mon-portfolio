import { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import Testimonials from './components/Testimonials'
import Blog from './components/Blog'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppWidget from './components/WhatsAppWidget'
import PortfolioPage from './pages/PortfolioPage'
import BlogPostPage from './pages/BlogPostPage'
import { usePageMeta } from './hooks/usePageMeta'
import { ContentProvider } from './content/ContentContext'
import { trackOutboundClicks, trackView } from './content/track'

// Separate bundles: loaded only when these pages are opened
const AdminApp = lazy(() => import('./admin/AdminApp'))
const QuotePage = lazy(() => import('./pages/QuotePage'))
const BookingPage = lazy(() => import('./pages/BookingPage'))
const AuditPage = lazy(() => import('./pages/AuditPage'))
const ClientPage = lazy(() => import('./pages/ClientPage'))
const DocumentPage = lazy(() => import('./pages/DocumentPage'))

// The assistant bubble is loaded in the browser only, after the page is shown:
// it is not part of the prerendered home page (a lazy component there would
// make React discard the server HTML).
function ChatBubble() {
  const [Widget, setWidget] = useState(null)
  useEffect(() => {
    let cancelled = false
    import('./components/ChatWidget').then((m) => { if (!cancelled) setWidget(() => m.default) })
    return () => { cancelled = true }
  }, [])
  return Widget ? <Widget /> : null
}

function Home() {
  usePageMeta({ path: '/' })

  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Services />
      <Portfolio />
      <Testimonials />
      <Blog />
      <FAQ />
      <Contact />
    </main>
  )
}

function PageFallback() {
  return <main className="page-loading" aria-busy="true" />
}

function PublicSite() {
  const { pathname } = useLocation()

  useEffect(() => { trackView(pathname) }, [pathname])
  useEffect(() => trackOutboundClicks(), [])

  return (
    <>
      <Navbar />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/projets" element={<Navigate to="/portfolio" replace />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/devis" element={<QuotePage />} />
          <Route path="/rendez-vous" element={<BookingPage />} />
          <Route path="/audit" element={<AuditPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
      <Footer />
      <WhatsAppWidget />
      <ChatBubble />
    </>
  )
}

function Shell() {
  const { pathname } = useLocation()
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return (
      <Suspense fallback={<div className="admin-boot" aria-busy="true" />}>
        <AdminApp />
      </Suspense>
    )
  }
  // Private project page for a client: no site navigation, no statistics
  if (pathname.startsWith('/client/')) {
    return (
      <Suspense fallback={<PageFallback />}>
        <ClientPage />
      </Suspense>
    )
  }
  // Private quote / invoice
  if (pathname.startsWith('/document/')) {
    return (
      <Suspense fallback={<PageFallback />}>
        <DocumentPage />
      </Suspense>
    )
  }
  return <PublicSite />
}

// Router-free part of the app, shared by the browser (BrowserRouter) and the
// build-time prerender of the home page (StaticRouter, see src/entry-server.jsx)
export function AppContent() {
  return (
    <ContentProvider>
      <Shell />
    </ContentProvider>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App

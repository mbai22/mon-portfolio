import { lazy, Suspense } from 'react'
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

// The admin is its own bundle: visitors never download it
const AdminApp = lazy(() => import('./admin/AdminApp'))

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

function PublicSite() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/projets" element={<Navigate to="/portfolio" replace />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
      <WhatsAppWidget />
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
  return <PublicSite />
}

function App() {
  return (
    <BrowserRouter>
      <ContentProvider>
        <Shell />
      </ContentProvider>
    </BrowserRouter>
  )
}

export default App

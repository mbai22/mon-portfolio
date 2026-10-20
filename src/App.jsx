import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}

export default App

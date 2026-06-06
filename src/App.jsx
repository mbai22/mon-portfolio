import { HashRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Portfolio from './components/Portfolio'
import Services from './components/Services'
import HowIWork from './components/HowIWork'
import Testimonials from './components/Testimonials'
import Clients from './components/Clients'
import Blog from './components/Blog'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppWidget from './components/WhatsAppWidget'
import ProjectsPage from './pages/ProjectsPage'

function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Portfolio />
      <Services />
      <HowIWork />
      <Testimonials />
      <Clients />
      <Blog />
      <FAQ />
      <Contact />
    </main>
  )
}

function App() {
  return (
    <HashRouter>
      <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: 'white' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projets" element={<ProjectsPage />} />
        </Routes>
        <Footer />
        <WhatsAppWidget />
      </div>
    </HashRouter>
  )
}

export default App

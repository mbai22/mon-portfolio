import { Calendar, Clock, ArrowRight, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCarousel } from '../hooks/useCarousel';

const blogPosts = [
  {
    id: 1,
    title: "Les meilleures pratiques pour une architecture React scalable",
    excerpt: "Découvrez comment structurer vos projets React pour qu'ils restent maintenables et évolutifs à long terme avec des patterns modernes.",
    category: "React",
    date: "15 Avril 2024",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop"
  },
  {
    id: 2,
    title: "Introduction à Laravel 11 : Nouveautés et améliorations",
    excerpt: "Tour d'horizon des nouvelles fonctionnalités de Laravel 11 et comment les utiliser dans vos projets PHP.",
    category: "Laravel",
    date: "10 Avril 2024",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop"
  },
  {
    id: 3,
    title: "Optimiser les performances des applications Angular",
    excerpt: "Guide complet pour améliorer la vitesse et l'efficacité de vos applications Angular avec des techniques avancées.",
    category: "Angular",
    date: "5 Avril 2024",
    readTime: "10 min",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=500&fit=crop"
  },
  {
    id: 4,
    title: "Docker pour les développeurs : Guide pratique",
    excerpt: "Apprenez à conteneuriser vos applications web avec Docker pour simplifier le déploiement et la collaboration.",
    category: "DevOps",
    date: "1 Avril 2024",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&h=500&fit=crop"
  },
  {
    id: 5,
    title: "Créer des API REST robustes avec Node.js et Express",
    excerpt: "Tutoriel étape par étape pour concevoir et implémenter des API REST modernes et sécurisées.",
    category: "Backend",
    date: "28 Mars 2024",
    readTime: "9 min",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=500&fit=crop"
  },
  {
    id: 6,
    title: "Les tendances du développement web en 2024",
    excerpt: "Analyse des nouvelles technologies et frameworks qui façonnent l'avenir du développement web cette année.",
    category: "Web Dev",
    date: "20 Mars 2024",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=500&fit=crop"
  }
];

export default function Blog() {
  const { scrollRef, activeIndex, scroll, scrollTo } = useCarousel({ cardSelector: '.blog-card' });

  return (
    <section id="blog" className="blog-section">
      <div className="section-container">
        <span className="section-label">BLOG</span>
        <h2 className="section-title">Derniers Articles</h2>
        <p className="section-description">
          Découvrez mes derniers articles sur le développement web, les bonnes pratiques et les nouvelles technologies.
        </p>

        <div ref={scrollRef} className="blog-grid">
          {blogPosts.map((post) => (
            <article key={post.id} className="blog-card">
              <div className="blog-image">
                <img src={post.image} alt={post.title} />
                <div className="blog-category">
                  <Tag size={14} />
                  <span>{post.category}</span>
                </div>
              </div>
              
              <div className="blog-content">
                <div className="blog-meta">
                  <span className="blog-meta-item">
                    <Calendar size={14} />
                    {post.date}
                  </span>
                  <span className="blog-meta-item">
                    <Clock size={14} />
                    {post.readTime}
                  </span>
                </div>
                
                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>
                
                <a href="#" className="blog-link">
                  Lire l'article
                  <ArrowRight size={16} />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="carousel-nav">
          <button className="carousel-arrow" onClick={() => scroll(-1)} aria-label="Précédent">
            <ChevronLeft size={20} />
          </button>
          <button className="carousel-arrow" onClick={() => scroll(1)} aria-label="Suivant">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Navigation Dots */}
        <div className="blog-dots">
          {blogPosts.map((_, index) => (
            <button
              key={index}
              className={`blog-dot${index === activeIndex ? ' active' : ''}`}
              onClick={() => scrollTo(index)}
              aria-label={`Article ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

import { ChevronsRight } from 'lucide-react';
import Eyebrow from './Eyebrow';

const blogPosts = [
  {
    id: 1,
    title: "Les meilleures pratiques pour une architecture React scalable",
    category: "React",
    date: "15 avril 2024",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop"
  },
  {
    id: 2,
    title: "Introduction à Laravel 11 : nouveautés et améliorations",
    category: "Laravel",
    date: "10 avril 2024",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop"
  },
  {
    id: 3,
    title: "Optimiser les performances des applications Angular",
    category: "Angular",
    date: "5 avril 2024",
    readTime: "10 min",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=500&fit=crop"
  }
];

export default function Blog() {
  return (
    <section id="blog" className="section section-cream">
      <div className="container">
        <div className="section-head">
          <Eyebrow>Blog & conseils</Eyebrow>
          <h2 className="section-title">Conseils et retours d'expérience pour vos projets web</h2>
        </div>

        <div className="cards-grid">
          {blogPosts.map((post) => (
            <article key={post.id} className="media-card">
              <div className="media-card-image">
                <img src={post.image} alt="" loading="lazy" />
              </div>
              <div className="media-card-body">
                <span className="media-card-kicker display">{post.category}</span>
                <h3 className="media-card-title">{post.title}</h3>
                <div className="media-card-footer">
                  <span className="media-card-meta media-card-meta-accent">{post.date} · {post.readTime}</span>
                  <span className="circle-icon" aria-hidden="true"><ChevronsRight size={16} /></span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

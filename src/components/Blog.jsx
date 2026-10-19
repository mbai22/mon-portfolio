import { Link } from 'react-router-dom';
import { ChevronsRight } from 'lucide-react';
import Eyebrow from './Eyebrow';
import { posts, formatDate } from '../data/posts';

export default function Blog() {
  return (
    <section id="blog" className="section section-light">
      <div className="container">
        <div className="section-head">
          <Eyebrow>Blog & conseils</Eyebrow>
          <h2 className="section-title">Conseils et retours d'expérience pour vos projets web</h2>
        </div>

        <div className="cards-grid">
          {posts.map((post) => (
            <article key={post.slug} className="media-card">
              <Link to={`/blog/${post.slug}`} className="media-card-image" tabIndex={-1} aria-hidden="true">
                <img src={post.thumb} alt="" loading="lazy" />
              </Link>
              <div className="media-card-body">
                <span className="media-card-kicker display">{post.category}</span>
                <h3 className="media-card-title">
                  <Link to={`/blog/${post.slug}`} className="media-card-link">{post.title}</Link>
                </h3>
                <div className="media-card-footer">
                  <span className="media-card-meta media-card-meta-accent">
                    <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readTime}
                  </span>
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

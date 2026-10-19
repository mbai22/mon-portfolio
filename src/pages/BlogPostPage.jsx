import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ChevronsRight } from 'lucide-react';
import Eyebrow from '../components/Eyebrow';
import { useSectionNav } from '../hooks/useSectionNav';
import { usePageMeta, SITE_URL } from '../hooks/usePageMeta';
import { getPost, formatDate, posts } from '../data/posts';

function Block({ block }) {
  if (typeof block === 'string') return <p>{block}</p>;
  if (block.h2) return <h2>{block.h2}</h2>;
  if (block.list) {
    return (
      <ul>
        {block.list.map((item) => <li key={item}>{item}</li>)}
      </ul>
    );
  }
  return null;
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = getPost(slug);
  const goTo = useSectionNav();
  const path = `/blog/${slug}`;

  usePageMeta(post ? {
    title: `${post.title} | Willy Dev`,
    description: post.description,
    path,
    image: post.image,
    type: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      image: [post.image],
      datePublished: post.date,
      dateModified: post.updated ?? post.date,
      inLanguage: 'fr-FR',
      url: `${SITE_URL}${path}`,
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${path}` },
      author: { '@id': `${SITE_URL}/#person`, '@type': 'Person', name: 'Willy Dev', url: `${SITE_URL}/` },
      publisher: { '@id': `${SITE_URL}/#person` },
    },
  } : {});

  useEffect(() => {
    // 'instant' overrides the global `scroll-behavior: smooth`
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  if (!post) return <Navigate to="/" replace />;

  const others = posts.filter((p) => p.slug !== post.slug);

  return (
    <main>
      <article>
        <header className="article-header section-darker">
          <div className="container article-container">
            <Eyebrow>{post.category}</Eyebrow>
            <h1 className="article-title">{post.title}</h1>
            <p className="article-meta">
              Par Willy Dev · <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readTime} de lecture
            </p>
          </div>
        </header>

        <div className="section-light article-main">
          <div className="container article-container">
            <img
              className="article-cover"
              src={post.image}
              alt={post.imageAlt}
              width="1600"
              height="900"
              fetchPriority="high"
            />
            <div className="article-body">
              {post.body.map((block, i) => <Block key={i} block={block} />)}
            </div>
            <a href="#contact" onClick={goTo('contact')} className="btn-pill article-cta">
              Demander un devis gratuit
              <span className="circle-icon" aria-hidden="true"><ChevronsRight size={16} /></span>
            </a>
          </div>
        </div>
      </article>

      <section className="section section-light article-more">
        <div className="container">
          <h2 className="section-title article-more-title">À lire aussi</h2>
          <div className="cards-grid cards-grid-2">
            {others.map((p) => (
              <Link key={p.slug} to={`/blog/${p.slug}`} className="media-card">
                <div className="media-card-image">
                  <img src={p.thumb} alt="" loading="lazy" />
                </div>
                <div className="media-card-body">
                  <span className="media-card-kicker display">{p.category}</span>
                  <h3 className="media-card-title">{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

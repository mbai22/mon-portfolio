import { useRef, useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Ahmed Mahamat",
    role: "CEO, Startup Tech",
    content: "Willy Dev a transformé notre vision en une application web performante. Son professionnalisme et sa maîtrise technique sont impressionnants. Notre plateforme est maintenant utilisée par des milliers d'utilisateurs.",
    rating: 5,
    image: "/assets/img/testimonial-1.jpg"
  },
  {
    name: "Marie Nodjigoto",
    role: "Propriétaire, Boutique N'Djamena",
    content: "Notre site e-commerce a boosté nos ventes de 200%. Le design est moderne, l'interface est intuitive et le support technique est excellent. Je recommande vivement !",
    rating: 5,
    image: "/assets/img/testimonial-2.jpg"
  },
  {
    name: "Jean-Pierre Dingamnadji",
    role: "Directeur, Éducation Tchad",
    content: "La plateforme de quiz développée pour notre établissement a révolutionné l'apprentissage de nos étudiants. Un travail de qualité, livré dans les délais et au-delà de nos attentes.",
    rating: 5,
    image: "/assets/img/testimonial-3.jpg"
  }
];

export default function Testimonials() {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollTo = (index) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector('.testimonial-card');
    if (!card) return;
    const amount = card.offsetWidth + 24;
    el.scrollTo({ left: index * amount, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const card = el.querySelector('.testimonial-card');
      if (!card) return;
      const amount = card.offsetWidth + 24;
      const index = Math.round(el.scrollLeft / amount);
      setActiveIndex(index);
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const card = el.querySelector('.testimonial-card');
        if (!card) return;
        el.scrollBy({ left: card.offsetWidth + 24, behavior: 'smooth' });
      }
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="bg-primary">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-label">Témoignages</span>
          <h2 className="section-title">Ce que disent mes <span className="text-orange">clients</span></h2>
          <p className="section-description">
            La satisfaction de mes clients est ma priorité absolue.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="testimonials-grid" ref={scrollRef}>
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.name} className="testimonial-card" style={{ animationDelay: `${index * 150}ms` }}>
              {/* Quote Icon */}
              <div className="testimonial-quote">
                <Quote size={32} />
              </div>

              {/* Rating */}
              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#fdb901" color="#fdb901" />
                ))}
              </div>

              {/* Content */}
              <p className="testimonial-content">{testimonial.content}</p>

              {/* Author */}
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = testimonial.name.charAt(0);
                    }}
                  />
                </div>
                <div>
                  <p className="testimonial-name">{testimonial.name}</p>
                  <p className="testimonial-role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="testimonials-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`testimonial-dot${index === activeIndex ? ' active' : ''}`}
              onClick={() => scrollTo(index)}
              aria-label={`Témoignage ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

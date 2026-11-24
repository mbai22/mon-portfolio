import { Star, Quote } from 'lucide-react';
import Eyebrow from './Eyebrow';
import { useContent } from '../content/useContent';

export default function Testimonials() {
  const { testimonials } = useContent();

  return (
    <section id="testimonials" className="section section-dark">
      <div className="container">
        <div className="section-head">
          <Eyebrow>Témoignages</Eyebrow>
          <h2 className="section-title">Ce que disent mes clients</h2>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.name} className="testimonial-card">
              <div className="testimonial-top">
                <div className="testimonial-rating" aria-label={`${testimonial.rating} étoiles sur 5`}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <Quote size={28} className="testimonial-quote" aria-hidden="true" />
              </div>

              <blockquote className="testimonial-content">{testimonial.content}</blockquote>

              <figcaption className="testimonial-author">
                <img src={testimonial.image} alt="" className="testimonial-avatar" loading="lazy" />
                <div>
                  <p className="testimonial-name">{testimonial.name}</p>
                  <p className="testimonial-role">{testimonial.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

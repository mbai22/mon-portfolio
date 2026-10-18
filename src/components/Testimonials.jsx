import { Star, Quote } from 'lucide-react';
import Eyebrow from './Eyebrow';

const testimonials = [
  {
    name: "Ahmed Mahamat",
    role: "CEO, Startup Tech",
    content: "Willy Dev a transformé notre vision en une application web performante. Son professionnalisme et sa maîtrise technique sont impressionnants. Notre plateforme est maintenant utilisée par des milliers d'utilisateurs.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Marie Nodjigoto",
    role: "Propriétaire, Boutique N'Djamena",
    content: "Notre site e-commerce a boosté nos ventes de 200%. Le design est moderne, l'interface est intuitive et le support technique est excellent. Je recommande vivement !",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/28.jpg"
  },
  {
    name: "Jean-Pierre Dingamnadji",
    role: "Directeur, Éducation Tchad",
    content: "La plateforme de quiz développée pour notre établissement a révolutionné l'apprentissage de nos étudiants. Un travail de qualité, livré dans les délais et au-delà de nos attentes.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/75.jpg"
  }
];

export default function Testimonials() {
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

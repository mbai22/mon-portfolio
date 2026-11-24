import { BadgeCheck, Star, Quote } from 'lucide-react';
import Eyebrow from './Eyebrow';
import { useContent } from '../content/useContent';
import { useI18n } from '../i18n/context';

export default function Testimonials() {
  const { testimonials } = useContent();
  const { t } = useI18n();

  return (
    <section id="testimonials" className="section section-dark">
      <div className="container">
        <div className="section-head">
          <Eyebrow>{t('testimonials.eyebrow')}</Eyebrow>
          <h2 className="section-title">{t('testimonials.title')}</h2>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.name} className="testimonial-card">
              <div className="testimonial-top">
                <div className="testimonial-rating" aria-label={t('testimonials.stars', { n: testimonial.rating })}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <Quote size={28} className="testimonial-quote" aria-hidden="true" />
              </div>

              <blockquote className="testimonial-content">{testimonial.content}</blockquote>

              <figcaption className="testimonial-author">
                {testimonial.image
                  ? <img src={testimonial.image} alt="" className="testimonial-avatar" loading="lazy" />
                  : <span className="testimonial-avatar testimonial-initial" aria-hidden="true">{(testimonial.name || '?').charAt(0)}</span>}
                <div>
                  <p className="testimonial-name">{testimonial.name}</p>
                  <p className="testimonial-role">{testimonial.role}</p>
                  {testimonial.verified && <p className="testimonial-verified"><BadgeCheck size={13} /> {t('testimonials.verified')}</p>}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { Plus, X, ChevronsRight } from 'lucide-react';
import Eyebrow from './Eyebrow';
import { useSectionNav } from '../hooks/useSectionNav';
import { useContent } from '../content/useContent';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const goTo = useSectionNav();
  const { faq: faqData } = useContent();

  return (
    <section id="faq" className="section section-dark faq-section">
      <div className="container faq-grid">
        <div className="faq-intro">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="section-title">Questions fréquentes</h2>

          <div className="faq-help">
            <h3 className="faq-help-title display">Encore des questions ?</h3>
            <p>Écrivez-moi à tout moment, je vous réponds rapidement.</p>
            <a href="#contact" onClick={goTo('contact')} className="faq-help-btn">
              <span className="faq-help-btn-label">Contact</span>
              <span className="circle-icon"><ChevronsRight size={16} /></span>
            </a>
          </div>
        </div>

        <div className="faq-list">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className={`faq-item${isOpen ? ' open' : ''}`}>
                <button
                  className="faq-question"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="faq-question-text display">{faq.question}</span>
                  <span className="faq-icon" aria-hidden="true">
                    {isOpen ? <X size={14} /> : <Plus size={14} />}
                  </span>
                </button>
                <div id={`faq-answer-${index}`} className="faq-answer" hidden={!isOpen}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

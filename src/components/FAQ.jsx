import { useState } from 'react';
import { Plus, X, ChevronsRight } from 'lucide-react';
import Eyebrow from './Eyebrow';
import { useSectionNav } from '../hooks/useSectionNav';

const faqData = [
  {
    question: "Quels services proposez-vous ?",
    answer: "Je propose des services de développement web complet : création de sites vitrines, applications web, e-commerce, refonte de sites existants, et développement d'API REST. Je travaille avec les technologies modernes comme Angular, Laravel, React et PHP."
  },
  {
    question: "Combien coûte un projet web ?",
    answer: "Le coût d'un projet dépend de sa complexité, des fonctionnalités demandées et du délai. Je propose des tarifs compétitifs adaptés à chaque budget. Contactez-moi pour un devis personnalisé gratuit."
  },
  {
    question: "Combien de temps prend le développement d'un site ?",
    answer: "Le délai varie selon le projet : un site vitrine simple peut prendre 1-2 semaines, une application web plus complexe 4-8 semaines, et un e-commerce complet 6-12 semaines. Je vous donnerai une estimation précise après analyse de vos besoins."
  },
  {
    question: "Assurez-vous la maintenance après la livraison ?",
    answer: "Oui, je propose des contrats de maintenance pour assurer la sécurité, les mises à jour et les améliorations continues de votre site. Je reste disponible pour le support technique même après la livraison."
  },
  {
    question: "Travaillez-vous avec des clients internationaux ?",
    answer: "Absolument ! Je travaille avec des clients du monde entier grâce aux outils de collaboration en ligne. La communication se fait par email, vidéoconférence et plateformes de gestion de projet."
  },
  {
    question: "Comment procédons-nous pour démarrer un projet ?",
    answer: "Le processus commence par un appel de découverte pour comprendre vos besoins, suivi d'une proposition détaillée avec devis. Une fois validé, nous commençons le développement avec des points réguliers pour suivre l'avancement."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const goTo = useSectionNav();

  return (
    <section id="faq" className="section section-light faq-section">
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

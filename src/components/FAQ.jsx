import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq-section">
      <div className="section-container">
        <span className="section-label">FAQ</span>
        <h2 className="section-title">Questions Fréquentes</h2>
        <p className="section-description">
          Vous avez des questions ? Voici les réponses aux questions les plus courantes.
        </p>

        <div className="faq-grid">
          {faqData.map((faq, index) => (
            <div key={index} className="faq-item">
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span className="faq-question-text">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp size={20} className="faq-icon" />
                ) : (
                  <ChevronDown size={20} className="faq-icon" />
                )}
              </button>
              <div
                className={`faq-answer ${openIndex === index ? 'open' : ''}`}
              >
                <p className="faq-answer-text">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

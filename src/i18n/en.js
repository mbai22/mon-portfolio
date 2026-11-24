// English interface text, plus English versions of the built-in FAQ and services
// (used as long as those sections have not been edited in /admin, which is in French).
import pages from './pages/en';

export default {
  ...pages,
  lang: { label: 'Language', fr: 'Français', en: 'English', ar: 'العربية' },
  nav: {
    home: 'Home', about: 'About', skills: 'Skills', services: 'Services', portfolio: 'Portfolio',
    blog: 'Blog', faq: 'FAQ', contact: 'Contact', cta: 'Contact me', open: 'Open menu', close: 'Close menu',
  },
  hero: {
    title1: "I'm Willy,", title2: 'Web & Mobile Developer',
    text: "Web and mobile app development, graphic design and video editing in N'Djamena: I bring your ideas to life.",
    scroll: 'Scroll to the About section',
    alt: "Willy, web and mobile developer, graphic designer and video editor in N'Djamena",
    aboutTitle: 'About', aboutText: "Full-stack developer, UI/UX designer and videographer based in N'Djamena, Chad.", more: 'Learn more',
    workTitle: 'My work', workText: 'Websites, web and mobile apps, graphic design and video editing.', seePortfolio: 'See the portfolio',
    follow: 'Follow me',
  },
  about: {
    eyebrow: 'About', title: 'Digital solutions that make a difference',
    before: "I'm ", after: ", a web and mobile developer, graphic designer and video editor based in N'Djamena, Chad. I build fast websites and web and mobile apps, polished visual identities and engaging videos for brands and entrepreneurs.",
    cta: "Let's talk about your project",
    mission: 'My mission: turn your ideas into real solutions, whether a web platform, a visual identity or professional video content. I focus on quality, creativity and impact.',
    partners: 'They trusted me',
    years: 'Years of experience', projects: 'Web projects delivered', clients: 'Happy clients',
  },
  skills: { eyebrow: 'Skills', title: 'A complete toolbox', prev: 'Previous', next: 'Next', video: 'Video' },
  services: {
    eyebrow: 'Services', title: 'Tailored services to bring your ideas to life', tabs: 'Service categories',
    from: 'From', quote: 'On quote', start: 'Get started',
    ctaTitle: 'How much will your project cost?', ctaText: 'Get an estimate in 1 minute, book a free call or test your current website.',
    ctaEstimate: 'Estimate my project', ctaBook: 'Book a call', ctaAudit: 'Free audit',
  },
  portfolio: { eyebrow: 'Work', title: 'Projects that meet real needs', all: 'All', seeAll: 'See the whole portfolio' },
  testimonials: { eyebrow: 'Testimonials', title: 'What my clients say', stars: '{n} out of 5 stars', verified: 'Verified review · Willy Dev client' },
  blog: { eyebrow: 'Blog & tips', title: 'Advice and lessons learned for your web projects' },
  faq: {
    eyebrow: 'FAQ', title: 'Frequently asked questions', helpTitle: 'More questions?',
    helpText: 'Write to me anytime, I reply quickly.', helpBtn: 'Contact',
  },
  contact: {
    eyebrow: 'Contact', title: "Let's work together", text: "Ready to turn your idea into a web project? Get in touch to discuss what you need.",
    location: 'Location', locationValue: "N'Djamena, Chad", email: 'Email', availability: 'Availability', availabilityValue: 'Mon - Sat, 9am - 8pm',
    formTitle: 'Send a message', successTitle: 'Message sent!', successText: "I'll get back to you as soon as possible.",
    name: 'Full name', namePh: 'John Smith', emailLabel: 'Email address', emailPh: 'john@example.com',
    subject: 'Subject', message: 'Message', messagePh: 'Describe your project in detail...', chars: '{n} characters',
    sending: 'Sending...', send: 'Send message', sendError: 'The message could not be sent',
    subjects: {
      '': 'Choose a subject', website: 'Website creation', app: 'App development', redesign: 'Website redesign',
      consulting: 'Technical consulting', collab: 'Collaboration', quote: 'Quote request', other: 'Other',
    },
    errors: {
      name: 'The name must be at least 2 characters long', email: 'Invalid email',
      message: 'The message must be at least 10 characters long', subject: 'Please choose a subject',
    },
  },
  footer: {
    ctaTitle1: 'Ready to launch', ctaTitle2: 'your project?', ctaCard1: 'Book a free', ctaCard2: '15-minute discovery call',
    navigation: 'Navigation', more: 'More', contact: 'Contact',
    description: "Web and mobile app development, graphic design and video editing in N'Djamena, Chad.",
    estimate: 'Estimate my project', book: 'Book a call', audit: 'Free audit',
    hours: 'Mon - Sat, 9am - 8pm', rights: 'All rights reserved.', made: 'Made with passion in Chad',
  },
  chat: {
    greeting: "Hello! I'm Willy's assistant. Ask me about websites, apps, logos or videos: prices, timelines, how Willy works…",
    suggestions: ['How much does a website cost?', 'Do you build mobile apps?', 'How long does a project take?'],
    title: 'Willy Dev assistant', subtitle: 'Automatic AI answers · Willy takes over on WhatsApp',
    placeholder: 'Your question…', send: 'Send', open: 'Ask the assistant a question', close: 'Close the assistant',
    typing: 'The assistant is typing…', error: 'The assistant is not responding, please try again.',
  },
  whatsapp: 'Chat on WhatsApp',
  content: {
    faq: [
      { question: 'What services do you offer?', answer: 'I build web and mobile apps, websites (showcase and e-commerce), redesign existing sites and develop REST APIs with Angular, Laravel, React and PHP. I also handle graphic design (logos, visual identity, print and social media) and video editing.' },
      { question: 'Do you also do graphic design and video editing?', answer: 'Yes. Besides development, I create logos, visual identities, posters and social media visuals, and I edit your videos: commercials, clips, motion design and short content for Facebook, Instagram or TikTok.' },
      { question: 'How much does a web project cost?', answer: 'It depends on the complexity, the features and the deadline. I offer competitive prices adapted to every budget. Use the estimator on /devis or contact me for a free personalised quote.' },
      { question: 'How long does it take to build a website?', answer: 'A simple showcase site can take 1 to 2 weeks, a more complex web app 4 to 8 weeks, and a full online store 6 to 12 weeks. I give you a precise estimate after looking at your needs.' },
      { question: 'Do you provide maintenance after delivery?', answer: 'Yes, I offer maintenance contracts covering security, updates and ongoing improvements. I remain available for technical support after delivery.' },
      { question: 'Do you work with international clients?', answer: 'Absolutely! I work with clients worldwide using online collaboration tools: email, video calls and project management platforms.' },
      { question: 'How do we start a project?', answer: 'We start with a discovery call to understand your needs, followed by a detailed proposal and quote. Once approved, development begins with regular check-ins to follow progress.' },
    ],
    services: {
      categories: [
        { id: 'web', label: 'Web', services: [
          { title: 'Website creation', description: 'Showcase sites, online stores or custom platforms: a modern, fast website that ranks well on Google.', price: '150 000', features: ['Responsive design', 'SEO optimised', 'Fast performance', 'Technical support'], featured: true },
          { title: 'Web & mobile apps', description: 'Custom web and mobile apps (Android, iOS, web) built with Angular, React, Laravel and REST APIs.', price: '300 000', features: ['Scalable architecture', 'Strong security', 'Tests included', 'Documentation'] },
        ] },
        { id: 'design', label: 'Design', services: [
          { title: 'UI/UX design', description: 'Web and mobile interface design: Figma mockups, prototypes and user journeys.', features: ['Figma mockups', 'Prototyping', 'User testing', 'Design system'], featured: true },
          { title: 'Graphic design', description: 'Logos, visual identity, posters, flyers and social media visuals.', features: ['Logo & branding', 'Brand guidelines', 'Social visuals', 'Print materials'] },
        ] },
        { id: 'more', label: 'Redesign & video', services: [
          { title: 'Website redesign', description: 'Modernising existing websites to improve user experience and conversion.', price: '100 000', features: ['Full audit', 'New design', 'Clean migration', 'Training included'], featured: true },
          { title: 'Video editing', description: 'Professional editing, motion design, commercials, clips and social media videos.', features: ['Professional editing', 'Motion design', 'Color grading', 'Sound design'] },
        ] },
      ],
      steps: [
        { title: 'Share your needs', text: 'Tell me about your goals, your audience and your constraints.' },
        { title: 'Get a proposal', text: 'A solution and a quote adapted to your project and budget.' },
        { title: 'Launch your project', text: 'Design, testing and delivery, with follow-up at every step.' },
      ],
    },
  },
};

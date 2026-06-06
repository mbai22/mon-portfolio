import { Layout, ShoppingBag, Globe, Database, Smartphone, Code } from 'lucide-react';

export const projects = [
  {
    id: 1,
    title: "Plateforme de Quiz Dynamique",
    client: "Éducation Tchad",
    type: "Application Web",
    Icon: Layout,
    bgColor: "#fdb901",
    description: "Permet aux étudiants de s'entraîner par matière avec score en temps réel",
    stack: "Angular + Laravel API",
    image: "/assets/img/WhatsApp Image 2026-04-17 at 20.54.12.jpeg"
  },
  {
    id: 2,
    title: "E-commerce Local",
    client: "Boutique N'Djamena",
    type: "Site E-commerce",
    Icon: ShoppingBag,
    bgColor: "#7a00ff",
    description: "Boutique en ligne avec paiement mobile et gestion de stocks",
    stack: "React + PHP + MySQL",
    image: "/assets/img/WhatsApp Image 2026-04-17 at 20.54.11.jpeg"
  },
  {
    id: 3,
    title: "Portfolio Créatif",
    client: "Freelance",
    type: "Site Vitrine",
    Icon: Globe,
    bgColor: "#fdb901",
    description: "Site portfolio moderne avec animations et design responsive",
    stack: "HTML + CSS + JavaScript",
    image: "/assets/img/WhatsApp Image 2026-04-17 at 20.54.11 (1).jpeg"
  },
  {
    id: 4,
    title: "Dashboard Admin",
    client: "Startup Tech",
    type: "Application SaaS",
    Icon: Database,
    bgColor: "#7a00ff",
    description: "Tableau de bord administratif avec graphiques et analytics",
    stack: "Angular + Laravel + Chart.js",
    image: "/assets/img/WhatsApp Image 2026-04-17 at 20.54.10.jpeg"
  },
  {
    id: 5,
    title: "App de Réservation",
    client: "Hôtel Sahel",
    type: "Application Web",
    Icon: Smartphone,
    bgColor: "#fdb901",
    description: "Système de réservation de chambres en temps réel",
    stack: "React + Node.js + MongoDB",
    image: "/assets/img/WhatsApp Image 2026-04-17 at 20.54.10 (1).jpeg"
  },
  {
    id: 6,
    title: "API REST Platform",
    client: "Tech Company",
    type: "Backend",
    Icon: Code,
    bgColor: "#7a00ff",
    description: "API RESTful complète avec authentification et documentation",
    stack: "Laravel + JWT + Swagger",
    image: "/assets/img/WhatsApp Image 2026-04-17 at 20.54.09.jpeg"
  }
];

export const filters = ["Tous", "Application Web", "Site E-commerce", "Site Vitrine", "Backend"];
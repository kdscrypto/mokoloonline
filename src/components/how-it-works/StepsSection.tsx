import React from 'react';
import { StepCard } from './StepCard';

const steps = [
  {
    title: "1. Créez votre compte",
    description: "Inscrivez-vous gratuitement en quelques clics. Un compte vous permet de publier des annonces et de contacter les vendeurs.",
    image: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?q=80",
    imageAlt: "Création de compte"
  },
  {
    title: "2. Publiez votre annonce",
    description: "Ajoutez des photos, une description détaillée et fixez votre prix. Plus votre annonce est complète, plus elle a de chances d'attirer l'attention.",
    image: "https://images.unsplash.com/photo-1586880244406-556ebe35f282?q=80",
    imageAlt: "Publication d'annonce"
  },
  {
    title: "3. Gérez vos contacts",
    description: "Recevez les messages des acheteurs intéressés et communiquez directement avec eux via notre plateforme sécurisée.",
    image: "https://images.unsplash.com/photo-1573497161161-c3e73707e25c?q=80",
    imageAlt: "Gestion des contacts"
  }
];

export function StepsSection() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="space-y-12">
          {steps.map((step, index) => (
            <StepCard 
              key={index}
              {...step}
              reverse={index % 2 !== 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
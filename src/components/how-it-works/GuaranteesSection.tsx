import React from 'react';
import { GuaranteeCard } from './GuaranteeCard';

const guarantees = [
  {
    title: "Sécurité maximale",
    description: "Vos données personnelles sont protégées et vos transactions sont sécurisées."
  },
  {
    title: "Support réactif",
    description: "Notre équipe est disponible pour vous aider en cas de besoin."
  },
  {
    title: "Annonces vérifiées",
    description: "Nous vérifions chaque annonce pour garantir la qualité du contenu."
  },
  {
    title: "Facilité d'utilisation",
    description: "Une interface simple et intuitive pour une expérience optimale."
  }
];

export function GuaranteesSection() {
  return (
    <section className="py-16 px-4 bg-secondary/10">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-12">Nos garanties</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {guarantees.map((guarantee, index) => (
            <GuaranteeCard key={index} {...guarantee} />
          ))}
        </div>
      </div>
    </section>
  );
}
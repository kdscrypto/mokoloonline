import React from 'react';
import { Check } from 'lucide-react';

export function SecurityTips() {
  const tips = [
    "Vérifiez toujours l'identité du vendeur avant toute transaction",
    "Ne communiquez jamais vos informations bancaires par message",
    "Privilégiez les rencontres dans des lieux publics",
    "Méfiez-vous des prix anormalement bas",
    "Utilisez notre système de messagerie intégré",
    "Signalez tout comportement suspect"
  ];

  return (
    <section className="py-16 px-4 bg-secondary/10">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-12">Conseils de sécurité</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {tips.map((tip, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm"
            >
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p>{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
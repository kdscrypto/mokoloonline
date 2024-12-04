import React from 'react';
import { Lock, Shield, UserCheck, AlertTriangle } from 'lucide-react';

export function SecurityMeasures() {
  const measures = [
    {
      icon: Lock,
      title: "Chiffrement des données",
      description: "Toutes vos données personnelles sont chiffrées selon les normes les plus strictes."
    },
    {
      icon: Shield,
      title: "Protection des transactions",
      description: "Nous surveillons en permanence les activités suspectes pour prévenir la fraude."
    },
    {
      icon: UserCheck,
      title: "Vérification des utilisateurs",
      description: "Nous vérifions l'identité des vendeurs pour garantir des échanges sûrs."
    },
    {
      icon: AlertTriangle,
      title: "Système d'alerte",
      description: "Signalement rapide des comportements suspects et des annonces frauduleuses."
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-12">Nos mesures de sécurité</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {measures.map((measure, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <measure.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{measure.title}</h3>
                <p className="text-muted-foreground">{measure.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
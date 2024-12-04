import React from 'react';
import { Shield } from 'lucide-react';

export function SecurityHero() {
  return (
    <section 
      className="relative py-20 px-4 bg-gradient-to-b from-primary/10 to-background"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.95)), url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container mx-auto text-center">
        <div className="flex justify-center mb-6">
          <Shield className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Sécurité sur Mokolo Online</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Votre sécurité est notre priorité. Découvrez les mesures que nous mettons en place 
          pour protéger vos données et transactions.
        </p>
      </div>
    </section>
  );
}
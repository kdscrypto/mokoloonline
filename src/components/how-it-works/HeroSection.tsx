import React from 'react';

export function HeroSection() {
  return (
    <section 
      className="relative py-20 px-4 bg-gradient-to-b from-primary/10 to-background"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.95)), url('https://images.unsplash.com/photo-1604689598793-b8bf1dc445a1?q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Comment ça marche ?</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Découvrez comment utiliser Mokolo Online en quelques étapes simples pour acheter 
          et vendre en toute confiance.
        </p>
      </div>
    </section>
  );
}
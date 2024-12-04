import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Prêt à commencer ?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Rejoignez notre communauté et commencez à publier vos annonces dès aujourd'hui.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/auth">Créer un compte</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/create">Publier une annonce</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
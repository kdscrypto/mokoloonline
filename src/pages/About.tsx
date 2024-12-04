import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section 
          className="relative py-20 px-4 bg-gradient-to-b from-primary/10 to-background"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.95)), url('https://images.unsplash.com/photo-1534531173927-aeb928d54385?q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">À Propos de Mokolo Online</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              La première plateforme de petites annonces au Cameroun, conçue pour simplifier 
              vos achats et ventes en ligne.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Notre Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Mokolo Online a pour mission de révolutionner le commerce en ligne au Cameroun 
                  en offrant une plateforme simple, sécurisée et accessible à tous. Nous 
                  connectons acheteurs et vendeurs pour créer une communauté dynamique 
                  d'échange.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary">✓</span>
                    </div>
                    <p>Publication d'annonces simple et rapide</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary">✓</span>
                    </div>
                    <p>Recherche facilitée par catégories</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary">✓</span>
                    </div>
                    <p>Communication sécurisée entre utilisateurs</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80" 
                  alt="Entrepreneur camerounais" 
                  className="rounded-lg shadow-xl"
                />
                <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  <div className="text-center">
                    <div className="text-2xl">100%</div>
                    <div className="text-xs">Camerounais</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4 bg-secondary/10">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Nos Valeurs</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Simplicité",
                  description: "Une interface intuitive pour une expérience utilisateur optimale."
                },
                {
                  title: "Sécurité",
                  description: "Protection des données et transactions sécurisées pour nos utilisateurs."
                },
                {
                  title: "Proximité",
                  description: "Un service client réactif et une communauté solidaire."
                }
              ].map((value, index) => (
                <div 
                  key={index}
                  className="bg-background p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Rejoignez Mokolo Online</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Découvrez une nouvelle façon d'acheter et de vendre au Cameroun. 
              Créez votre compte gratuitement et commencez dès aujourd'hui !
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/auth">Créer un compte</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/">Découvrir les annonces</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
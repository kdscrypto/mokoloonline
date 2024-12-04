import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
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

        {/* Steps Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="space-y-12">
              {[
                {
                  title: "1. Créez votre compte",
                  description: "Inscrivez-vous gratuitement en quelques clics. Un compte vous permet de publier des annonces et de contacter les vendeurs.",
                  image: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?q=80"
                },
                {
                  title: "2. Publiez votre annonce",
                  description: "Ajoutez des photos, une description détaillée et fixez votre prix. Plus votre annonce est complète, plus elle a de chances d'attirer l'attention.",
                  image: "https://images.unsplash.com/photo-1586880244406-556ebe35f282?q=80"
                },
                {
                  title: "3. Gérez vos contacts",
                  description: "Recevez les messages des acheteurs intéressés et communiquez directement avec eux via notre plateforme sécurisée.",
                  image: "https://images.unsplash.com/photo-1573497161161-c3e73707e25c?q=80"
                }
              ].map((step, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-full md:w-1/2">
                    <img 
                      src={step.image} 
                      alt={step.title} 
                      className="rounded-lg shadow-lg object-cover h-64 w-full"
                    />
                  </div>
                  <div className="w-full md:w-1/2 space-y-4">
                    <h3 className="text-2xl font-bold">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-secondary/10">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">Nos garanties</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
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
              ].map((feature, index) => (
                <div key={index} className="bg-background p-6 rounded-lg shadow-sm">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
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
      </main>

      <Footer />
    </div>
  );
}
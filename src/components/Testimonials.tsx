import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Mama Esther Ngandjou",
    role: "Commerçante",
    content: "Grâce à MarketCam, je peux vendre mes produits même quand je ne suis pas au marché. C'est vraiment pratique !",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    name: "Pierre Ewane",
    role: "Vendeur de voitures",
    content: "Je trouve facilement des clients sérieux pour mes véhicules. La plateforme est simple à utiliser même pour nous les moins jeunes.",
    avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    name: "Florence Atangana",
    role: "Cliente fidèle",
    content: "Je fais toutes mes courses ici maintenant. Les prix sont bons et on peut négocier directement avec les vendeurs.",
    avatar: "https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?auto=format&fit=crop&q=80&w=200&h=200"
  }
];

export function Testimonials() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/10 pointer-events-none" />
      <div className="container relative">
        <h2 className="text-3xl font-bold text-center mb-12 gradient-text">Ce que disent nos utilisateurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glass-effect hover-card">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <Avatar className="h-16 w-16 ring-2 ring-primary/20 ring-offset-2">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.split(' ')[0][0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium gradient-text">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                  <p className="text-muted-foreground italic">{testimonial.content}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
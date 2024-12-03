import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Mama Esther Ngandjou",
    role: "Commerçante",
    content: "Grâce à MarketCam, je peux vendre mes produits même quand je ne suis pas au marché. C'est vraiment pratique !",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    name: "Pierre Ewane",
    role: "Vendeur de voitures",
    content: "Je trouve facilement des clients sérieux pour mes véhicules. La plateforme est simple à utiliser même pour nous les moins jeunes.",
    avatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    name: "Florence Atangana",
    role: "Cliente fidèle",
    content: "Je fais toutes mes courses ici maintenant. Les prix sont bons et on peut négocier directement avec les vendeurs.",
    avatar: "https://i.pravatar.cc/150?img=3"
  }
];

export function Testimonials() {
  return (
    <section className="py-16 bg-secondary/20">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Ce que disent nos utilisateurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-background">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.split(' ')[0][0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                  <p className="text-muted-foreground">{testimonial.content}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sophie M.",
    role: "Acheteuse",
    content: "J'ai trouvé exactement ce que je cherchais en quelques clics. Le processus était simple et rapide !",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    name: "Thomas K.",
    role: "Vendeur vérifié",
    content: "Grâce à MarketCam, j'ai pu développer mon activité et toucher plus de clients. Une excellente plateforme !",
    avatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    name: "Marie L.",
    role: "Cliente régulière",
    content: "Je recommande vivement cette plateforme. Les vendeurs sont sérieux et les prix sont transparents.",
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
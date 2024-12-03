import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImagePlus } from "lucide-react";

export default function CreateListing() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <form className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">Publier une annonce</h1>
          
          <div className="space-y-2">
            <Label htmlFor="title">Titre de l'annonce</Label>
            <Input id="title" placeholder="Ex: iPhone 12 Pro Max - Excellent état" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Prix (FCFA)</Label>
            <Input id="price" type="number" placeholder="Ex: 350000" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Localisation</Label>
            <Input id="location" placeholder="Ex: Douala, Littoral" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Décrivez votre article en détail..."
              className="h-32"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Photos</Label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Cliquez ou glissez-déposez vos photos ici
              </p>
            </div>
          </div>
          
          <Button type="submit" className="w-full">
            Publier l'annonce
          </Button>
        </form>
      </Card>
    </div>
  );
}
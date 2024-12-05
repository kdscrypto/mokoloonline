import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ListingFormFields } from "@/components/listing/ListingFormFields";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { data: listing, isLoading: isLoadingListing } = useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('listings')
        .update({
          title: formData.title,
          description: formData.description,
          price: parseInt(formData.price),
          location: formData.location,
          category: formData.category,
          phone: formData.phone,
          whatsapp: formData.whatsapp,
        })
        .eq('id', id);

      if (error) throw error;

      toast.success("Annonce mise à jour avec succès");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error updating listing:", error);
      toast.error(error.message || "Erreur lors de la mise à jour de l'annonce");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingListing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Annonce introuvable</h2>
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour au tableau de bord
          </Button>
        </div>
      </div>
    );
  }

  const formData = {
    title: listing.title,
    description: listing.description || "",
    price: listing.price.toString(),
    location: listing.location,
    category: listing.category,
    phone: listing.phone || "",
    whatsapp: listing.whatsapp || "",
    image: null,
    isVip: listing.is_vip || false,
    vipDuration: 30,
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleVipChange = (value: { isVip: boolean, duration?: number }) => {
    setFormData(prev => ({
      ...prev,
      isVip: value.isVip,
      vipDuration: value.duration || prev.vipDuration
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour au tableau de bord
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Modifier l'annonce</h1>
          <form onSubmit={handleSubmit}>
            <ListingFormFields
              formData={formData}
              handleInputChange={handleInputChange}
              handleCategoryChange={handleCategoryChange}
              handleImageChange={handleImageChange}
              handleVipChange={handleVipChange}
            />
            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? "Mise à jour en cours..." : "Mettre à jour l'annonce"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
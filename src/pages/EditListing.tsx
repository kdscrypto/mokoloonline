import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ListingFormFields } from "@/components/listing/ListingFormFields";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: listing, isLoading } = useQuery({
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

  const handleSubmit = async (formData: any) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({
          title: formData.title,
          description: formData.description,
          price: formData.price,
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
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
          {listing && (
            <ListingFormFields
              initialData={listing}
              onSubmit={handleSubmit}
              submitButtonText="Mettre à jour l'annonce"
            />
          )}
        </div>
      </div>
    </div>
  );
}
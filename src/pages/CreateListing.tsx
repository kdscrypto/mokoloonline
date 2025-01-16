import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ListingFormFields } from "@/components/listing/ListingFormFields";
import { useListingForm } from "@/hooks/useListingForm";
import { addDays } from "date-fns";

export default function CreateListing() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    formData,
    handleInputChange,
    handleCategoryChange,
    handleImageChange,
    handleVipChange,
    validateFormData
  } = useListingForm();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        toast.error("Vous devez être connecté pour créer une annonce");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFormData()) return;
    
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Non authentifié");
        navigate("/auth");
        return;
      }

      let image_url = null;
      if (formData.image) {
        // Generate a unique filename using UUID
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError, data } = await supabase.storage
          .from('listings')
          .upload(fileName, formData.image, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          toast.error("Erreur lors du téléchargement de l'image");
          return;
        }

        // Get the public URL after successful upload
        const { data: { publicUrl } } = supabase.storage
          .from('listings')
          .getPublicUrl(fileName);
          
        image_url = publicUrl;
      }

      const vip_until = formData.isVip ? addDays(new Date(), formData.vipDuration).toISOString() : null;

      const { error } = await supabase.from('listings').insert({
        title: formData.title,
        price: parseInt(formData.price),
        location: formData.location,
        description: formData.description,
        image_url,
        user_id: user.id,
        status: 'pending',
        category: formData.category || 'Autres',
        phone: formData.phone || null,
        whatsapp: formData.whatsapp || null,
        is_vip: formData.isVip,
        vip_until
      });

      if (error) {
        console.error("Error creating listing:", error);
        toast.error("Erreur lors de la création de l'annonce");
        return;
      }

      toast.success("Annonce créée avec succès ! Elle sera visible après validation.");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error creating listing:", error);
      toast.error(error.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold">Publier une annonce</h1>
          
          <ListingFormFields
            formData={formData}
            handleInputChange={handleInputChange}
            handleCategoryChange={handleCategoryChange}
            handleImageChange={handleImageChange}
            handleVipChange={handleVipChange}
          />
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Publication en cours..." : "Publier l'annonce"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
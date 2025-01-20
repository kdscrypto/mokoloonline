import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ListingFormFields } from "@/components/listing/ListingFormFields";
import { useListingForm } from "@/hooks/useListingForm";
import { addDays } from "date-fns";
import { useSession } from "@/hooks/use-session";

export default function CreateListing() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useSession();
  const {
    formData,
    handleInputChange,
    handleCategoryChange,
    handleImageChange,
    handleVipChange,
    validateFormData
  } = useListingForm();

  useEffect(() => {
    if (!session) {
      navigate("/auth");
      toast.error("Vous devez être connecté pour créer une annonce");
    }
  }, [session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!validateFormData()) {
        return;
      }

      if (!session?.user) {
        toast.error("Vous devez être connecté pour créer une annonce");
        navigate("/auth");
        return;
      }
      
      setIsLoading(true);
      console.log("Starting listing creation process...");

      let image_url = null;
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${session.user.id}/${crypto.randomUUID()}.${fileExt}`;

        console.log("Uploading image with path:", fileName);

        const { error: uploadError, data } = await supabase.storage
          .from('listings')
          .upload(fileName, formData.image, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          throw new Error("Erreur lors du téléchargement de l'image");
        }

        const { data: { publicUrl } } = supabase.storage
          .from('listings')
          .getPublicUrl(fileName);
          
        image_url = publicUrl;
        console.log("Image uploaded successfully, public URL:", image_url);
      }

      const vip_until = formData.isVip ? addDays(new Date(), formData.vipDuration).toISOString() : null;

      const { error: insertError } = await supabase.from('listings').insert({
        title: formData.title,
        price: parseInt(formData.price),
        location: formData.location,
        description: formData.description,
        image_url,
        user_id: session.user.id,
        status: 'pending',
        category: formData.category || 'Autres',
        phone: formData.phone || null,
        whatsapp: formData.whatsapp || null,
        is_vip: formData.isVip,
        vip_until
      });

      if (insertError) {
        console.error("Error inserting listing:", insertError);
        throw insertError;
      }

      console.log("Listing created successfully");
      toast.success("Annonce créée avec succès ! Elle sera visible après validation.");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      toast.error(error.message || "Une erreur est survenue lors de la création de l'annonce");
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return null;
  }

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
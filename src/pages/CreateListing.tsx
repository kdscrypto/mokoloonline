import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ListingFormFields } from "@/components/listing/ListingFormFields";
import { addDays } from "date-fns";

export default function CreateListing() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    location: "",
    description: "",
    category: "",
    phone: "",
    whatsapp: "",
    image: null as File | null,
    isVip: false,
    vipDuration: 30,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        toast.error("Vous devez être connecté pour créer une annonce");
      }
    });
  }, [navigate]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      let image_url = null;
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('listings')
          .upload(fileName, formData.image);

        if (uploadError) throw uploadError;
        if (data) {
          const { data: { publicUrl } } = supabase.storage
            .from('listings')
            .getPublicUrl(data.path);
          image_url = publicUrl;
        }
      }

      // Calculate vip_until date based on the selected duration
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

      if (error) throw error;

      toast.success("Annonce créée avec succès ! Elle sera visible après validation.");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
      console.error("Error creating listing:", error);
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
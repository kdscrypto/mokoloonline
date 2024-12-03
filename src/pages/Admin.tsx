import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ListingsTable } from "@/components/admin/ListingsTable";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Listing } from "@/integrations/supabase/types/listing";

export default function Admin() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
    fetchListings();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data: adminData, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("user_id", session.user.id);

    if (error) {
      toast.error("Erreur lors de la vérification des droits d'accès");
      navigate("/");
      return;
    }

    if (!adminData || adminData.length === 0) {
      toast.error("Accès non autorisé");
      navigate("/");
      return;
    }
  };

  const fetchListings = async () => {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erreur lors du chargement des annonces");
      return;
    }

    const typedListings = (data || []).map(listing => ({
      ...listing,
      status: (listing.status || 'pending') as Listing['status']
    }));

    setListings(typedListings);
    setIsLoading(false);
  };

  const handleStatusUpdate = async (id: string, status: Listing['status']) => {
    const { error } = await supabase
      .from("listings")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Error updating status:", error);
      toast.error("Erreur lors de la mise à jour du statut");
      return;
    }

    toast.success(`Annonce ${status === 'approved' ? 'approuvée' : 'rejetée'}`);
    fetchListings();
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Administration des annonces</h1>
      </div>
      <ListingsTable 
        listings={listings}
        onApprove={(id) => handleStatusUpdate(id, 'approved')}
        onReject={(id) => handleStatusUpdate(id, 'rejected')}
      />
    </div>
  );
}
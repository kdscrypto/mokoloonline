import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ListingsTable } from "@/components/admin/ListingsTable";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Listing } from "@/integrations/supabase/types/listing";
import { useQuery } from "@tanstack/react-query";

export default function Admin() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin access
  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Vous devez être connecté");
        navigate("/auth");
        return;
      }

      const { data: adminData, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (error || !adminData) {
        toast.error("Accès non autorisé");
        navigate("/");
        return;
      }

      setIsAdmin(true);
    };

    checkAdminAccess();
  }, [navigate]);

  // Fetch listings using React Query
  const { data: listings = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Erreur lors du chargement des annonces");
        throw error;
      }

      return data as Listing[];
    },
    enabled: isAdmin, // Only fetch when user is confirmed as admin
  });

  const handleStatusUpdate = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from("listings")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) {
        toast.error("Erreur lors de la mise à jour du statut");
        return;
      }

      toast.success(newStatus === 'approved' ? "Annonce approuvée" : "Annonce rejetée");
      refetch(); // Refresh the listings after update
    } catch (error) {
      console.error("Error in handleStatusUpdate:", error);
      toast.error("Une erreur est survenue lors de la mise à jour");
    }
  };

  if (!isAdmin) {
    return <div className="container mx-auto p-4">Vérification des droits d'accès...</div>;
  }

  if (isLoading) {
    return <div className="container mx-auto p-4">Chargement des annonces...</div>;
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
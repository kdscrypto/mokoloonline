import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ListingsTable } from "@/components/admin/ListingsTable";
import { toast } from "sonner";
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

    const { data: adminData } = await supabase
      .from("admin_users")
      .select("*")
      .single();

    if (!adminData) {
      toast.error("Accès non autorisé");
      navigate("/");
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

    setListings(data || []);
    setIsLoading(false);
  };

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from("listings")
      .update({ status })
      .eq("id", id);

    if (error) {
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
      <h1 className="text-2xl font-bold mb-6">Administration des annonces</h1>
      <ListingsTable 
        listings={listings}
        onApprove={(id) => handleStatusUpdate(id, 'approved')}
        onReject={(id) => handleStatusUpdate(id, 'rejected')}
      />
    </div>
  );
}
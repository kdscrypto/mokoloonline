import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Plus, LogOut, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { ListingsTable } from "@/components/dashboard/ListingsTable";
import type { Listing } from "@/integrations/supabase/types/listing";

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: listings = [], refetch } = useQuery({
    queryKey: ['my-listings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Listing[];
    },
  });

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        toast.error("Vous devez être connecté pour accéder au tableau de bord");
      }
    });
  }, [navigate]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Annonce supprimée avec succès");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    }
  };

  // Calculate statistics
  const totalListings = listings.length;
  const pendingListings = listings.filter(l => l.status === 'pending').length;
  const approvedListings = listings.filter(l => l.status === 'approved').length;
  const rejectedListings = listings.filter(l => l.status === 'rejected').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour aux annonces
          </Button>
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
        </div>
        <div className="flex gap-4">
          <Link to="/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle annonce
            </Button>
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total des annonces</h3>
          <p className="text-3xl font-bold text-primary">{totalListings}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">En attente</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingListings}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Approuvées</h3>
          <p className="text-3xl font-bold text-green-600">{approvedListings}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Rejetées</h3>
          <p className="text-3xl font-bold text-red-600">{rejectedListings}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Mes annonces</h2>
          <ListingsTable listings={listings} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, LogOut, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Tables } from "@/integrations/supabase/types";

type Listing = Tables<"listings">;

export default function Dashboard() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        toast.error("Vous devez être connecté pour accéder au tableau de bord");
      }
    });
  }, [navigate]);

  // Initial fetch of listings
  useEffect(() => {
    const fetchListings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error(error.message);
        return;
      }

      setListings(data || []);
    };

    fetchListings();
  }, []);

  // Subscribe to real-time changes
  useEffect(() => {
    const channel = supabase
      .channel('listings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'listings',
        },
        async (payload) => {
          // Refresh the listings when changes occur
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('listings')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) {
            toast.error(error.message);
            return;
          }

          setListings(data || []);
          toast.success("Les données ont été mises à jour en temps réel");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Annonce supprimée avec succès");
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
      toast.success("Déconnexion réussie");
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    }
  };

  // Calculate statistics
  const totalListings = listings.length;
  const activeListings = listings.filter(listing => listing.status === "active").length;
  const pendingListings = listings.filter(listing => listing.status === "pending").length;

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

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total des annonces</h3>
          <p className="text-3xl font-bold text-primary">{totalListings}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Annonces actives</h3>
          <p className="text-3xl font-bold text-green-600">{activeListings}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Annonces en attente</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingListings}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Mes annonces</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="font-medium">{listing.title}</TableCell>
                  <TableCell>{listing.price.toLocaleString()} FCFA</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        listing.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {listing.status === "active" ? "Active" : "En attente"}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(listing.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(listing.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
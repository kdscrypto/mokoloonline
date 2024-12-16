import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Plus, LogOut, ArrowLeft, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ListingsTable } from "@/components/dashboard/ListingsTable";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePerformanceMonitoring } from "@/utils/performance-monitor";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ListingsFilters } from "@/components/dashboard/ListingsFilters";

export default function Dashboard() {
  usePerformanceMonitoring("dashboard");

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: listings = [], refetch: refetchListings } = useQuery({
    queryKey: ['my-listings', statusFilter, sortOrder],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      let query = supabase
        .from('listings')
        .select('*')
        .eq('user_id', user.id);

      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter);
      }

      query = query.order('created_at', { ascending: sortOrder === "asc" });

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
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
      refetchListings();
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

  const handlePhotoUpdate = (newUrl: string) => {
    refetchProfile();
  };

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!profile) return null;

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

      <ProfileCard profile={profile} onPhotoUpdate={handlePhotoUpdate} />
      <DashboardStats listings={listings} />

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Mes annonces</h2>
          
          <ListingsFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />

          <ListingsTable listings={filteredListings} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}
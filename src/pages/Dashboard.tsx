import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { usePerformanceMonitoring } from "@/utils/performance/performance-monitor";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import type { Listing } from "@/integrations/supabase/types/listing";

export default function Dashboard() {
  usePerformanceMonitoring("dashboard");

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Vous devez être connecté pour accéder au tableau de bord");
        navigate("/auth");
        return;
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

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
      
      return data as Listing[];
    },
  });

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

  if (!profile) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader />
      <ProfileCard 
        profile={profile} 
        onPhotoUpdate={refetchProfile}
      />
      <DashboardStats listings={listings} />
      <DashboardContent
        listings={listings}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        sortOrder={sortOrder}
        setSearchQuery={setSearchQuery}
        setStatusFilter={setStatusFilter}
        setSortOrder={setSortOrder}
        onDelete={handleDelete}
      />
    </div>
  );
}

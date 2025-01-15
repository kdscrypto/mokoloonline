import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ListingsTable } from "./ListingsTable";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { ListingsFilters } from "./ListingsFilters";
import type { Listing } from "@/types/listing";

export function ModerationPanel() {
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: listings = [], refetch } = useQuery({
    queryKey: ['pending-listings', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      
      if (error) {
        toast.error("Erreur lors du chargement des annonces");
        throw error;
      }
      
      return data as Listing[];
    },
  });

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from('listings')
      .update({ status: 'approved' })
      .eq('id', id);

    if (error) {
      toast.error("Erreur lors de l'approbation de l'annonce");
      return;
    }

    toast.success("Annonce approuvée avec succès");
    refetch();
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase
      .from('listings')
      .update({ status: 'rejected' })
      .eq('id', id);

    if (error) {
      toast.error("Erreur lors du rejet de l'annonce");
      return;
    }

    toast.success("Annonce rejetée");
    refetch();
  };

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Modération des annonces</h2>
        <div className="flex gap-2">
          <Button 
            variant={statusFilter === "pending" ? "default" : "outline"}
            onClick={() => setStatusFilter("pending")}
          >
            En attente
          </Button>
          <Button 
            variant={statusFilter === "approved" ? "default" : "outline"}
            onClick={() => setStatusFilter("approved")}
          >
            Approuvées
          </Button>
          <Button 
            variant={statusFilter === "rejected" ? "default" : "outline"}
            onClick={() => setStatusFilter("rejected")}
          >
            Rejetées
          </Button>
        </div>
      </div>

      <ListingsFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <ListingsTable
        listings={filteredListings}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
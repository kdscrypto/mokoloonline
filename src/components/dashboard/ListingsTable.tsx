import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CheckSquare } from "lucide-react";
import { ListingStatus } from "./ListingStatus";
import type { Listing } from "@/integrations/supabase/types/listing";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ListingsTableProps {
  listings: Listing[];
  onDelete: (id: string) => void;
}

export function ListingsTable({ listings, onDelete }: ListingsTableProps) {
  const navigate = useNavigate();

  const handleMarkAsSold = async (id: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ status: 'sold' })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error("Error marking listing as sold:", error);
        toast.error("Erreur lors du marquage de l'annonce comme vendue");
        return;
      }
      
      toast.success("Annonce marquée comme vendue");
      window.location.reload();
    } catch (error: any) {
      console.error("Error marking listing as sold:", error);
      toast.error("Erreur lors du marquage de l'annonce comme vendue");
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/edit-listing/${id}`);
  };

  return (
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
              <ListingStatus status={listing.status} />
            </TableCell>
            <TableCell>{new Date(listing.created_at).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleEdit(listing.id)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                {listing.status === 'approved' && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleMarkAsSold(listing.id)}
                    className="hover:bg-green-50"
                  >
                    <CheckSquare className="h-4 w-4 text-green-600" />
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onDelete(listing.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
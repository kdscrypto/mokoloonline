import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, Eye, Crown, Pencil, Trash2, Mail } from "lucide-react";
import { ListingStatus } from "@/components/dashboard/ListingStatus";
import type { Listing } from "@/integrations/supabase/types/listing";
import { useState } from "react";
import { ListingPreviewDialog } from "./ListingPreviewDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ContactDialog } from "@/components/contact/ContactDialog";

interface AdminListingsTableProps {
  listings: Listing[];
  onApprove: (id: string, vipDuration?: number) => void;
  onReject: (id: string) => void;
}

export function ListingsTable({ listings, onApprove, onReject }: AdminListingsTableProps) {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [vipDuration, setVipDuration] = useState<string>("0");
  const [contactOpen, setContactOpen] = useState(false);
  const navigate = useNavigate();

  const handlePreview = (listing: Listing) => {
    setSelectedListing(listing);
    setPreviewOpen(true);
  };

  const handleContact = (listing: Listing) => {
    setSelectedListing(listing);
    setContactOpen(true);
  };

  const handleApprove = (id: string) => {
    const duration = parseInt(vipDuration);
    onApprove(id, duration > 0 ? duration : undefined);
    setVipDuration("0"); // Reset after approval
  };

  const handleEdit = (id: string) => {
    navigate(`/edit-listing/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Annonce supprimée avec succès");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Erreur lors de la suppression de l'annonce");
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Localisation</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing) => (
            <TableRow key={listing.id}>
              <TableCell className="font-medium">{listing.title}</TableCell>
              <TableCell>{listing.price.toLocaleString()} FCFA</TableCell>
              <TableCell>{listing.location}</TableCell>
              <TableCell>
                <ListingStatus status={listing.status || 'pending'} />
              </TableCell>
              <TableCell>
                {listing.is_vip ? (
                  <div className="flex items-center gap-1 text-primary">
                    <Crown className="h-4 w-4" />
                    <span>VIP</span>
                  </div>
                ) : "Normal"}
              </TableCell>
              <TableCell>{new Date(listing.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex gap-2 items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-blue-50"
                    onClick={() => handlePreview(listing)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-blue-50"
                    onClick={() => handleEdit(listing.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-red-50"
                    onClick={() => handleDelete(listing.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-green-50"
                    onClick={() => handleContact(listing)}
                  >
                    <Mail className="h-4 w-4 text-green-600" />
                  </Button>
                  
                  {listing.status === 'pending' && (
                    <>
                      <Select
                        value={vipDuration}
                        onValueChange={setVipDuration}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Durée VIP" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Normal</SelectItem>
                          <SelectItem value="7">VIP - 7 jours</SelectItem>
                          <SelectItem value="14">VIP - 14 jours</SelectItem>
                          <SelectItem value="30">VIP - 30 jours</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        onClick={() => handleApprove(listing.id)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approuver
                      </Button>
                      
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => onReject(listing.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ListingPreviewDialog
        listing={selectedListing}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />

      {selectedListing && (
        <ContactDialog
          open={contactOpen}
          onOpenChange={setContactOpen}
          listing={selectedListing}
        />
      )}
    </>
  );
}
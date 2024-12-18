import { Table, TableBody } from "@/components/ui/table";
import type { Listing } from "@/integrations/supabase/types/listing";
import { useState } from "react";
import { ListingPreviewDialog } from "./ListingPreviewDialog";
import { ContactDialog } from "@/components/contact/ContactDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { TableHeader } from "./table/TableHeader";
import { TableRow } from "./table/TableRow";

interface ListingsTableProps {
  listings: Listing[];
  onApprove: (id: string, vipDuration?: number) => void;
  onReject: (id: string) => void;
}

export function ListingsTable({ listings, onApprove, onReject }: ListingsTableProps) {
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
    setVipDuration("0");
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
        <TableHeader />
        <TableBody>
          {listings.map((listing) => (
            <TableRow
              key={listing.id}
              listing={listing}
              vipDuration={vipDuration}
              setVipDuration={setVipDuration}
              onPreview={handlePreview}
              onContact={handleContact}
              onApprove={handleApprove}
              onReject={onReject}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
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
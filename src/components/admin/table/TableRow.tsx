import { TableCell, TableRow as UITableRow } from "@/components/ui/table";
import { Crown } from "lucide-react";
import { ListingStatus } from "@/components/dashboard/ListingStatus";
import type { Listing } from "@/integrations/supabase/types/listing";
import { TableActions } from "./TableActions";

interface TableRowProps {
  listing: Listing;
  vipDuration: string;
  setVipDuration: (value: string) => void;
  onPreview: (listing: Listing) => void;
  onContact: (listing: Listing) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TableRow({
  listing,
  vipDuration,
  setVipDuration,
  onPreview,
  onContact,
  onApprove,
  onReject,
  onEdit,
  onDelete,
}: TableRowProps) {
  return (
    <UITableRow>
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
        <TableActions
          listing={listing}
          vipDuration={vipDuration}
          setVipDuration={setVipDuration}
          onPreview={onPreview}
          onContact={onContact}
          onApprove={onApprove}
          onReject={onReject}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TableCell>
    </UITableRow>
  );
}
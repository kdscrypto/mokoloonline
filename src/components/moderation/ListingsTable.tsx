import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { ListingStatus } from "@/components/dashboard/ListingStatus";
import type { Listing } from "@/integrations/supabase/types/listing";

interface ListingsTableProps {
  listings: Listing[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function ListingsTable({ listings, onApprove, onReject }: ListingsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Titre</TableHead>
          <TableHead>Prix</TableHead>
          <TableHead>Localisation</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Date</TableHead>
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
              <ListingStatus status={listing.status} />
            </TableCell>
            <TableCell>{new Date(listing.created_at).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                {listing.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onApprove(listing.id)}
                      className="hover:bg-green-50"
                    >
                      <Check className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onReject(listing.id)}
                      className="hover:bg-red-50"
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
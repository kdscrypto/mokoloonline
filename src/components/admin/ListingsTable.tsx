import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, Eye } from "lucide-react";
import { ListingStatus } from "@/components/dashboard/ListingStatus";
import { Link } from "react-router-dom";
import type { Listing } from "@/integrations/supabase/types/listing";

interface AdminListingsTableProps {
  listings: Listing[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function ListingsTable({ listings, onApprove, onReject }: AdminListingsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Titre</TableHead>
          <TableHead>Prix</TableHead>
          <TableHead>Localisation</TableHead>
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
            <TableCell>{listing.location}</TableCell>
            <TableCell>
              <ListingStatus status={listing.status} />
            </TableCell>
            <TableCell>{new Date(listing.created_at).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Link to={`/listing/${listing.id}`} target="_blank">
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-blue-50"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onApprove(listing.id)}
                  disabled={listing.status === 'approved'}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onReject(listing.id)}
                  disabled={listing.status === 'rejected'}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
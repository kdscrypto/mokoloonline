import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

type StatusType = 'pending' | 'approved' | 'rejected' | 'sold' | string | null;

interface ListingStatusProps {
  status: StatusType;
}

export function ListingStatus({ status }: ListingStatusProps) {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
          En attente
        </Badge>
      );
    case 'approved':
      return (
        <Badge variant="outline" className="text-green-600 border-green-600">
          Approuvée
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="outline" className="text-red-600 border-red-600">
          Rejetée
        </Badge>
      );
    case 'sold':
      return (
        <Badge variant="outline" className="text-blue-600 border-blue-600 flex items-center gap-1">
          <Tag className="h-3 w-3" />
          Vendue
        </Badge>
      );
    default:
      return null;
  }
}
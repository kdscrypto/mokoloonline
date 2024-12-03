import { Badge } from "@/components/ui/badge";
import { ListingStatus as Status } from "@/integrations/supabase/types/listing-status";

const statusConfig = {
  pending: {
    label: "En attente",
    variant: "secondary" as const
  },
  approved: {
    label: "Approuvée",
    variant: "default" as const
  },
  rejected: {
    label: "Rejetée",
    variant: "destructive" as const
  },
  sold: {
    label: "Vendue",
    variant: "outline" as const
  }
};

export function ListingStatus({ status }: { status: Status }) {
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
}
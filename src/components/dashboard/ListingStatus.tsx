import { Badge } from "@/components/ui/badge";
import { ListingStatus as Status } from "@/integrations/supabase/types/listing";

const statusConfig = {
  pending: {
    label: "En attente",
    variant: "warning" as const
  },
  approved: {
    label: "Approuvée",
    variant: "success" as const
  },
  rejected: {
    label: "Rejetée",
    variant: "destructive" as const
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
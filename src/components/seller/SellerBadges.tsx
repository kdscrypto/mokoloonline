import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Shield, Award } from "lucide-react";

interface SellerBadgesProps {
  sellerId: string;
}

const BADGE_CONFIG = {
  trusted_seller: {
    label: "Vendeur de confiance",
    icon: Shield,
    className: "bg-blue-500",
  },
  super_seller: {
    label: "Super vendeur",
    icon: Award,
    className: "bg-purple-500",
  },
};

export function SellerBadges({ sellerId }: SellerBadgesProps) {
  const { data: badges } = useQuery({
    queryKey: ["seller-badges", sellerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seller_badges")
        .select("*")
        .eq("seller_id", sellerId);

      if (error) throw error;
      return data;
    },
  });

  if (!badges?.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => {
        const config = BADGE_CONFIG[badge.badge_type as keyof typeof BADGE_CONFIG];
        if (!config) return null;

        const Icon = config.icon;

        return (
          <Badge
            key={badge.id}
            className={`${config.className} flex items-center gap-1`}
            variant="secondary"
          >
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        );
      })}
    </div>
  );
}
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminCheck } from "@/hooks/use-admin-check";
import { useAdminListings } from "@/hooks/useAdminListings";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ListingsTable } from "@/components/admin/ListingsTable";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { toast } from "sonner";

export default function Admin() {
  const navigate = useNavigate();
  const { isAdmin, isLoading: adminCheckLoading } = useAdminCheck();
  const { listings, isLoading: listingsLoading, handleStatusUpdate } = useAdminListings(true);

  useEffect(() => {
    if (!adminCheckLoading && !isAdmin) {
      toast.error("Accès non autorisé");
      navigate("/");
    }
  }, [isAdmin, adminCheckLoading, navigate]);

  if (adminCheckLoading || listingsLoading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-[400px]">
        <LoadingIndicator size="lg" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <AdminHeader />
      <ListingsTable 
        listings={listings}
        onApprove={(id, vipDuration) => handleStatusUpdate(id, 'approved', vipDuration)}
        onReject={(id) => handleStatusUpdate(id, 'rejected')}
      />
    </div>
  );
}
import { useAdminListings } from "@/hooks/useAdminListings";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ListingsTable } from "@/components/admin/ListingsTable";
import { removeAdminRights } from "@/services/admin-service";
import { useEffect } from "react";

export default function Admin() {
  const { listings, isLoading, handleStatusUpdate } = useAdminListings(true);

  useEffect(() => {
    const removeAdmin = async () => {
      try {
        await removeAdminRights("103e06db-bae8-4829-ae3a-79e7354795e5");
      } catch (error) {
        console.error("Erreur lors de la suppression des droits admin:", error);
      }
    };
    
    removeAdmin();
  }, []);

  if (isLoading) {
    return <div className="container mx-auto p-4">Chargement des annonces...</div>;
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
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { useAdminListings } from "@/hooks/useAdminListings";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ListingsTable } from "@/components/admin/ListingsTable";

export default function Admin() {
  const { isAdmin } = useAdminAccess();
  const { listings, isLoading, handleStatusUpdate } = useAdminListings(isAdmin);

  if (!isAdmin) {
    return <div className="container mx-auto p-4">Vérification des droits d'accès...</div>;
  }

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
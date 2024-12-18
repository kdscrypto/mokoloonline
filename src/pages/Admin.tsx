import { useAdminListings } from "@/hooks/useAdminListings";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ListingsTable } from "@/components/admin/ListingsTable";

export default function Admin() {
  const { listings, isLoading, handleStatusUpdate } = useAdminListings(true);

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
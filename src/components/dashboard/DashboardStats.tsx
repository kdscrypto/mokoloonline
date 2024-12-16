import type { Listing } from "@/integrations/supabase/types/listing";

interface DashboardStatsProps {
  listings: Listing[];
}

export function DashboardStats({ listings }: DashboardStatsProps) {
  const totalListings = listings.length;
  const pendingListings = listings.filter(l => l.status === 'pending').length;
  const approvedListings = listings.filter(l => l.status === 'approved').length;
  const rejectedListings = listings.filter(l => l.status === 'rejected').length;

  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Total des annonces</h3>
        <p className="text-3xl font-bold text-primary">{totalListings}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">En attente</h3>
        <p className="text-3xl font-bold text-yellow-600">{pendingListings}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Approuvées</h3>
        <p className="text-3xl font-bold text-green-600">{approvedListings}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Rejetées</h3>
        <p className="text-3xl font-bold text-red-600">{rejectedListings}</p>
      </div>
    </div>
  );
}
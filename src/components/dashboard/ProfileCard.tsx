import { Card } from "@/components/ui/card";
import { User, Phone } from "lucide-react";
import { ProfilePhotoUpload } from "../profile/ProfilePhotoUpload";
import { QueryObserverResult } from "@tanstack/react-query";

interface ProfileCardProps {
  profile: {
    id: string;
    full_name: string | null;
    username: string | null;
    city: string | null;
    phone: string | null;
    avatar_url: string | null;
  };
  onPhotoUpdate: () => Promise<QueryObserverResult>;
}

export function ProfileCard({ profile, onPhotoUpdate }: ProfileCardProps) {
  return (
    <Card className="p-6 mb-8 bg-[#D3E4FD] rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center gap-4">
        <ProfilePhotoUpload
          currentPhotoUrl={profile.avatar_url}
          userId={profile.id}
          onPhotoUpdate={onPhotoUpdate}
        />
        <div>
          <h2 className="text-xl font-semibold">{profile.full_name || 'Nom non défini'}</h2>
          <div className="flex items-center gap-1 text-gray-600">
            <User className="h-4 w-4" />
            <span>@{profile.username || 'username non défini'}</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-gray-600">
            {profile.city && <span className="mr-4">{profile.city}</span>}
            {profile.phone && (
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>{profile.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
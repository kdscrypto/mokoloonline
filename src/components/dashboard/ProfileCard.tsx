import { Card } from "@/components/ui/card";
import { User } from "lucide-react";
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
    <Card className="p-6 mb-8 bg-white rounded-lg shadow">
      <div className="flex items-center gap-4">
        <ProfilePhotoUpload
          currentPhotoUrl={profile.avatar_url}
          userId={profile.id}
          onPhotoUpdate={onPhotoUpdate}
        />
        <div>
          <h2 className="text-xl font-semibold">{profile.full_name}</h2>
          <p className="text-gray-600">@{profile.username}</p>
          <div className="mt-1 text-sm text-gray-500">
            <span className="mr-4">{profile.city}</span>
            {profile.phone && <span>📞 {profile.phone}</span>}
          </div>
        </div>
      </div>
    </Card>
  );
}
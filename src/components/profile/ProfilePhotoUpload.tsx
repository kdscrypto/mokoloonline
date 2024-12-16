import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "lucide-react";

interface ProfilePhotoUploadProps {
  currentPhotoUrl: string | null;
  userId: string;
  onPhotoUpdate: (url: string) => void;
}

export function ProfilePhotoUpload({ currentPhotoUrl, userId, onPhotoUpdate }: ProfilePhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      setIsUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      onPhotoUpdate(publicUrl);
      toast.success("Photo de profil mise à jour");
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      toast.error("Erreur lors de la mise à jour de la photo");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={currentPhotoUrl || undefined} />
        <AvatarFallback>
          <User className="h-10 w-10" />
        </AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <input
          type="file"
          id="photo-upload"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoUpload}
          disabled={isUploading}
        />
        <label htmlFor="photo-upload">
          <Button variant="outline" className="cursor-pointer" disabled={isUploading} asChild>
            <span>
              {isUploading ? "Téléchargement..." : "Changer la photo"}
            </span>
          </Button>
        </label>
      </div>
    </div>
  );
}
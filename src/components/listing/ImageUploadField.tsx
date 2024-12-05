import { Label } from "@/components/ui/label";
import { ImagePlus } from "lucide-react";

const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface ImageUploadFieldProps {
  image: File | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ImageUploadField({ image, handleImageChange }: ImageUploadFieldProps) {
  return (
    <div className="space-y-2">
      <Label>Photos</Label>
      <div className="border-2 border-dashed rounded-lg p-8 text-center">
        <input
          type="file"
          accept={ALLOWED_FILE_TYPES.join(',')}
          onChange={handleImageChange}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            Cliquez ou glissez-déposez vos photos ici
          </p>
          <p className="mt-1 text-xs text-gray-400">
            JPG, PNG ou WEBP - Max 5MB
          </p>
          {image && (
            <p className="mt-2 text-sm text-green-500">
              Image sélectionnée: {image.name}
            </p>
          )}
        </label>
      </div>
    </div>
  );
}
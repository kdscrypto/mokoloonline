interface ListingImageProps {
  imageUrl?: string;
  title: string;
}

export function ListingImage({ imageUrl, title }: ListingImageProps) {
  return (
    <>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-[400px] object-cover rounded-lg"
        />
      ) : (
        <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Aucune image disponible</p>
        </div>
      )}
    </>
  );
}
export function ListingsLoadingState() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-muted-foreground">Chargement des annonces...</p>
    </div>
  );
}
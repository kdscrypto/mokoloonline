export function Categories() {
  const categories = [
    "Véhicules", 
    "Immobilier", 
    "Électronique", 
    "Services", 
    "Mode", 
    "Emploi"
  ];

  return (
    <div>
      <h4 className="font-bold text-lg mb-6">Catégories</h4>
      <ul className="space-y-3">
        {categories.map((item) => (
          <li key={item}>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
            >
              <span className="h-1 w-1 rounded-full bg-primary/60"></span>
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
import { BrandSection } from "./footer/BrandSection";
import { QuickLinks } from "./footer/QuickLinks";
import { Categories } from "./footer/Categories";
import { BottomBar } from "./footer/BottomBar";

export function Footer() {
  return (
    <footer 
      className="bg-gradient-to-b from-secondary/5 to-secondary/20 pt-16 pb-8 relative"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          <BrandSection />
          <QuickLinks />
          <Categories />
        </div>
        <BottomBar />
      </div>
    </footer>
  );
}
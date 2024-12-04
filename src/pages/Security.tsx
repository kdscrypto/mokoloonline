import { Footer } from "@/components/Footer";
import { SecurityHero } from "@/components/security/SecurityHero";
import { SecurityMeasures } from "@/components/security/SecurityMeasures";
import { SecurityTips } from "@/components/security/SecurityTips";
import { SecurityContact } from "@/components/security/SecurityContact";

export default function Security() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <SecurityHero />
        <SecurityMeasures />
        <SecurityTips />
        <SecurityContact />
      </main>
      <Footer />
    </div>
  );
}
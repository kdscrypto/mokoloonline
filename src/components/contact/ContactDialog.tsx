import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";

export function ContactDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-primary/60"></span>
          Contact
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contactez-nous</DialogTitle>
          <DialogDescription>
            Notre équipe est disponible pour vous aider.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button
            className="w-full justify-start"
            variant="outline"
            onClick={() => window.location.href = 'mailto:237mokoloonline@proton.me'}
          >
            <Mail className="mr-2 h-4 w-4" />
            237mokoloonline@proton.me
          </Button>
          <Button
            className="w-full justify-start"
            variant="outline"
            onClick={() => window.location.href = 'tel:+237670381624'}
          >
            <Phone className="mr-2 h-4 w-4" />
            +237 670 381 624
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
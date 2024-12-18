import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, Mail, Check, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Listing } from "@/integrations/supabase/types/listing";
import { useNavigate } from "react-router-dom";

interface TableActionsProps {
  listing: Listing;
  vipDuration: string;
  setVipDuration: (value: string) => void;
  onPreview: (listing: Listing) => void;
  onContact: (listing: Listing) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TableActions({
  listing,
  vipDuration,
  setVipDuration,
  onPreview,
  onContact,
  onApprove,
  onReject,
  onEdit,
  onDelete,
}: TableActionsProps) {
  const navigate = useNavigate();

  return (
    <div className="flex gap-2 items-center">
      <Button
        variant="outline"
        size="icon"
        className="hover:bg-blue-50"
        onClick={() => onPreview(listing)}
      >
        <Eye className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="hover:bg-blue-50"
        onClick={() => onEdit(listing.id)}
      >
        <Pencil className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="hover:bg-red-50"
        onClick={() => onDelete(listing.id)}
      >
        <Trash2 className="h-4 w-4 text-red-600" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="hover:bg-green-50"
        onClick={() => onContact(listing)}
      >
        <Mail className="h-4 w-4 text-green-600" />
      </Button>
      
      {listing.status === 'pending' && (
        <>
          <Select
            value={vipDuration}
            onValueChange={setVipDuration}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Durée VIP" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Normal</SelectItem>
              <SelectItem value="7">VIP - 7 jours</SelectItem>
              <SelectItem value="14">VIP - 14 jours</SelectItem>
              <SelectItem value="30">VIP - 30 jours</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => onApprove(listing.id)}
          >
            <Check className="h-4 w-4 mr-2" />
            Approuver
          </Button>
          
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onReject(listing.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}
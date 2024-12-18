import {
  TableHead,
  TableHeader as UITableHeader,
  TableRow,
} from "@/components/ui/table";

export function TableHeader() {
  return (
    <UITableHeader>
      <TableRow>
        <TableHead>Titre</TableHead>
        <TableHead>Prix</TableHead>
        <TableHead>Localisation</TableHead>
        <TableHead>Statut</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>Date de création</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </UITableHeader>
  );
}
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Shield } from "lucide-react";
import type { SecurityLog } from "@/integrations/supabase/types";

export function SecurityLogs() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['security-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as SecurityLog[];
    }
  });

  if (isLoading) {
    return <div>Chargement des logs de sécurité...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Logs de Sécurité</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Utilisateur</TableHead>
            <TableHead>IP</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs?.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {log.event_type === 'suspicious_activity' && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  {log.event_type}
                </div>
              </TableCell>
              <TableCell>{log.description}</TableCell>
              <TableCell>{log.user_id || 'N/A'}</TableCell>
              <TableCell>{log.ip_address || 'N/A'}</TableCell>
              <TableCell>
                {new Date(log.created_at).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
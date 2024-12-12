import { toast } from "sonner";
import { PostgrestError } from "@supabase/supabase-js";
import { logSecurityEvent } from "./security-logger";

export async function handleError(error: unknown, context: string) {
  console.error(`Erreur dans ${context}:`, error);

  if (error instanceof Error) {
    await logSecurityEvent({
      event_type: 'api',
      description: `Error in ${context}: ${error.message}`,
      metadata: { stack: error.stack }
    });

    toast.error(error.message);
    return;
  }

  if ((error as PostgrestError).code) {
    const pgError = error as PostgrestError;
    await logSecurityEvent({
      event_type: 'api',
      description: `Database error in ${context}: ${pgError.message}`,
      metadata: { code: pgError.code, details: pgError.details }
    });

    toast.error("Une erreur est survenue lors de l'opération");
    return;
  }

  toast.error("Une erreur inattendue est survenue");
}
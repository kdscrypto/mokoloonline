import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type SecurityLog = Tables<"security_logs">;

interface LogEvent {
  event_type: SecurityLog['event_type'];
  description: string;
  user_id?: string;
  ip_address?: string;
  metadata?: Record<string, unknown>;
}

export async function logSecurityEvent(event: LogEvent) {
  try {
    // Insert directly into the security_logs table instead of using edge function
    const { error } = await supabase
      .from('security_logs')
      .insert([{
        event_type: event.event_type,
        description: event.description,
        user_id: event.user_id,
        ip_address: event.ip_address,
        metadata: event.metadata
      }]);

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error logging security event:', error);
    return null;
  }
}

export async function logFailedLoginAttempt(userId: string, ipAddress: string) {
  return logSecurityEvent({
    event_type: 'auth',
    description: 'Failed login attempt',
    user_id: userId,
    ip_address: ipAddress,
    metadata: {
      timestamp: new Date().toISOString(),
      attempt_count: await getFailedLoginAttempts(userId)
    }
  });
}

async function getFailedLoginAttempts(userId: string): Promise<number> {
  const { count } = await supabase
    .from('security_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('event_type', 'auth')
    .eq('description', 'Failed login attempt')
    .gte('created_at', new Date(Date.now() - 30 * 60 * 1000).toISOString());

  return count || 0;
}
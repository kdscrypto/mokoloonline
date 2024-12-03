import { supabase } from "@/integrations/supabase/client";
import type { SecurityLog } from "@/integrations/supabase/types";

interface LogEvent {
  event_type: SecurityLog['event_type'];
  description: string;
  user_id?: string;
  ip_address?: string;
  metadata?: Record<string, unknown>;
}

export async function logSecurityEvent(event: LogEvent) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/security-logs`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ event }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to log security event');
    }

    return await response.json();
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
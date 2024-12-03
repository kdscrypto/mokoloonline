export interface SecurityLog {
  id: string;
  event_type: 'auth' | 'api' | 'suspicious_activity';
  description: string;
  user_id?: string;
  ip_address?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}
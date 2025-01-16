import type { Tables } from './database';

export type SecurityLog = Tables<'security_logs'>;

export type SecurityLogInsert = {
  event_type: string;
  description: string;
  user_id?: string | null;
  ip_address?: string | null;
  metadata?: any;
};

export type SecurityLogUpdate = Partial<SecurityLogInsert>;
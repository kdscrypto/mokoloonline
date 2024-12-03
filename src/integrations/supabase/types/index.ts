import { Listing } from './listing';
import { SecurityLog } from './security-log';

export type { Listing, SecurityLog };

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      listings: {
        Row: Listing;
        Insert: Omit<Listing, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Listing, 'id' | 'created_at' | 'updated_at'>>;
      };
      security_logs: {
        Row: SecurityLog;
        Insert: Omit<SecurityLog, 'id' | 'created_at'>;
        Update: Partial<Omit<SecurityLog, 'id' | 'created_at'>>;
      };
      Mokolo: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          username: string | null
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
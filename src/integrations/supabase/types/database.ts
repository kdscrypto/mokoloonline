import type { Database as DatabaseGenerated } from '../types';

export type Database = DatabaseGenerated;

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

// Helper type for Supabase client
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never;

// Type-safe equality comparison for table columns
export type ColumnEqualityOperator<T extends keyof Database['public']['Tables'], K extends keyof Database['public']['Tables'][T]['Row']> = 
  Database['public']['Tables'][T]['Row'][K];
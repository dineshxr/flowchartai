import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database types (you'll need to generate these from Supabase)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      ai_usage: {
        Row: {
          id: string;
          user_id: string;
          usage_type: string;
          tokens_used: number;
          model: string | null;
          success: boolean;
          created_at: string;
          metadata: any | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          usage_type: string;
          tokens_used?: number;
          model?: string | null;
          success?: boolean;
          created_at?: string;
          metadata?: any | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          usage_type?: string;
          tokens_used?: number;
          model?: string | null;
          success?: boolean;
          created_at?: string;
          metadata?: any | null;
        };
      };
    };
  };
}

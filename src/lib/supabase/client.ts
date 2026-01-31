import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uywrnrfefmzsgbhewbdi.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5d3JucmZlZm16c2diaGV3YmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMDc0NDYsImV4cCI6MjA4MTU4MzQ0Nn0.kgO4ANhQhiJkDx53DfogR2pFeB_mY__ojBl3VU0ePyc';

  if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase URL and anonymous key are required.');
  }
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

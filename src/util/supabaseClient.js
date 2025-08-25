import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nepstrbszgqczpphhknv.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lcHN0cmJzemdxY3pwcGhoa252Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NTYzMjgsImV4cCI6MjA3MTQzMjMyOH0.4i3GgnzFjVDM5PIcQF3UenLRXDcqGCAzbbFMjH2Uy2Q';

export const supabase = createClient(supabaseUrl, supabaseKey);
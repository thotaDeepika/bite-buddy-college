import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ooyiberijiyjsybjcrmf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9veWliZXJpaml5anN5Ympjcm1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNzA0ODEsImV4cCI6MjA3OTk0NjQ4MX0.BsJJPSQ3LRZXZ8mWK7pvK7SO0LvOFLdK75auRcP4SLE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

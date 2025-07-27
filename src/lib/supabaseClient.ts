import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://anlfuecxbmxsfxywkxtq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFubGZ1ZWN4Ym14c2Z4eXdreHRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNjgxNDgsImV4cCI6MjA2ODg0NDE0OH0.vXcV0yvyAviPT97JdmmMt7TvK5OcWJbx9dGxFWpiSpo';

export const supabase = createClient(supabaseUrl, supabaseKey); 
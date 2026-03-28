import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://olxuxegprcstzlzbskfs.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9seHV4ZWdwcmNzdHpsemJza2ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMzMyOTYsImV4cCI6MjA4NjgwOTI5Nn0.RyzFHTxeNRcMFQJMCL4VSysYRzj0lxkvk-alyagtotk";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

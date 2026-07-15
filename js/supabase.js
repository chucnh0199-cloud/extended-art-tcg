const SUPABASE_URL = "https://ltuxsflkildzuiukifzh.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0dXhzZmxraWxkenVpdWtpZnpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NjI5NzQsImV4cCI6MjA5OTIzODk3NH0.aDcB2hizFpuoSMSpOypv_cUm0kWIGK6YJQpaRIiYb6c";


const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
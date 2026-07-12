const SUPABASE_URL = "https://ltuxsflkildzuiukifzh.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0dXhzZmxraWxkenVpdWtpZnpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NjI5NzQsImV4cCI6MjA5OTIzODk3NH0.aDcB2hizFpuoSMSpOypv_cUm0kWIGK6YJQpaRIiYb6c";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

(async () => {

    const { data } = await supabaseClient.auth.getSession();

    if (!data.session) {

        window.location.href = "admin-login.html";
        return;

    }

    console.log("✅ Đăng nhập hợp lệ");

})();
// ======================
// KẾT NỐI SUPABASE
// ======================

const SUPABASE_URL = "https://ltuxsflkildzuiukifzh.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0dXhzZmxraWxkenVpdWtpZnpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NjI5NzQsImV4cCI6MjA5OTIzODk3NH0.aDcB2hizFpuoSMSpOypv_cUm0kWIGK6YJQpaRIiYb6c";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// ======================
// ĐĂNG NHẬP
// ======================

document
    .getElementById("login-btn")
    .addEventListener("click", login);

async function login(){

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const message =
        document.getElementById("message");

    message.textContent = "";

    const { error } = await supabaseClient.auth.signInWithPassword({

        email,

        password

    });

    if(error){

        message.textContent = "❌ " + error.message;

        return;

    }

    window.location.href = "admin.html";

}
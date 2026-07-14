const SUPABASE_URL = "https://ltuxsflkildzuiukifzh.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0dXhzZmxraWxkenVpdWtpZnpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NjI5NzQsImV4cCI6MjA5OTIzODk3NH0.aDcB2hizFpuoSMSpOypv_cUm0kWIGK6YJQpaRIiYb6c";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

async function checkLogin() {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    console.log("Current session:", session);

    if (!session) {

        window.location.href = "admin-login.html";

        return null;

    }

    return session;

}

async function loadDashboard() {

    try {

        const response = await fetch(
            "https://ltuxsflkildzuiukifzh.supabase.co/functions/v1/get-dashboard"
        );

        const result = await response.json();

        console.log(result);

        if (!result.success) {

            alert(result.error);

            return;

        }

        document.getElementById("total-orders").textContent =
            result.totalOrders;

        document.getElementById("revenue").textContent =
            Number(result.revenue).toLocaleString() + "đ";

        document.getElementById("shipping").textContent =
            result.shipping;

        document.getElementById("completed").textContent =
            result.completed;

        document.getElementById("cancelled").textContent =
            result.cancelled;

    } catch (err) {

        console.error(err);

        alert("Không tải được Dashboard");

    }

}

async function logout() {

    await supabaseClient.auth.signOut();

    window.location.href = "admin-login.html";

}

document.getElementById("logout-btn").onclick = logout;

(async () => {

    const session = await checkLogin();

    if (!session) return;

    await loadDashboard();

})();
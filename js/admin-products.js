const SUPABASE_URL = "...";
const SUPABASE_ANON_KEY = "...";

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

    loadOrders();

})();
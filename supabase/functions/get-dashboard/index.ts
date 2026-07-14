import { corsHeaders } from "../_shared/cors.ts";
import { getSupabase } from "../_shared/supabase.ts";
import { success, failure } from "../_shared/response.ts";

Deno.serve(async (req) => {

    if (req.method === "OPTIONS") {
        return new Response("ok", {
            headers: corsHeaders,
        });
    }

    try {

        const supabase = getSupabase();

        const { data: orders, error } = await supabase
            .from("orders")
            .select("*");

        if (error) throw error;

        const totalOrders = orders.length;

        const revenue = orders
            .filter(o => o.status === "completed")
            .reduce((sum, o) => sum + Number(o.total || 0), 0);

        const shipping = orders.filter(o => o.status === "shipping").length;

        const completed = orders.filter(o => o.status === "completed").length;

        const cancelled = orders.filter(o => o.status === "cancelled").length;

        return success({
            totalOrders,
            revenue,
            shipping,
            completed,
            cancelled
        });

    } catch (err) {

        console.error(err);

        return failure(err);

    }

});
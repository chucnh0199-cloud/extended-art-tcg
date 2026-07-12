import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS"
};

Deno.serve(async (req) => {

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders
    });
  }

  try {

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: orders, error } = await supabase
      .from("orders")
      .select("*");

    if (error) throw error;

    const totalOrders = orders.length;

    const completed = orders.filter(o => o.status === "Hoàn thành").length;

    const shipping = orders.filter(o => o.status === "Đang giao").length;

    const cancelled = orders.filter(o => o.status === "Đã hủy").length;

    const revenue = orders
      .filter(o => o.status === "Hoàn thành")
      .reduce((sum, o) => sum + Number(o.total), 0);

    return Response.json(
      {
        success: true,
        totalOrders,
        completed,
        shipping,
        cancelled,
        revenue
      },
      {
        headers: corsHeaders
      }
    );

  } catch (err) {

    return Response.json(
      {
        success: false,
        error: String(err)
      },
      {
        status: 500,
        headers: corsHeaders
      }
    );

  }

});
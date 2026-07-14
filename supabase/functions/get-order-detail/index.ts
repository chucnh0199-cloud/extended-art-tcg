import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { order_id } = await req.json();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (orderError) throw orderError;

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select(`
        *,
        products(
          name,
          image
        )
      `)
      .eq("order_id", order_id);

    if (itemsError) throw itemsError;

    const formattedItems = items.map(item => ({

      ...item,

      product_name: item.products?.name,

      product_image: item.products?.image

    }));

    return Response.json(
      {
        success: true,
        order,
        items: formattedItems,
      },
      {
        headers: corsHeaders,
      }
    );

  } catch (err) {

  console.error(err);

  return Response.json(
    {
      success: false,
      error: err.message ?? JSON.stringify(err),
    },
      {
        status: 500,
        headers: corsHeaders,
      }
    );

  }

});
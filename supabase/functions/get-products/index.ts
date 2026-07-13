import { corsHeaders } from "../_shared/cors.ts";
import { getSupabase } from "../_shared/supabase.ts";

Deno.serve(async (req) => {

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return Response.json(
      {
        success: true,
        products: data,
      },
      {
        headers: corsHeaders,
      }
    );

  } catch (err) {

    return Response.json(
      {
        success: false,
        error: err.message ?? String(err),
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );

  }

});
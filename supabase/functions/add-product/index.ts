import { createClient } from "jsr:@supabase/supabase-js@2";

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

    const {
      name,
      category,
      price,
      image
    } = await req.json();

    if (!name || !price || !image) {

      return Response.json(
        {
          success: false,
          error: "Thiếu thông tin sản phẩm"
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );

    }

    const { error } = await supabase
      .from("products")
      .insert({
        name,
        category,
        price,
        image
      });

    if (error) throw error;

    return Response.json(
      {
        success: true
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
        error: String(err),
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );

  }

});
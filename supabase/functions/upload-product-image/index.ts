import { createClient } from "@supabase/supabase-js";

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

    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {

      return Response.json(
        {
          success: false,
          error: "Không có file"
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );

    }

    const fileName =
      `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return Response.json(
      {
        success: true,
        url: data.publicUrl
      },
      {
        headers: corsHeaders,
      }
    );

  } catch (err) {

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
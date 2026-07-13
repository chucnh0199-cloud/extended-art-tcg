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

    const { id, image } = await req.json();

if (image) {

    const fileName = image.split("/").pop();

    if (fileName) {

        const { error: storageError } = await supabase.storage
            .from("product-images")
            .remove([fileName]);

        if (storageError) {
            console.error("Storage:", storageError);
        }

    }

}

const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

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

    return Response.json(
      {
        success: false,
        error: String(err)
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );

  }

});
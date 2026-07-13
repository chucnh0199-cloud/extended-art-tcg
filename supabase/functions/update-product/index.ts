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

    const {
      id,
      name,
      category,
      price,
      image
    } = await req.json();

    if (!id) {
      return failure("Thiếu ID sản phẩm", 400);
    }

    const { error } = await supabase
      .from("products")
      .update({
        name,
        category,
        price,
        image
      })
      .eq("id", id);

    if (error) throw error;

    return success();

  } catch (err) {

    console.error(err);

    return failure(err);

  }

});
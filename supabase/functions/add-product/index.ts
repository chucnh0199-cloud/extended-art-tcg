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
      name,
      category,
      price,
      image
    } = await req.json();

    if (!name || !price || !image) {

      return failure("Thiếu thông tin sản phẩm", 400);

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

    return success();

  } catch (err) {

    console.error(err);

    return failure(err);

  }

});
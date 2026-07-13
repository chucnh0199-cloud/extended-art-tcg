import { corsHeaders } from "../_shared/cors.ts";
import { getSupabase } from "../_shared/supabase.ts";
import { success, failure } from "../_shared/response.ts";
import { deleteImage } from "../_shared/storage.ts";

Deno.serve(async (req) => {

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {

    const supabase = getSupabase();

    const { id, image } = await req.json();

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;

    await deleteImage(image);

    return success();

  } catch (err) {

    console.error(err);
    
    return failure(err);

  }

});
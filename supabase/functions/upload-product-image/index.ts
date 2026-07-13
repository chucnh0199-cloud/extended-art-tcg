import { corsHeaders } from "../_shared/cors.ts";
import { success, failure } from "../_shared/response.ts";
import { uploadImage } from "../_shared/storage.ts";

Deno.serve(async (req) => {

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {

    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return failure("Không tìm thấy file", 400);
    }

    const publicUrl = await uploadImage(file);

    return success({
      url: publicUrl
    });

  } catch (err) {

    console.error(err);

    return failure(err);

  }

});
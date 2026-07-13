import { getSupabase } from "./supabase.ts";

const BUCKET = "product-images";

export async function uploadImage(file: File) {

  const supabase = getSupabase();

  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file);

  if (error) throw error;

  return supabase.storage
    .from(BUCKET)
    .getPublicUrl(fileName)
    .data.publicUrl;

}

export async function deleteImage(imageUrl: string) {

  if (!imageUrl) return;

  const supabase = getSupabase();

  try {

    const url = new URL(imageUrl);

    const fileName = url.pathname.split("/").pop();

    if (!fileName) return;

    const { error } = await supabase.storage
      .from(BUCKET)
      .remove([fileName]);

    if (error) throw error;

  } catch {

    console.warn("Image URL không hợp lệ:", imageUrl);

  }

}
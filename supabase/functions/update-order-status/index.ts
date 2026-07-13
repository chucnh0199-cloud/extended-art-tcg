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

const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
const CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID")!;
    
    const { order_id, status } = await req.json();

const { data: order, error: orderError } = await supabase
  .from("orders")
  .select("*")
  .eq("id", order_id)
  .single();

if (orderError) throw orderError;

    const { error } = await supabase
      .from("orders")
      .update({
        status: status
      })
      .eq("id", order_id);

    if (error) throw error;

try {

  const message =
`🔔 CẬP NHẬT ĐƠN HÀNG

🆔 ${order.order_code}

👤 ${order.customer_name}

📞 ${order.phone}

📦 Trạng thái mới:

${status}

💰 ${Number(order.total).toLocaleString()}đ`;

  await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
      }),
    }
  );

} catch (telegramError) {

  console.error("Telegram:", telegramError);

}

    return Response.json(
      {
        success: true
      },
      {
        headers: corsHeaders
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
        headers: corsHeaders
      }
    );

  }
});

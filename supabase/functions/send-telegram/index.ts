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
    const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
    const CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID")!;

    const body = await req.json();

    const text =
      body.message ??
      "🎉 Website Extended Art đã kết nối Telegram thành công!";

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text,
        }),
      }
    );

    const result = await response.json();

    if (!result.ok) {
      throw new Error(result.description);
    }

    return Response.json(
      {
        success: true,
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
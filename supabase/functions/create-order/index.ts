import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  // Xử lý CORS
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

    const body = await req.json();

    const {
      customer_name,
      phone,
      address,
      note,
      total,
      items,
    } = body;

    // Kiểm tra dữ liệu
    if (
      !customer_name ||
      !phone ||
      !address ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return Response.json(
        {
          success: false,
          error: "Thiếu thông tin đơn hàng",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Tạo mã đơn
    const orderCode =
      "ORD-" +
      new Date().getTime();

    // Lưu orders
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_code: orderCode,
        customer_name,
        phone,
        address,
        note,
        total,
        status: "Chờ xác nhận",
      })
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    // Chuẩn bị dữ liệu order_items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_name: item.product_name,
      product_image: item.product_image,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.subtotal,
    }));

    const { error: itemError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemError) {
      throw itemError;
    }

    return Response.json(
      {
        success: true,
        orderId: order.order_code,
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
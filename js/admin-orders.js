const SUPABASE_URL = "https://ltuxsflkildzuiukifzh.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0dXhzZmxraWxkenVpdWtpZnpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NjI5NzQsImV4cCI6MjA5OTIzODk3NH0.aDcB2hizFpuoSMSpOypv_cUm0kWIGK6YJQpaRIiYb6c";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

(async () => {

    const { data } = await supabaseClient.auth.getSession();

    if (!data.session) {

        window.location.href = "admin-login.html";

        return;

    }

})();

async function loadOrders(){

    try{

        const response = await fetch(
            "https://ltuxsflkildzuiukifzh.supabase.co/functions/v1/get-orders"
        );

        const result = await response.json();

        if(!result.success){

            throw new Error(result.error);

        }

        ordersList.innerHTML = "";

        result.orders.forEach(order=>{

            const card = document.createElement("div");

            card.className="order-card";

            card.innerHTML = `

                <div class="order-row">

                    <strong>Mã đơn</strong>

                    <span>${order.order_code}</span>

                </div>

                <div class="order-row">

                    <strong>Khách hàng</strong>

                    <span>${order.customer_name}</span>

                </div>

                <div class="order-row">

                    <strong>SĐT</strong>

                    <span>${order.phone}</span>

                </div>

                <div class="order-row">

                    <strong>Tổng tiền</strong>

                    <span>${Number(order.total).toLocaleString()}đ</span>

                </div>

                <div class="order-row">

                    <strong>Trạng thái</strong>

                    <span class="status">${order.status}</span>

                </div>

                <button onclick="viewOrder(${order.id})">

                    Xem chi tiết

                </button>

            `;

            ordersList.appendChild(card);

        });

    }

    catch(err){

        console.error(err);

    }

}
// ======================
// XEM CHI TIẾT ĐƠN HÀNG
// ======================

async function viewOrder(id){

    try{

        const response = await fetch(
            "https://ltuxsflkildzuiukifzh.supabase.co/functions/v1/get-order-detail",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    order_id:id
                })
            }
        );

        const result = await response.json();

        if(!result.success){

            throw new Error(result.error);

        }

        const order = result.order;

        const items = result.items;

        modalBody.innerHTML = `

            <h2>${order.order_code}</h2>

            <p><strong>Khách hàng:</strong> ${order.customer_name}</p>

            <p><strong>SĐT:</strong> ${order.phone}</p>

            <p><strong>Địa chỉ:</strong> ${order.address}</p>

            <p><strong>Ghi chú:</strong> ${order.note ?? "Không có"}</p>

            <hr>

            <h3>Sản phẩm</h3>

            ${items.map(item => `

                <div style="display:flex;gap:15px;align-items:center;margin:15px 0;">

                    <img
                        src="${item.product_image}"
                        width="80"
                        height="110"
                        style="object-fit:cover;border-radius:8px;"
                    >

                    <div>

                        <strong>${item.product_name}</strong>

                        <p>Số lượng: ${item.quantity}</p>

                        <p>Đơn giá:
                            ${Number(item.price).toLocaleString()}đ
                        </p>

                        <p>Thành tiền:
                            ${Number(item.subtotal).toLocaleString()}đ
                        </p>

                    </div>

                </div>

            `).join("")}

            <hr>

            <h2>

                Tổng cộng:

                ${Number(order.total).toLocaleString()}đ

            </h2>

            <hr>

            <h3>Cập nhật trạng thái</h3>

            <div class="status-buttons">

                <button onclick="updateStatus(${order.id}, 'Chờ xác nhận')">

                    🟡 Chờ xác nhận

                </button>

                <button onclick="updateStatus(${order.id}, 'Đã xác nhận')">

                    🔵 Đã xác nhận

                </button>

                <button onclick="updateStatus(${order.id}, 'Đang giao')">

                    🚚 Đang giao

                </button>

                <button onclick="updateStatus(${order.id}, 'Hoàn thành')">

                    ✅ Hoàn thành

                </button>

                <button onclick="updateStatus(${order.id}, 'Đã hủy')">

                    ❌ Đã hủy

                </button>

            </div>

        `;

        modal.style.display = "block";

    }

    catch(err){

        console.error(err);

        alert("❌ Không thể tải chi tiết đơn hàng.");

    }

}
// ======================
// CẬP NHẬT TRẠNG THÁI
// ======================

document.getElementById("logout-btn").onclick = async () => {

    await supabaseClient.auth.signOut();

    window.location.href = "admin-login.html";

};

async function loadDashboard(){

    const response = await fetch(
        "https://ltuxsflkildzuiukifzh.supabase.co/functions/v1/get-dashboard"
    );

    const result = await response.json();

    if(!result.success){

        console.log(result.error);

        return;

    }

    document.getElementById("total-orders").textContent =
        result.totalOrders;

    document.getElementById("revenue").textContent =
        Number(result.revenue).toLocaleString() + "đ";

    document.getElementById("shipping").textContent =
        result.shipping;

    document.getElementById("completed").textContent =
        result.completed;

    document.getElementById("cancelled").textContent =
        result.cancelled;

}


// ======================
// KHỞI ĐỘNG
// ======================
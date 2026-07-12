console.log("ADMIN JS ĐÃ CHẠY");

const ordersList = document.getElementById("orders-list");

async function loadOrders() {

    console.log("LOAD ORDERS");

    try {

        console.log("Chuẩn bị gọi get-orders");

        const response = await fetch(
            "https://ltuxsflkildzuiukifzh.supabase.co/functions/v1/get-orders"
        );

        console.log("Status:", response.status);

        const result = await response.json();

        console.log("Result:", result);

        if (!result.success) {
            throw new Error(result.error);
        }

        // phần còn lại giữ nguyên...

        ordersList.innerHTML = "";

        result.orders.forEach(order => {

            const card = document.createElement("div");

            card.className = "order-card";

            card.innerHTML = `

                <div class="order-row">
                    <strong>Mã đơn:</strong>
                    <span>${order.order_code}</span>
                </div>

                <div class="order-row">
                    <strong>Khách hàng:</strong>
                    <span>${order.customer_name}</span>
                </div>

                <div class="order-row">
                    <strong>Điện thoại:</strong>
                    <span>${order.phone}</span>
                </div>

                <div class="order-row">
                    <strong>Tổng tiền:</strong>
                    <span>${Number(order.total).toLocaleString()}đ</span>
                </div>

                <div class="order-row">
                    <strong>Trạng thái:</strong>
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

        ordersList.innerHTML =

            "<h2>Lỗi tải dữ liệu</h2>";

    }
}

async function loadDashboard(){

    try{

        const response = await fetch(
            "https://ltuxsflkildzuiukifzh.supabase.co/functions/v1/dashboard-stats"
        );

        const result = await response.json();

        if(!result.success){

            throw new Error(result.error);

        }

        document.getElementById("total-orders").textContent =
            result.totalOrders;

        document.getElementById("shipping").textContent =
            result.shipping;

        document.getElementById("completed").textContent =
            result.completed;

        document.getElementById("cancelled").textContent =
            result.cancelled;

        document.getElementById("revenue").textContent =
            Number(result.revenue).toLocaleString() + "đ";

    }

    catch(err){

        console.error(err);

    }

}

async function updateStatus(orderId, status){

    try{

       async function viewOrder(id){

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

        alert(result.error);

        return;

    }

    const order = result.order;

    const items = result.items;

    const modal = document.getElementById("order-modal");

    const body = document.getElementById("modal-body");

    body.innerHTML = `

        <h2>${order.order_code}</h2>

        <p><b>Khách:</b> ${order.customer_name}</p>

        <p><b>SĐT:</b> ${order.phone}</p>

        <p><b>Địa chỉ:</b> ${order.address}</p>

        <p><b>Ghi chú:</b> ${order.note ?? ""}</p>

        <hr>

        ${items.map(item=>`

            <div style="margin-bottom:15px">

                <img src="${item.product_image}" width="80">

                <p>${item.product_name}</p>

                <p>SL: ${item.quantity}</p>

                <p>${Number(item.subtotal).toLocaleString()}đ</p>

            </div>

        `).join("")}

        <hr>

        <h3>Tổng: ${Number(order.total).toLocaleString()}đ</h3>

        <hr>

        <h3>Cập nhật trạng thái</h3>

        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:15px;">

            <button onclick="updateStatus(${order.id},'Chờ xác nhận')">
                🟡 Chờ xác nhận
            </button>

            <button onclick="updateStatus(${order.id},'Đã xác nhận')">
                🔵 Đã xác nhận
            </button>

            <button onclick="updateStatus(${order.id},'Đang giao')">
                🚚 Đang giao
            </button>

            <button onclick="updateStatus(${order.id},'Hoàn thành')">
                ✅ Hoàn thành
            </button>

            <button onclick="updateStatus(${order.id},'Đã hủy')">
                ❌ Đã hủy
            </button>

        </div>

    `;

    modal.style.display="block";

} 
    
async function viewOrder(id){

    // ... toàn bộ code lấy chi tiết đơn hàng ...

    modal.style.display = "block";

} // <-- Kết thúc viewOrder()
document.getElementById("close-modal").onclick=function(){

    document.getElementById("order-modal").style.display="none";

}

window.onclick=function(e){

    if(e.target.id==="order-modal"){

        document.getElementById("order-modal").style.display="none";

    }

}
loadDashboard();
loadOrders();
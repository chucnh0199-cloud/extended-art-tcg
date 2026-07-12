const ordersList = document.getElementById("orders-list");

async function loadOrders() {

    try {

        const response = await fetch(
            "https://ltuxsflkildzuiukifzh.supabase.co/functions/v1/get-orders"
        );

        const result = await response.json();

        if (!result.success) {

            throw new Error(result.error);

        }

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

function viewOrder(id){

    alert("Đơn hàng ID: " + id);

}

loadOrders();
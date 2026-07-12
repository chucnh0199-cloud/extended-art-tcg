console.log("ADMIN JS ĐÃ CHẠY");

const ordersList = document.getElementById("orders-list");

async function loadOrders() {

    console.log("LOAD ORDERS");

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

        <h3>Tổng:

        ${Number(order.total).toLocaleString()}đ</h3>

    `;

    modal.style.display="block";

}
document.getElementById("close-modal").onclick=function(){

    document.getElementById("order-modal").style.display="none";

}

window.onclick=function(e){

    if(e.target.id==="order-modal"){

        document.getElementById("order-modal").style.display="none";

    }

}
loadOrders();
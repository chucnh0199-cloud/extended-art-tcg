const SUPABASE_URL = "https://ltuxsflkildzuiukifzh.supabase.co";

const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0dXhzZmxraWxkenVpdWtpZnpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NjI5NzQsImV4cCI6MjA5OTIzODk3NH0.aDcB2hizFpuoSMSpOypv_cUm0kWIGK6YJQpaRIiYb6c";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

const ordersList = document.getElementById("orders-list");
const modal = document.getElementById("order-modal");
const modalBody = document.getElementById("modal-body");
const closeModal = document.getElementById("close-modal");


// ==========================
// KIỂM TRA ĐĂNG NHẬP
// ==========================

async function checkLogin(){

    const {
        data:{session}
    } = await supabaseClient.auth.getSession();

    if(!session){

        window.location.href="admin-login.html";

        return false;

    }

    return true;

}


// ==========================
// LOAD DANH SÁCH ĐƠN HÀNG
// ==========================

async function loadOrders(){

    try{

        ordersList.innerHTML="<p>Đang tải dữ liệu...</p>";

        const response=await fetch(

            "https://ltuxsflkildzuiukifzh.supabase.co/functions/v1/get-orders"

        );

        const result=await response.json();

        if(!result.success){

            throw new Error(result.error);

        }

        if(result.orders.length===0){

            ordersList.innerHTML="<p>Chưa có đơn hàng.</p>";

            return;

        }

        ordersList.innerHTML="";

        result.orders.forEach(order=>{

            const card=document.createElement("div");

            card.className="order-card";

            card.innerHTML=`

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

                    <span class="status">

                        ${order.status}

                    </span>

                </div>

                <button class="detail-btn">

                    Xem chi tiết

                </button>

            `;

            card.querySelector(".detail-btn").onclick=()=>{

                viewOrder(order.id);

            };

            ordersList.appendChild(card);

        });

    }

    catch(err){

        console.error(err);

        ordersList.innerHTML=`

            <p style="color:red">

                Không tải được danh sách đơn hàng.

            </p>

        `;

    }

}


// ==========================
// XEM CHI TIẾT
// ==========================

async function viewOrder(id){

    try{

        modal.style.display="block";

        modalBody.innerHTML="<p>Đang tải...</p>";

        const response=await fetch(

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

        const result=await response.json();

        if(!result.success){

            throw new Error(result.error);

        }

        const order=result.order;

        const items=result.items;

        modalBody.innerHTML=`

            <h2>${order.order_code}</h2>

            <p><strong>Khách hàng:</strong> ${order.customer_name}</p>

            <p><strong>SĐT:</strong> ${order.phone}</p>

            <p><strong>Địa chỉ:</strong> ${order.address}</p>

            <p><strong>Ghi chú:</strong>

                ${order.note ?? "Không có"}

            </p>

            <hr>

            <h3>Sản phẩm</h3>

            ${items.map(item=>`

                <div style="display:flex;gap:15px;margin:15px 0;">

                    <img

                        src="${item.product_image}"

                        width="80"

                        height="110"

                        style="object-fit:cover;border-radius:8px;"

                    >

                    <div>

                        <strong>

                            ${item.product_name}

                        </strong>

                        <p>Số lượng: ${item.quantity}</p>

                        <p>

                            ${Number(item.price).toLocaleString()}đ

                        </p>

                        <p>

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

    }

    catch(err){

        console.error(err);

        modalBody.innerHTML=`

            <p style="color:red">

                Không tải được chi tiết đơn hàng.

            </p>

        `;

    }

}


// ==========================
// CẬP NHẬT TRẠNG THÁI
// ==========================

async function updateStatus(orderId,status){

    try{

        const response=await fetch(

            "https://ltuxsflkildzuiukifzh.supabase.co/functions/v1/update-order-status",

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify({

                    order_id:orderId,

                    status:status

                })

            }

        );

        const result=await response.json();

        if(!result.success){

            throw new Error(result.error);

        }

        alert("✅ Đã cập nhật trạng thái.");

        modal.style.display="none";

        loadOrders();

    }

    catch(err){

        console.error(err);

        alert("❌ Không thể cập nhật trạng thái.");

    }

}


// ==========================
// ĐÓNG MODAL
// ==========================

closeModal.onclick=function(){

    modal.style.display="none";

};

window.onclick=function(event){

    if(event.target===modal){

        modal.style.display="none";

    }

};


// ==========================
// DASHBOARD
// ==========================

const backBtn=document.getElementById("back-btn");

if(backBtn){

    backBtn.onclick=()=>{

        window.location.href="admin.html";

    };

}


// ==========================
// ĐĂNG XUẤT
// ==========================

const logoutBtn=document.getElementById("logout-btn");

if(logoutBtn){

    logoutBtn.onclick=async()=>{

        await supabaseClient.auth.signOut();

        window.location.href="admin-login.html";

    };

}


// ==========================
// KHỞI ĐỘNG
// ==========================

(async()=>{

    const ok=await checkLogin();

    if(!ok) return;

    await loadOrders();

})();
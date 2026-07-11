
console.log("Supabase đã kết nối:", supabase);

const cart = JSON.parse(localStorage.getItem("cart")) || [];

const checkoutItems = document.getElementById("checkout-items");
const checkoutTotal = document.getElementById("checkout-total");

let total = 0;

cart.forEach(card => {

    total += Number(card.price) * card.quantity;

    checkoutItems.innerHTML += `
        <p>

            ${card.name}

            ×

            ${card.quantity}

        </p>
    `;

});

checkoutTotal.textContent = total.toLocaleString() + "đ";
// ==========================
// ORDER MODAL
// ==========================

const orderModal = document.getElementById("order-modal");

const orderPreview = document.getElementById("order-preview");

const confirmBtn = document.getElementById("confirm-order");

const cancelBtn = document.getElementById("cancel-order");

const confirmFinalBtn = document.getElementById("confirm-order-final");


// Mở cửa sổ xác nhận
if(confirmBtn){

    confirmBtn.addEventListener("click", function(){

        const name = document.getElementById("customer-name").value.trim();

        const phone = document.getElementById("customer-phone").value.trim();

        const address = document.getElementById("customer-address").value.trim();

        const note = document.getElementById("customer-note").value.trim();

      if(!name || !phone || !address){

    alert("Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ.");

    return;

}

let html = `
    <p><strong>👤 Họ tên:</strong> ${name}</p>

    <p><strong>📞 Số điện thoại:</strong> ${phone}</p>

    <p><strong>📍 Địa chỉ:</strong> ${address}</p>

    <p><strong>🚚 Ghi chú:</strong> ${note || "Không có"}</p>

    <hr>

    <h3>🃏 Sản phẩm đã chọn</h3>
`;
if(cart.length === 0){

    alert("Giỏ hàng đang trống.");

    return;

}

cart.forEach(card => {

    const subtotal = Number(card.price) * card.quantity;

    total += subtotal;

    html += `

        <div class="order-item">

            <img src="${card.image}" class="order-item-image">

            <div class="order-item-info">

                <strong>${card.name}</strong>

                <p>${Number(card.price).toLocaleString()}đ × ${card.quantity}</p>

                <p><strong>${subtotal.toLocaleString()}đ</strong></p>

            </div>

        </div>

        <hr>

    `;

});
html += `

    <h2 style="text-align:right;">

        Tổng tiền:

        ${total.toLocaleString()}đ

    </h2>

`;
        
        orderPreview.innerHTML = html;
        
        orderModal.classList.add("open");

    });

}


// Đóng cửa sổ xác nhận
if(cancelBtn){

    cancelBtn.addEventListener("click", function(){

        orderModal.classList.remove("open");

    });

}


// Xác nhận đơn hàng
if (confirmFinalBtn) {

    confirmFinalBtn.addEventListener("click", async function () {

        const name = document.getElementById("customer-name").value.trim();
        const phone = document.getElementById("customer-phone").value.trim();
        const address = document.getElementById("customer-address").value.trim();
        const note = document.getElementById("customer-note").value.trim();

        let total = 0;

        const products = cart.map(card => {

            const subtotal = Number(card.price) * card.quantity;

            total += subtotal;

            return `${card.name} x${card.quantity} - ${subtotal.toLocaleString()}đ`;

        }).join("\n");

        const orderData = {

    customer_name: name,
    phone: phone,
    address: address,
    note: note,
    total: total,

    items: cart.map(card => ({

        product_name: card.name,
        product_image: card.image,
        price: Number(card.price),
        quantity: card.quantity,
        subtotal: Number(card.price) * card.quantity

    }))

};

    try {

    const response = await fetch(
        "https://ltuxsflkildzuiukifzh.supabase.co/functions/v1/create-order",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.error || "Đặt hàng thất bại");
    }

    alert(
        "🎉 Đặt hàng thành công!\n\nMã đơn hàng: " +
        result.orderId
    );

    localStorage.removeItem("cart");
    window.location.href = "index.html";

} catch (error) {

    alert("❌ " + error.message);

    console.error(error);

}    
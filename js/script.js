console.log("Website Extended Art TCG đã khởi động");
fetch("data/cards.json")
.then(response => response.json())
.then(cards => {

    const cardList = document.getElementById("card-list");

    cards.forEach(card => {

        cardList.innerHTML += `

<div class="card">

    <div class="badge">
        ${card.rarity || ""}
    </div>

   <img
    src="${card.image}"
    onclick="openImage('${card.image}')"
>
    <h3>${card.name}</h3>

    <p>${card.series}</p>

    <p class="price">${card.price}đ</p>

    <div class="button-group">

        <button onclick="location.href='product.html?name=${encodeURIComponent(card.name)}'">
            Xem chi tiết
        </button>

        <button onclick="addToCart('${card.name}')">
            🛒 Thêm vào giỏ
        </button>

    </div>

</div>

`;

    });

});
let allCards=[];

fetch("data/cards.json")

.then(r=>r.json())

.then(cards=>{

    allCards=cards;

    showCards(cards);

});

function showCards(cards){

    const cardList = document.getElementById("card-list");

    cardList.innerHTML = "";

    cards.forEach(card => {

        cardList.innerHTML += `

        <div class="card">

            <div class="badge">
                ${card.rarity || ""}
            </div>

            <img src="${card.image}">

            <h3>${card.name}</h3>

            <p>${card.series}</p>

            <p class="price">${Number(card.price).toLocaleString()}đ</p>

            <div class="button-group">

                <button onclick="location.href='product.html?name=${encodeURIComponent(card.name)}'">
                    Xem chi tiết
                </button>

                <button onclick="addToCart('${card.name}')">
                    🛒 Thêm vào giỏ
                </button>

            </div>

        </div>

        `;

    });

}

function filterSet(setName){

    const result=allCards.filter(card=>card.set===setName);

    showCards(result);

}
let cart = JSON.parse(localStorage.getItem("cart")) || [];
function saveCart(){

    localStorage.setItem("cart", JSON.stringify(cart));

}
function addToCart(name){

    const card = allCards.find(item => item.name === name);

    const existing = cart.find(item => item.name === name);

    if(existing){

        existing.quantity++;

    }else{

        cart.push({

            ...card,

            quantity:1

        });

    }

    document.getElementById("cart-count").textContent =
        cart.reduce((sum,item)=>sum+item.quantity,0);

    saveCart();

updateCart();

}
const cartButton = document.getElementById("cart-button");
const cartSidebar = document.getElementById("cart-sidebar");
const closeCart = document.getElementById("close-cart");

cartButton.addEventListener("click", () => {

    cartSidebar.classList.add("open");

});

closeCart.addEventListener("click", () => {


    cartSidebar.classList.remove("open");

});
function updateCart(){

    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((card, index) => {

        total += Number(card.price) * card.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">

                <img src="${card.image}" class="cart-image">

                <div class="cart-info">

                    <h4>${card.name}</h4>

                   <p>${Number(card.price).toLocaleString()}đ</p>

<div class="quantity-control">

    <button onclick="decreaseQuantity(${index})">➖</button>

    <span style="color:red;font-size:24px;font-weight:bold;">
    ${card.quantity}
</span>

    <button onclick="increaseQuantity(${index})">➕</button>

</div>

<p>

Tạm tính:

${(Number(card.price)*card.quantity).toLocaleString()}đ

</p>

                </div>

                <button onclick="removeFromCart(${index})">

                    ❌

                </button>

            </div>
        `;

    });

    cartTotal.textContent = total.toLocaleString() + "đ";

}
function removeFromCart(index){

    cart.splice(index,1);

    document.getElementById("cart-count").textContent = cart.length;
saveCart();
    updateCart();

}
function increaseQuantity(index){

    cart[index].quantity++;

    document.getElementById("cart-count").textContent =
    cart.reduce((sum,item)=>sum+item.quantity,0);
saveCart();
    updateCart();

}
function decreaseQuantity(index){

    cart[index].quantity--;

    if(cart[index].quantity<=0){

        cart.splice(index,1);

    }

    document.getElementById("cart-count").textContent =
    cart.reduce((sum,item)=>sum+item.quantity,0);
saveCart();
    updateCart();

}
updateCart();

document.getElementById("cart-count").textContent =
    cart.reduce((sum,item)=>sum+item.quantity,0);
    const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", function(){

    const keyword = this.value.toLowerCase();

    const result = allCards.filter(card =>

        card.name.toLowerCase().includes(keyword)

    );

    showCards(result);

});
function filterGame(game, button){

    document.querySelectorAll(".filter-btn").forEach(btn=>{

        btn.classList.remove("active");

    });

    button.classList.add("active");

    if(game==="all"){

        showCards(allCards);

        return;

    }

    const result = allCards.filter(card=>card.game===game);

    showCards(result);

}
const imageModal = document.getElementById("image-modal");
const modalImage = document.getElementById("modal-image");
const closeImage = document.getElementById("close-image");

function openImage(src){

    if(!imageModal || !modalImage) return;

    modalImage.src = src;

    imageModal.style.display = "flex";

}

if(closeImage){

    closeImage.onclick = function(){

        imageModal.style.display = "none";

    };

}

if(imageModal){

    imageModal.onclick = function(e){

        if(e.target === imageModal){

            imageModal.style.display = "none";

        }

    };

}
const checkoutBtn = document.getElementById("checkout-btn");

if(checkoutBtn){

    checkoutBtn.addEventListener("click", () => {

        location.href = "checkout.html";

    });

}
const params = new URLSearchParams(window.location.search);
const name = params.get("name");

fetch("data/cards.json")
.then(response => response.json())
.then(cards => {

    const card = cards.find(item => item.name === name);

    if(!card){
        document.getElementById("product-name").textContent = "Không tìm thấy sản phẩm";
        return;
    }

    document.getElementById("product-image").src = card.image;

document.getElementById("product-name").textContent = card.name;

document.getElementById("product-game").textContent =
    "Game: " + card.game;

document.getElementById("product-series").textContent =
    "Series: " + card.series;

document.getElementById("product-set").textContent =
    "Set: " + card.set;

document.getElementById("product-rarity").textContent =
    "Độ hiếm: " + card.rarity;

document.getElementById("product-price").textContent =
    Number(card.price).toLocaleString() + "đ";

document.getElementById("product-description").textContent =
    card.description;

});
const SUPABASE_URL = "https://ltuxsflkildzuiukifzh.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0dXhzZmxraWxkenVpdWtpZnpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NjI5NzQsImV4cCI6MjA5OTIzODk3NH0.aDcB2hizFpuoSMSpOypv_cUm0kWIGK6YJQpaRIiYb6c";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

let editingProduct = null;

(async () => {

    const { data } = await supabaseClient.auth.getSession();

    if (!data.session) {

        window.location.href = "admin-login.html";
        return;

    }

    console.log("✅ Đăng nhập hợp lệ");
    await loadProducts();

})();
async function loadProducts(){

    try{

        const response = await fetch(
            "https://ltuxsflkildzuiukifzh.supabase.co/functions/v1/get-products"
        );

        const result = await response.json();

        if(!result.success){

            throw new Error(result.error);

        }

        const productsList =
            document.getElementById("products-list");

        productsList.innerHTML = "";

        if(result.products.length === 0){

            productsList.innerHTML = `
                <h3 style="text-align:center;">
                    Chưa có sản phẩm nào
                </h3>
            `;

            return;

        }

        result.products.forEach(product=>{

            const card = document.createElement("div");

            card.className = "product-card";

            card.innerHTML = `

                <img src="${product.image || 'https://placehold.co/90x120?text=No+Image'}">

                <div class="product-info">

                    <h3>${product.name}</h3>

                    <p>Danh mục: ${product.category ?? ""}</p>

                    <p>Giá:
                        ${Number(product.price).toLocaleString()}đ
                    </p>

                </div>

                <button class="edit-btn">
            ✏️ Sửa
        </button>

        <button>
            🗑 Xóa
        </button>

    `;

    productsList.appendChild(card);
   
    card.querySelector(".edit-btn").onclick = () => {

        openEdit(product);

    };

});

    }
    
    catch(err){

        console.error(err);

        alert("Không tải được sản phẩm.");

    }

function openEdit(product){

    editingProduct = product;

    document.getElementById("edit-name").value =
        product.name;

    document.getElementById("edit-category").value =
        product.category ?? "";

    document.getElementById("edit-price").value =
        product.price;

    document.getElementById("edit-preview").src =
        product.image;

    document.getElementById("edit-image").value = "";

    document.getElementById("edit-modal").style.display =
        "block";

}

document.getElementById("cancel-edit").onclick = () => {

    document.getElementById("edit-modal").style.display =
        "none";

};

}

// ======================
// MODAL THÊM SẢN PHẨM
// ======================

const addProductBtn =
    document.getElementById("add-product");

const productModal =
    document.getElementById("product-modal");

const closeProductModal =
    document.getElementById("close-product-modal");

addProductBtn.onclick = function () {

    productModal.style.display = "block";

};

closeProductModal.onclick = function () {

    productModal.style.display = "none";

};

window.addEventListener("click", function (event) {

    if (event.target === productModal) {

        productModal.style.display = "none";

    }

});

// ======================
// LƯU SẢN PHẨM
// ======================

const saveProductBtn =
    document.getElementById("save-product");

saveProductBtn.onclick = saveProduct;

async function saveProduct(){

    const name =
        document.getElementById("product-name").value.trim();

    const category =
        document.getElementById("product-category").value.trim();

    const price =
        Number(document.getElementById("product-price").value);

    const imageFile =
        document.getElementById("product-image").files[0];

    if(!name || !price || !imageFile){

        alert("Vui lòng nhập đầy đủ thông tin và chọn ảnh.");

        return;

    }

    console.log({
        name,
        category,
        price,
        imageFile
    });

// ======================
// Upload ảnh
// ======================

const formData = new FormData();

formData.append("file", imageFile);

const uploadResponse = await fetch(
    "https://ltuxsflkildzuiukifzh.supabase.co/functions/v1/upload-product-image",
    {
        method: "POST",
        body: formData
    }
);

const uploadResult = await uploadResponse.json();

console.log(uploadResult);

if(!uploadResult.success){

    alert(uploadResult.error);

    return;

}

const imageUrl = uploadResult.url;

console.log("Ảnh đã upload:", imageUrl);

// ======================
// Lưu sản phẩm
// ======================

const response = await fetch(
    "https://ltuxsflkildzuiukifzh.supabase.co/functions/v1/add-product",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            category: category,
            price: price,
            image: imageUrl
        })
    }
);

const result = await response.json();

console.log(result);

if (!result.success) {

    alert(result.error);

    return;

}

alert("✅ Thêm sản phẩm thành công!");

productModal.style.display = "none";

document.getElementById("product-name").value = "";
document.getElementById("product-category").value = "";
document.getElementById("product-price").value = "";
document.getElementById("product-image").value = "";

await loadProducts();

}


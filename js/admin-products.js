const SUPABASE_URL = "https://ltuxsflkildzuiukifzh.supabase.co";

const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0dXhzZmxraWxkenVpdWtpZnpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NjI5NzQsImV4cCI6MjA5OTIzODk3NH0.aDcB2hizFpuoSMSpOypv_cUm0kWIGK6YJQpaRIiYb6c";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// ==========================
// KIỂM TRA ĐĂNG NHẬP
// ==========================

async function checkLogin(){

    const { data:{session} } =
        await supabaseClient.auth.getSession();

    if(!session){

        window.location.href="admin-login.html";

        return false;

    }

    return true;

}

// ==========================
// KHAI BÁO
// ==========================

const productsList=document.getElementById("products-list");

const productModal=document.getElementById("product-modal");

const editModal=document.getElementById("edit-modal");

const searchInput=document.getElementById("search-product");

const filterGame=document.getElementById("filter-game");

const filterSeries=document.getElementById("filter-series");

let products=[];

let currentEditId=null;


// ==========================
// LOAD DANH SÁCH
// ==========================

async function loadProducts(){

    productsList.innerHTML="Đang tải...";

    const {data,error}=await supabaseClient

    .from("products")

    .select("*")

    .order("created_at",{ascending:false});

    if(error){

        console.error(error);

        productsList.innerHTML="Không tải được.";

        return;

    }

    products=data;

    renderProducts(products);

    loadSeries(products);

}


// ==========================
// LOAD SERIES
// ==========================

function loadSeries(data){

    filterSeries.innerHTML=`

        <option value="">

            Tất cả Series

        </option>

    `;

    const list=[...new Set(

        data.map(x=>x.series)

    )];

    list.sort();

    list.forEach(series=>{

        if(!series) return;

        filterSeries.innerHTML+=`

            <option value="${series}">

                ${series}

            </option>

        `;

    });

}


// ==========================
// HIỂN THỊ
// ==========================

function renderProducts(data){

    if(data.length===0){

        productsList.innerHTML="Không có sản phẩm.";

        return;

    }

    productsList.innerHTML="";

    data.forEach(product=>{

        const card=document.createElement("div");

        card.className="product-card";

        card.innerHTML=`

            <img

                src="${product.image}"

                class="product-image"

            >

            <div class="product-info">

                <h3>

                    ${product.name}

                </h3>

                <p>

                    ${product.category}

                </p>

                <p>

                    ${product.series??"-"}

                </p>

                <strong>

                    ${Number(product.price).toLocaleString()}đ

                </strong>

            </div>

            <div class="product-actions">

                <button class="edit-btn">

                    ✏️ Sửa

                </button>

                <button class="delete-btn">

                    🗑️ Xóa

                </button>

            </div>

        `;

        card.querySelector(".edit-btn").onclick=()=>{

            openEdit(product);

        };

        card.querySelector(".delete-btn").onclick=()=>{

            deleteProduct(product.id);

        };

        productsList.appendChild(card);

    });

}


// ==========================
// TÌM KIẾM
// ==========================

function applyFilter(){

    let list=[...products];

    const keyword=

        searchInput.value.toLowerCase();

    if(keyword){

        list=list.filter(p=>

            p.name.toLowerCase()

            .includes(keyword)

        );

    }

    if(filterGame.value){

        list=list.filter(p=>

            p.category===filterGame.value

        );

    }

    if(filterSeries.value){

        list=list.filter(p=>

            p.series===filterSeries.value

        );

    }

    renderProducts(list);

}

searchInput.oninput=applyFilter;

filterGame.onchange=applyFilter;

filterSeries.onchange=applyFilter;

// ==========================
// MỞ MODAL THÊM
// ==========================

document.getElementById("add-product").onclick = () => {

    productModal.style.display = "flex";

};

document.getElementById("close-product-modal").onclick = () => {

    productModal.style.display = "none";

};


// ==========================
// THÊM SẢN PHẨM
// ==========================

document.getElementById("save-product").onclick = async () => {

    const name = document.getElementById("product-name").value.trim();

    const category = document.getElementById("product-category").value.trim();

    const series = document.getElementById("product-series").value.trim();

    const price = Number(document.getElementById("product-price").value);

    const imageFile = document.getElementById("product-image").files[0];

    if (!name || !category || !price || !imageFile) {

        alert("Vui lòng nhập đầy đủ thông tin.");

        return;

    }

    const fileName = Date.now() + "_" + imageFile.name;

    const { error: uploadError } = await supabaseClient.storage

        .from("products")

        .upload(fileName, imageFile);

    if (uploadError) {

        alert(uploadError.message);

        return;

    }

    const { data } = supabaseClient.storage

        .from("products")

        .getPublicUrl(fileName);

    const image = data.publicUrl;

    const { error } = await supabaseClient

        .from("products")

        .insert({

            name,

            category,

            series,

            price,

            image

        });

    if (error) {

        alert(error.message);

        return;

    }

    alert("Đã thêm sản phẩm.");

    productModal.style.display = "none";

    loadProducts();

};


// ==========================
// MỞ MODAL SỬA
// ==========================

function openEdit(product){

    currentEditId = product.id;

    document.getElementById("edit-name").value = product.name;

    document.getElementById("edit-category").value = product.category;

    document.getElementById("edit-series").value = product.series ?? "";

    document.getElementById("edit-price").value = product.price;

    document.getElementById("edit-preview").src = product.image;

    editModal.style.display = "flex";

}

document.getElementById("cancel-edit").onclick = () => {

    editModal.style.display = "none";

};


// ==========================
// LƯU CHỈNH SỬA
// ==========================

document.getElementById("save-edit").onclick = async () => {

    let image = document.getElementById("edit-preview").src;

    const newImage = document.getElementById("edit-image").files[0];

    if(newImage){

        const fileName = Date.now()+"_"+newImage.name;

        await supabaseClient.storage

            .from("products")

            .upload(fileName,newImage);

        image = supabaseClient.storage

            .from("products")

            .getPublicUrl(fileName).data.publicUrl;

    }

    const { error } = await supabaseClient

        .from("products")

        .update({

            name:document.getElementById("edit-name").value,

            category:document.getElementById("edit-category").value,

            series:document.getElementById("edit-series").value,

            price:Number(document.getElementById("edit-price").value),

            image:image

        })

        .eq("id",currentEditId);

    if(error){

        alert(error.message);

        return;

    }

    alert("Đã cập nhật.");

    editModal.style.display="none";

    loadProducts();

};


// ==========================
// XÓA
// ==========================

async function deleteProduct(id){

    if(!confirm("Xóa sản phẩm này?")) return;

    const { error } = await supabaseClient

        .from("products")

        .delete()

        .eq("id",id);

    if(error){

        alert(error.message);

        return;

    }

    loadProducts();

}


// ==========================
// NÚT
// ==========================

document.getElementById("back-admin").onclick = ()=>{

    window.location.href="admin.html";

};

document.getElementById("logout-btn").onclick = async ()=>{

    await supabaseClient.auth.signOut();

    window.location.href="admin-login.html";

};


// ==========================
// KHỞI ĐỘNG
// ==========================

(async()=>{

    const ok = await checkLogin();

    if(!ok) return;

    loadProducts();

})();
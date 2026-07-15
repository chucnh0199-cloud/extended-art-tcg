const SUPABASE_URL = "https://ltuxsflkildzuiukifzh.supabase.co";

const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0dXhzZmxraWxkenVpdWtpZnpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NjI5NzQsImV4cCI6MjA5OTIzODk3NH0.aDcB2hizFpuoSMSpOypv_cUm0kWIGK6YJQpaRIiYb6c";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// ===========================
// KIỂM TRA ĐĂNG NHẬP
// ===========================

async function checkLogin(){

    const { data:{session} } =
        await supabaseClient.auth.getSession();

    if(!session){

        window.location.href="admin-login.html";

        return false;

    }

    return true;

}

// ===========================
// DOM
// ===========================

const productsList =
document.getElementById("products-list");

const productModal =
document.getElementById("product-modal");

const editModal =
document.getElementById("edit-modal");

const searchInput =
document.getElementById("search-input");

const categoryFilter =
document.getElementById("category-filter");

let products=[];

let currentEditId=null;


// ===========================
// LOAD SẢN PHẨM
// ===========================

async function loadProducts(){

    productsList.innerHTML="Đang tải dữ liệu...";

    const { data,error } = await supabaseClient

        .from("products")

        .select("*")

        .order("created_at",{

            ascending:false

        });

    if(error){

        console.error(error);

        productsList.innerHTML="Không tải được sản phẩm.";

        return;

    }

    products=data;

    renderProducts(products);

}

// ===========================
// HIỂN THỊ
// ===========================

function renderProducts(list){

    if(list.length===0){

        productsList.innerHTML=`

        <div class="empty-box">

            Không có sản phẩm.

        </div>

        `;

        return;

    }

    productsList.innerHTML="";

    list.forEach(product=>{

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

                    ${product.description ?? ""}

                </p>

                <strong>

                    ${Number(product.price).toLocaleString()}đ

                </strong>

            </div>

            <div class="product-actions">

                <button
                    class="edit-btn"
                >

                    ✏️ Sửa

                </button>

                <button
                    class="delete-btn"
                >

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
// ===========================
// TÌM KIẾM
// ===========================

function applyFilter(){

    let list=[...products];

    const keyword=searchInput.value
        .trim()
        .toLowerCase();

    if(keyword){

        list=list.filter(product=>

            product.name
                .toLowerCase()
                .includes(keyword)

        );

    }

    const category=categoryFilter.value;

    if(category){

        list=list.filter(product=>

            product.category===category

        );

    }

    renderProducts(list);

}

searchInput.oninput=applyFilter;

categoryFilter.onchange=applyFilter;


// ===========================
// MỞ MODAL THÊM
// ===========================

document.getElementById("add-product").onclick=()=>{

    document.getElementById("product-name").value="";

    document.getElementById("product-category").value="";

    document.getElementById("product-price").value="";

    document.getElementById("product-description").value="";

    document.getElementById("product-image").value="";

    productModal.style.display="flex";

};

document.getElementById("close-product-modal").onclick=()=>{

    productModal.style.display="none";

};


// ===========================
// THÊM SẢN PHẨM
// ===========================

document.getElementById("save-product").onclick=async()=>{

    const name=
        document.getElementById("product-name").value.trim();

    const category=
        document.getElementById("product-category").value.trim();

    const price=
        Number(document.getElementById("product-price").value);

    const description=
        document.getElementById("product-description").value.trim();

    const imageFile=
        document.getElementById("product-image").files[0];

    if(

        !name ||

        !category ||

        !price ||

        !imageFile

    ){

        alert("Vui lòng nhập đầy đủ thông tin.");

        return;

    }

    const fileName=

        Date.now()+"_"+imageFile.name;

            const { error: uploadError } = await supabaseClient.storage

        .from("product-images")

        .upload(fileName, imageFile);

    if(uploadError){

        alert(uploadError.message);

        return;

    }

    const { data: imageData } = supabaseClient.storage

        .from("product-images")

        .getPublicUrl(fileName);

    const image=imageData.publicUrl;

    const { error } = await supabaseClient

        .from("products")

        .insert({

            name,

            category,

            price,

            description,

            image

        });

    if(error){

        alert(error.message);

        return;

    }

    alert("Đã thêm sản phẩm.");

    productModal.style.display="none";

    loadProducts();

};


// ===========================
// MỞ MODAL SỬA
// ===========================

function openEdit(product){

    currentEditId=product.id;

    document.getElementById("edit-name").value=
        product.name;

    document.getElementById("edit-category").value=
        product.category;

    document.getElementById("edit-price").value=
        product.price;

    document.getElementById("edit-description").value=
        product.description ?? "";

    document.getElementById("edit-preview").src=
        product.image;

    document.getElementById("edit-image").value="";

    editModal.style.display="flex";

}

document.getElementById("cancel-edit").onclick=()=>{

    editModal.style.display="none";

};
// ===========================
// LƯU CHỈNH SỬA
// ===========================

document.getElementById("save-edit").onclick = async () => {

    let image =
        document.getElementById("edit-preview").src;

    const imageFile =
        document.getElementById("edit-image").files[0];

    if(imageFile){

        const fileName =
            Date.now()+"_"+imageFile.name;

        const { data: uploadData, error: uploadError } =
await supabaseClient.storage
.from("product-images")
.upload(fileName,imageFile);

console.log("UPLOAD DATA:", uploadData);
console.log("UPLOAD ERROR:", uploadError);

if(uploadError){

    console.error(uploadError);

    alert(uploadError.message);

    return;

}

        if(uploadError){

            alert(uploadError.message);

            return;

        }

        const { data:imageData } =
            supabaseClient.storage
                .from("product-images")
                .getPublicUrl(fileName);

        image = imageData.publicUrl;

    }

    const { error } = await supabaseClient

        .from("products")

        .update({

            name:
                document.getElementById("edit-name").value,

            category:
                document.getElementById("edit-category").value,

            price:
                Number(document.getElementById("edit-price").value),

            description:
                document.getElementById("edit-description").value,

            image:image

        })

        .eq("id",currentEditId);

    if(error){

        alert(error.message);

        return;

    }

    alert("Đã cập nhật sản phẩm.");

    editModal.style.display="none";

    loadProducts();

};
// ===========================
// XÓA SẢN PHẨM
// ===========================

async function deleteProduct(id){

    if(!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    // Lấy thông tin sản phẩm
    const { data: product, error: getError } =
        await supabaseClient
            .from("products")
            .select("image")
            .eq("id", id)
            .single();

    if(getError){

        alert(getError.message);

        return;

    }

    // Xóa file ảnh trong Storage
if(product.image){

    const fileName = decodeURIComponent(
        product.image.split("/").pop()
    );

    const { data, error: storageError } =
        await supabaseClient.storage
            .from("product-images")
            .remove([fileName]);

    console.log("FILE:", fileName);
    console.log("REMOVE DATA:", data);
    console.log("REMOVE ERROR:", storageError);

    if(storageError){

        alert(storageError.message);

        return;

    }

}

    // Xóa dữ liệu trong bảng products
    const { error } = await supabaseClient

        .from("products")

        .delete()

        .eq("id", id);

    if(error){

        alert(error.message);

        return;

    }

    alert("Đã xóa sản phẩm.");

    loadProducts();

}


// ===========================
// ĐÓNG MODAL KHI CLICK RA NGOÀI
// ===========================

window.onclick = function(event){

    if(event.target===productModal){

        productModal.style.display="none";

    }

    if(event.target===editModal){

        editModal.style.display="none";

    }

};


// ===========================
// NÚT DASHBOARD
// ===========================

document.getElementById("back-admin").onclick=()=>{

    window.location.href="admin.html";

};


// ===========================
// ĐĂNG XUẤT
// ===========================

document.getElementById("logout-btn").onclick=async()=>{

    await supabaseClient.auth.signOut();

    window.location.href="admin-login.html";

};
// ===========================
// KHỞI ĐỘNG
// ===========================

(async()=>{

    const ok = await checkLogin();

    if(!ok){

        return;

    }

    await loadProducts();

})();


// ===========================
// REFRESH SAU KHI THAO TÁC
// ===========================

async function refreshProducts(){

    await loadProducts();

}


// ===========================
// PHÍM ESC ĐÓNG MODAL
// ===========================

document.addEventListener("keydown",(event)=>{

    if(event.key==="Escape"){

        productModal.style.display="none";

        editModal.style.display="none";

    }

});


// ===========================
// KẾT THÚC FILE
// ===========================
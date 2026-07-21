/* ==========================================================
DON MARTIAL SHOPPING MART
PRODUCTS PAGE
========================================================== */

"use strict";

console.clear();

console.log("=====================================");
console.log("DON MARTIAL SHOPPING MART");
console.log("Products Page Loading...");
console.log("=====================================");

/* ==========================================================
SUPABASE
========================================================== */

const db = window.supabaseClient;

if(!db){

    console.error("❌ Supabase Client Not Found");

}

/* ==========================================================
ADMIN SESSION
========================================================== */

const adminSession = JSON.parse(

    sessionStorage.getItem("admin")

);

if(!adminSession){

    window.location.href="../../pages/admin/login.html";

}

/* ==========================================================
DOM
========================================================== */

const backBtn=document.getElementById("backBtn");

const searchInput=document.getElementById("searchInput");

const filterCategory=document.getElementById("filterCategory");

const productsTable=document.getElementById("productsTable");

const emptyState=document.getElementById("emptyState");

const loadingOverlay=document.getElementById("loadingOverlay");

const totalProducts=document.getElementById("totalProducts");

const featuredProducts=document.getElementById("featuredProducts");

const activeProducts=document.getElementById("activeProducts");

const stockProducts=document.getElementById("stockProducts");

const deleteModal=document.getElementById("deleteModal");

const cancelDelete=document.getElementById("cancelDelete");

const confirmDelete=document.getElementById("confirmDelete");

const dialogOverlay=document.getElementById("dialogOverlay");

const dialogIcon=document.getElementById("dialogIcon");

const dialogTitle=document.getElementById("dialogTitle");

const dialogMessage=document.getElementById("dialogMessage");

const dialogButton=document.getElementById("dialogButton");

const toast=document.getElementById("toast");

const toastIcon=document.getElementById("toastIcon");

const toastText=document.getElementById("toastText");

/* ==========================================================
GLOBAL VARIABLES
========================================================== */

let allProducts=[];

let deleteProductId=null;

/* ==========================================================
LOADING
========================================================== */

function showLoading(){

    loadingOverlay.classList.add("active");

}

function hideLoading(){

    loadingOverlay.classList.remove("active");

}

/* ==========================================================
TOAST
========================================================== */

function showToast(icon,message){

    toastIcon.textContent=icon;

    toastText.textContent=message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },3000);

}

/* ==========================================================
CUSTOM DIALOG
========================================================== */

function showDialog(icon,title,message){

    dialogIcon.innerHTML=`

        <span class="material-symbols-rounded">

            ${icon}

        </span>

    `;

    dialogTitle.textContent=title;

    dialogMessage.textContent=message;

    dialogOverlay.classList.add("active");

}

dialogButton.addEventListener("click",()=>{

    dialogOverlay.classList.remove("active");

});

/* ==========================================================
BACK BUTTON
========================================================== */

backBtn.addEventListener("click",()=>{

    window.location.href="../../pages/admin/dashboard.html";

});

console.log("✅ Products Part 1 Loaded");
/* ==========================================================
LOAD PRODUCTS
========================================================== */

async function loadProducts(){

    try{

        showLoading();

        const{

            data,

            error

        }=await db

        .from("products")

        .select("*")

        .order("created_at",{

            ascending:false

        });

        if(error){

            throw error;

        }

        allProducts=data||[];

        renderProducts(allProducts);

        updateSummary(allProducts);

        hideLoading();

    }

    catch(err){

        hideLoading();

        console.error(err);

        showDialog(

            "error",

            "Loading Failed",

            err.message

        );

    }

}

/* ==========================================================
LOAD PRODUCT IMAGE
========================================================== */

async function getProductImage(productId){

    const{

        data

    }=await db

    .from("product_images")

    .select("image_url")

    .eq("product_id",productId)

    .order("position",{

        ascending:true

    })

    .limit(1)

    .maybeSingle();

    if(data){

        return data.image_url;

    }

    return "../../assets/images/no-image.png";

}

/* ==========================================================
SUMMARY
========================================================== */

function updateSummary(products){

    totalProducts.textContent=

    products.length;

    featuredProducts.textContent=

    products.filter(

        p=>p.featured

    ).length;

    activeProducts.textContent=

    products.filter(

        p=>p.active

    ).length;

    stockProducts.textContent=

    products.reduce(

        (sum,p)=>sum+(p.stock||0),

        0

    );

}

/* ==========================================================
RENDER PRODUCTS
========================================================== */

async function renderProducts(products){

    productsTable.innerHTML="";

    if(products.length===0){

        emptyState.style.display="flex";

        return;

    }

    emptyState.style.display="none";

    for(const product of products){

        const image=

        await getProductImage(

            product.id

        );

        const row=document.createElement("tr");

        row.innerHTML=`

        <td>

            <div class="product-image">

                <img src="${image}">

            </div>

        </td>

        <td>

            <div class="product-name">

                ${product.name}

            </div>

            <div class="product-brand">

                ${product.brand||""}

            </div>

        </td>

        <td>

            ${product.category}

        </td>

        <td class="price">

            ₦${Number(product.price).toLocaleString()}

        </td>

        <td class="cashback">

            ₦${Number(product.cashback||0).toLocaleString()}

        </td>

        <td class="stock">

            ${product.stock}

        </td>

        <td>

            <span class="status ${product.active?'active':'inactive'}">

                ${product.active?'Active':'Inactive'}

            </span>

        </td>

        <td>

            <div class="action-group">

                <button

                    class="action-btn view-btn"

                    onclick="viewProduct('${product.id}')">

                    <span class="material-symbols-rounded">

                        visibility

                    </span>

                </button>

                <button

                    class="action-btn edit-btn"

                    onclick="editProduct('${product.id}')">

                    <span class="material-symbols-rounded">

                        edit

                    </span>

                </button>

                <button

                    class="action-btn delete-btn"

                    onclick="deleteProduct('${product.id}')">

                    <span class="material-symbols-rounded">

                        delete

                    </span>

                </button>

            </div>

        </td>

        `;

        productsTable.appendChild(row);

    }

}

console.log("✅ Products Part 2 Loaded");
/* ==========================================================
SEARCH
========================================================== */

searchInput.addEventListener("input",()=>{

    const keyword=

    searchInput.value

    .trim()

    .toLowerCase();

    const filtered=

    allProducts.filter(product=>

        product.name

        .toLowerCase()

        .includes(keyword)

        ||

        product.category

        .toLowerCase()

        .includes(keyword)

        ||

        (product.brand||"")

        .toLowerCase()

        .includes(keyword)

    );

    renderProducts(filtered);

});

/* ==========================================================
CATEGORY FILTER
========================================================== */

filterCategory.addEventListener("change",()=>{

    const category=

    filterCategory.value;

    if(category===""){

        renderProducts(allProducts);

        return;

    }

    const filtered=

    allProducts.filter(product=>

        product.category===category

    );

    renderProducts(filtered);

});

/* ==========================================================
VIEW PRODUCT
========================================================== */

window.viewProduct=function(id){

    window.location.href=

    "../../pages/admin/view-product.html?id="+id;

};

/* ==========================================================
EDIT PRODUCT
========================================================== */

window.editProduct=function(id){

    window.location.href=

    "../../pages/admin/edit-product.html?id="+id;

};

/* ==========================================================
DELETE PRODUCT
========================================================== */

window.deleteProduct=function(id){

    deleteProductId=id;

    deleteModal.classList.add("active");

};

cancelDelete.addEventListener("click",()=>{

    deleteModal.classList.remove("active");

    deleteProductId=null;

});

confirmDelete.addEventListener("click",async()=>{

    if(!deleteProductId){

        return;

    }

    try{

        showLoading();

        /* ==============================
GET PRODUCT IMAGES
============================== */

const {

    data:imageRecords,

    error:imageError

}=await db

.from("product_images")

.select("*")

.eq("product_id",deleteProductId);

if(imageError){

    throw imageError;

}

/* ==============================
DELETE STORAGE FILES
============================== */

if(imageRecords && imageRecords.length){

    const fileNames=[];

    imageRecords.forEach(image=>{

        try{

            const url=image.image_url;

            const fileName=url.split("/product-images/")[1];

            if(fileName){

                fileNames.push(fileName);

            }

        }

        catch(err){

            console.log(err);

        }

    });

    if(fileNames.length){

        await db.storage

        .from("product-images")

        .remove(fileNames);

    }

}

/* ==============================
DELETE IMAGE RECORDS
============================== */

await db

.from("product_images")

.delete()

.eq("product_id",deleteProductId);

        /* ==============================
        DELETE PRODUCT
        ============================== */

        const{

            error

        }=await db

        .from("products")

        .delete()

        .eq("id",deleteProductId);

        if(error){

            throw error;

        }

        hideLoading();

        deleteModal.classList.remove("active");

        deleteProductId=null;

        showToast(

            "check_circle",

            "Product deleted successfully."

        );

        loadProducts();

    }

    catch(err){

        hideLoading();

        deleteModal.classList.remove("active");

        console.error(err);

        showDialog(

            "error",

            "Delete Failed",

            err.message

        );

    }

});

/* ==========================================================
AUTO REFRESH
========================================================== */

setInterval(()=>{

    loadProducts();

},60000);

/* ==========================================================
START
========================================================== */

window.addEventListener("load",()=>{

    loadProducts();

});

/* ==========================================================
READY
========================================================== */

console.log("=====================================");

console.log("Products Page Ready");

console.log("Don Martial Shopping Mart");

console.log("=====================================");
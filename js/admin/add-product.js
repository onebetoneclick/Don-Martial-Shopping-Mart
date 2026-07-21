/* ==========================================================
DON MARTIAL SHOPPING MART
ADD PRODUCT
========================================================== */

"use strict";

console.clear();

console.log("=====================================");
console.log("DON MARTIAL SHOPPING MART");
console.log("Add Product Loading...");
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

    window.location.href =

    "../../pages/admin/login.html";

}

/* ==========================================================
DOM ELEMENTS
========================================================== */

const productForm=document.getElementById("productForm");

const backBtn=document.getElementById("backBtn");

const selectImagesBtn=document.getElementById("selectImagesBtn");

const uploadArea=document.getElementById("uploadArea");

const productImages=document.getElementById("productImages");

const imagePreview=document.getElementById("imagePreview");

const loadingOverlay=document.getElementById("loadingOverlay");

const dialogOverlay=document.getElementById("dialogOverlay");

const dialogIcon=document.getElementById("dialogIcon");

const dialogTitle=document.getElementById("dialogTitle");

const dialogMessage=document.getElementById("dialogMessage");

const dialogButton=document.getElementById("dialogButton");

/* ==========================================================
FORM FIELDS
========================================================== */

const productName=document.getElementById("productName");

const category=document.getElementById("category");

const brand=document.getElementById("brand");

const sku=document.getElementById("sku");

const price=document.getElementById("price");

const cashback=document.getElementById("cashback");

const quantity=document.getElementById("quantity");

const stockStatus=document.getElementById("stockStatus");

const productStatus=document.getElementById("productStatus");

const featured=document.getElementById("featured");

const description=document.getElementById("description");

const specifications=document.getElementById("specifications");

/* ==========================================================
IMAGES ARRAY
========================================================== */

let selectedImages=[];

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

    window.location.href=

    "../../pages/admin/dashboard.html";

});

console.log("✅ Add Product Part 1 Loaded");
/* ==========================================================
SELECT IMAGES
========================================================== */

selectImagesBtn.addEventListener("click",()=>{

    productImages.click();

});

uploadArea.addEventListener("click",()=>{

    productImages.click();

});

/* ==========================================================
IMAGE PICKER
========================================================== */

productImages.addEventListener("change",(e)=>{

    const files=[...e.target.files];

    files.forEach(file=>{

        if(file.type.startsWith("image/")){

            selectedImages.push(file);

        }

    });

    renderImages();

});

/* ==========================================================
DRAG & DROP
========================================================== */

uploadArea.addEventListener("dragover",(e)=>{

    e.preventDefault();

    uploadArea.style.borderColor="#0A7A43";

    uploadArea.style.background="#ECFFF2";

});

uploadArea.addEventListener("dragleave",()=>{

    uploadArea.style.borderColor="#0F9D58";

    uploadArea.style.background="#F8FFF9";

});

uploadArea.addEventListener("drop",(e)=>{

    e.preventDefault();

    uploadArea.style.borderColor="#0F9D58";

    uploadArea.style.background="#F8FFF9";

    const files=[...e.dataTransfer.files];

    files.forEach(file=>{

        if(file.type.startsWith("image/")){

            selectedImages.push(file);

        }

    });

    renderImages();

});

/* ==========================================================
RENDER IMAGES
========================================================== */

function renderImages(){

    imagePreview.innerHTML="";

    selectedImages.forEach((file,index)=>{

        const reader=new FileReader();

        reader.onload=(e)=>{

            imagePreview.innerHTML+=`

            <div class="image-card">

                <img src="${e.target.result}">

                <button

                    type="button"

                    class="remove-image"

                    onclick="removeImage(${index})">

                    <span class="material-symbols-rounded">

                        close

                    </span>

                </button>

            </div>

            `;

        };

        reader.readAsDataURL(file);

    });

}

/* ==========================================================
REMOVE IMAGE
========================================================== */

window.removeImage=function(index){

    selectedImages.splice(index,1);

    renderImages();

};

console.log("✅ Add Product Part 2 Loaded");
/* ==========================================================
SAVE PRODUCT
========================================================== */

async function skuExists(code){

    const { data } = await db
    .from("products")
    .select("id")
    .eq("sku", code)
    .maybeSingle();

    return !!data;

}

productForm.addEventListener("submit", async(e)=>{

    e.preventDefault();

    try{

        showLoading();

        if(selectedImages.length===0){

            hideLoading();

            showDialog(

                "image",

                "No Images",

                "Please select at least one product image."

            );

            return;

        }

        let productSKU = sku.value.trim();

        if(productSKU===""){

            productSKU="DM-"+Date.now();

        }

        const exists=await skuExists(productSKU);

        if(exists){

            hideLoading();

            showDialog(

                "warning",

                "Duplicate SKU",

                "This SKU already exists."

            );

            return;

        }

        /* ==========================================
        SAVE PRODUCT
        ========================================== */

        const {

            data:product,

            error:productError

        } = await db

        .from("products")

 .insert({

    name: productName.value.trim(),

    description: description.value,

    category: category.value,

    brand: brand.value.trim(),

    sku: productSKU,

    price: Number(price.value),

    old_price: Number(price.value),

    stock: Number(quantity.value),

    rating: 0,

    total_reviews: 0,

    cashback: Number(cashback.value || 0),

    cashback_percent: 0,

    featured: featured.checked,

    trending: false,

    flash_sale: false,

    active: productStatus.value === "Active"

})

        .select()

        .single();

        if(productError){

            throw productError;

        }

        /* ==========================================
        UPLOAD PRODUCT IMAGES
        ========================================== */

        for(let i=0;i<selectedImages.length;i++){

            const file=selectedImages[i];

            const extension=file.name.split(".").pop();

const fileName=

`products/${product.id}/${i+1}.${extension}`;

            const {

                error:uploadError

            } = await db.storage

            .from("product-images")

            .upload(fileName,file);

            if(uploadError){

                throw uploadError;

            }

            const {

                data:urlData

            } = db.storage

            .from("product-images")

            .getPublicUrl(fileName);

            await db

            .from("product_images")

            .insert({

                product_id:product.id,

                image_url:urlData.publicUrl,

                position:i+1

            });

        }

        hideLoading();

        showDialog(

            "check_circle",

            "Success",

            "Product uploaded successfully."

        );

        productForm.reset();

        selectedImages=[];

        imagePreview.innerHTML="";

        productImages.value="";

    }

    catch(err){

        hideLoading();

        console.error(err);

        showDialog(

            "error",

            "Upload Failed",

            err.message

        );

    }

});

console.log("✅ Add Product Ready");
/* ==========================================================
DON MARTIAL SHOPPING MART
PROFILE.JS
========================================================== */

"use strict";

console.clear();

console.log("=====================================");
console.log("DON MARTIAL SHOPPING MART");
console.log("Profile Loading...");
console.log("=====================================");

/* ==========================================================
SUPABASE
========================================================== */

const db = window.supabaseClient;

if (!db) {

    console.error("❌ Supabase Client Not Found");

}

/* ==========================================================
DOM ELEMENTS
========================================================== */

const backBtn = document.getElementById("backBtn");

const profileForm = document.getElementById("profileForm");

const profileAvatar = document.getElementById("profileAvatar");

const avatarInput = document.getElementById("avatarInput");

const profileName = document.getElementById("profileName");

const customerID = document.getElementById("customerID");

const customerIDInfo = document.getElementById("customerIDInfo");

const accountStatus = document.getElementById("accountStatus");

const accountRole = document.getElementById("accountRole");

const fullName = document.getElementById("fullName");

const email = document.getElementById("email");

const phone = document.getElementById("phone");

const address = document.getElementById("address");

const city = document.getElementById("city");

const state = document.getElementById("state");

const loadingOverlay = document.getElementById("loadingOverlay");

const dialogOverlay = document.getElementById("dialogOverlay");

const dialogIcon = document.getElementById("dialogIcon");

const dialogTitle = document.getElementById("dialogTitle");

const dialogMessage = document.getElementById("dialogMessage");

const dialogButton = document.getElementById("dialogButton");

/* ==========================================================
CURRENT USER
========================================================== */

let currentUser = null;

let currentProfile = null;

let selectedAvatar = null;

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
CHECK SESSION
========================================================== */

async function checkSession(){

    const {

        data,

        error

    } = await db.auth.getSession();

    if(error){

        console.error(error);

        return null;

    }

    if(!data.session){

        window.location.href="../auth/login.html";

        return null;

    }

    return data.session.user;

}

console.log("✅ Profile Part 1 Loaded");
/* ==========================================================
LOAD PROFILE
========================================================== */

async function loadProfile(){

    try{

        showLoading();

        currentUser = await checkSession();

        if(!currentUser){

            hideLoading();

            return;

        }

        const {

            data,

            error

        } = await db

        .from("profiles")

        .select("*")

        .eq("user_id",currentUser.id)

        .single();

        if(error){

            throw error;

        }

        currentProfile = data;

        /* ==========================================
        PROFILE HEADER
        ========================================== */

        profileName.textContent =

            data.full_name || "Customer";

        customerID.textContent =

            data.customer_id || "DM000000";

        customerIDInfo.textContent =

            data.customer_id || "DM000000";

        accountStatus.textContent =

            data.status || "Active";

        accountRole.textContent =

            data.role || "Customer";

        /* ==========================================
        FORM
        ========================================== */

        fullName.value =

            data.full_name || "";

        email.value =

            data.email || currentUser.email;

        phone.value =

            data.phone || "";

        address.value =

            data.address || "";

        city.value =

            data.city || "";

        state.value =

            data.state || "";

        /* ==========================================
        PROFILE IMAGE
        ========================================== */

        if(

            data.avatar &&

            data.avatar.trim() !== ""

        ){

            profileAvatar.src = data.avatar;

        }

        hideLoading();

    }

    catch(err){

        hideLoading();

        console.error(err);

        showDialog(

            "error",

            "Profile Error",

            err.message

        );

    }

}

console.log("✅ Profile Part 2 Loaded");
/* ==========================================================
AVATAR PREVIEW
========================================================== */

avatarInput.addEventListener("change",(event)=>{

    const file = event.target.files[0];

    if(!file){

        return;

    }

    selectedAvatar = file;

    const reader = new FileReader();

    reader.onload=function(e){

        profileAvatar.src = e.target.result;

    };

    reader.readAsDataURL(file);

});

/* ==========================================================
SAVE PROFILE
========================================================== */

profileForm.addEventListener("submit",async(event)=>{

    event.preventDefault();

    try{

        showLoading();

        if(!currentUser){

            throw new Error("User not found.");

        }

        /* ==========================================
        Upload Avatar
        ========================================== */

        let avatarUrl = currentProfile?.avatar || "";

        if(selectedAvatar){

            const fileExt = selectedAvatar.name.split(".").pop();

            const fileName =

                currentUser.id + "_" + Date.now() + "." + fileExt;

            const filePath =

                "avatars/" + fileName;

            const { error: uploadError } = await db

            .storage

            .from("avatars")

            .upload(filePath,selectedAvatar,{

                upsert:true

            });

            if(uploadError){

                throw uploadError;

            }

            const {

                data: publicUrl

            } = db

            .storage

            .from("avatars")

            .getPublicUrl(filePath);

            avatarUrl = publicUrl.publicUrl;

        }

        /* ==========================================
        Update Profile
        ========================================== */

        const {

            error

        } = await db

        .from("profiles")

        .update({

            full_name: fullName.value.trim(),

            phone: phone.value.trim(),

            address: address.value.trim(),

            city: city.value.trim(),

            state: state.value.trim(),

            avatar: avatarUrl,

            updated_at: new Date().toISOString()

        })

        .eq("user_id",currentUser.id);

        if(error){

            throw error;

        }

        hideLoading();

        showDialog(

            "check_circle",

            "Profile Updated",

            "Your profile has been updated successfully."

        );

        profileName.textContent = fullName.value;

    }

    catch(err){

        hideLoading();

        console.error(err);

        showDialog(

            "error",

            "Update Failed",

            err.message

        );

    }

});

console.log("✅ Profile Part 3 Loaded");
/* ==========================================================
BACK BUTTON
========================================================== */

backBtn.addEventListener("click",()=>{

    window.location.href="../../pages/auth/settings.html";

});

/* ==========================================================
INITIALIZE
========================================================== */

window.addEventListener("load",async()=>{

    await loadProfile();

});

/* ==========================================================
AUTO REFRESH PROFILE
========================================================== */

setInterval(async()=>{

    if(currentUser){

        await loadProfile();

    }

},60000);

/* ==========================================================
READY
========================================================== */

console.log("=====================================");

console.log("Profile Ready");

console.log("Don Martial Shopping Mart");

console.log("=====================================");
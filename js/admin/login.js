/* ==========================================================
DON MARTIAL SHOPPING MART
ADMIN LOGIN
========================================================== */

"use strict";

console.clear();

console.log("=====================================");
console.log("DON MARTIAL SHOPPING MART");
console.log("Admin Login Loading...");
console.log("=====================================");

/* ==========================================================
SUPABASE
========================================================== */

const db = window.supabaseClient;

if(!db){

    console.error("❌ Supabase Client Not Found");

}

/* ==========================================================
DOM ELEMENTS
========================================================== */

const loginForm = document.getElementById("loginForm");

const adminId = document.getElementById("adminId");

const adminKey = document.getElementById("adminKey");

const togglePassword = document.getElementById("togglePassword");

const toggleIcon = document.getElementById("toggleIcon");

const loginBtn = document.getElementById("loginBtn");

const loadingOverlay = document.getElementById("loadingOverlay");

const errorBox = document.getElementById("errorBox");

const errorMessage = document.getElementById("errorMessage");

const successBox = document.getElementById("successBox");

/* ==========================================================
SHOW LOADING
========================================================== */

function showLoading(){

    loadingOverlay.classList.add("active");

}

function hideLoading(){

    loadingOverlay.classList.remove("active");

}

/* ==========================================================
ERROR
========================================================== */

function showError(message){

    successBox.style.display = "none";

    errorBox.style.display = "flex";

    errorMessage.textContent = message;

}

/* ==========================================================
SUCCESS
========================================================== */

function showSuccess(){

    errorBox.style.display = "none";

    successBox.style.display = "flex";

}

console.log("✅ Admin Login Part 1 Loaded");
/* ==========================================================
SHOW / HIDE SECRET KEY
========================================================== */

togglePassword.addEventListener("click",()=>{

    if(adminKey.type==="password"){

        adminKey.type="text";

        toggleIcon.textContent="visibility_off";

    }else{

        adminKey.type="password";

        toggleIcon.textContent="visibility";

    }

});

/* ==========================================================
CLEAR ERROR
========================================================== */

adminId.addEventListener("input",()=>{

    errorBox.style.display="none";

});

adminKey.addEventListener("input",()=>{

    errorBox.style.display="none";

});

/* ==========================================================
LOGIN
========================================================== */

loginForm.addEventListener("submit",async(e)=>{

    e.preventDefault();

    const id=adminId.value.trim();

    const key=adminKey.value.trim();

    if(id===""||key===""){

        showError("Please enter your Admin ID and Secret Key.");

        return;

    }

    try{

        showLoading();

        loginBtn.disabled=true;
        const {

            data,

            error

        }=await db

        .from("admins")

        .select("*")

        .eq("admin_id",id)

        .eq("admin_key",key)

        .single();

        if(error||!data){

            hideLoading();

            loginBtn.disabled=false;

            showError("Invalid Admin ID or Secret Key.");

            return;

        }

        if(data.status!=="active"){

            hideLoading();

            loginBtn.disabled=false;

            showError("Your admin account has been suspended.");

            return;

        }

        console.log("✅ Admin Login Successful");

        showSuccess();
/* ==========================================================
SAVE ADMIN SESSION
========================================================== */

        sessionStorage.setItem(

            "admin",

            JSON.stringify(data)

        );

        /* ==========================================
        UPDATE LAST LOGIN
        ========================================== */

        await db

        .from("admins")

        .update({

            last_login:new Date().toISOString()

        })

        .eq("id",data.id);

        hideLoading();

        loginBtn.disabled=false;

        setTimeout(()=>{

            window.location.href=

            "../../pages/admin/dashboard.html";

        },1000);

    }

    catch(err){

        hideLoading();

        loginBtn.disabled=false;

        console.error(err);

        showError(

            err.message ||

            "Unable to login. Please try again."

        );

    }

});

/* ==========================================================
CHECK EXISTING ADMIN SESSION
========================================================== */

const adminSession = sessionStorage.getItem("admin");

if(adminSession){

    window.location.href =

    "../../pages/admin/dashboard.html";

}

/* ==========================================================
READY
========================================================== */

console.log("=====================================");

console.log("Admin Login Ready");

console.log("Don Martial Shopping Mart");

console.log("=====================================");
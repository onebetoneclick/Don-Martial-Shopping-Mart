/* ==========================================================
DON MARTIAL SHOPPING MART
DASHBOARD.JS
========================================================== */

"use strict";

console.clear();

console.log("======================================");
console.log("DON MARTIAL SHOPPING MART");
console.log("Dashboard Loading...");
console.log("======================================");

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

const greeting = document.getElementById("greeting");

const userName = document.getElementById("userName");

const walletBalance = document.getElementById("walletBalance");

const cashbackBalance = document.getElementById("cashbackBalance");

const profileAvatar = document.getElementById("profileAvatar");

const loadingOverlay = document.getElementById("loadingOverlay");

const completeProfileCard = document.getElementById("completeProfileCard");

const addMoneyBtn = document.getElementById("addMoneyBtn");

const searchInput = document.getElementById("searchInput");

/* ==========================================================
DIALOG
========================================================== */

const dialogOverlay = document.getElementById("dialogOverlay");

const dialogIcon = document.getElementById("dialogIcon");

const dialogTitle = document.getElementById("dialogTitle");

const dialogMessage = document.getElementById("dialogMessage");

const dialogButton = document.getElementById("dialogButton");

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

        console.log(error);

        return;

    }

    if(!data.session){

        window.location.href="../auth/login.html";

        return;

    }

    return data.session.user;

}

/* ==========================================================
GREETING
========================================================== */

function updateGreeting(){

    const hour = new Date().getHours();

    if(hour < 12){

        greeting.textContent = "Good Morning 👋";

    }

    else if(hour < 17){

        greeting.textContent = "Good Afternoon ☀️";

    }

    else{

        greeting.textContent = "Good Evening 🌙";

    }

}

console.log("✅ Dashboard Part 1 Loaded");
/* ==========================================================
CURRENT USER
========================================================== */

let currentUser = null;

let currentProfile = null;

/* ==========================================================
LOAD USER PROFILE
========================================================== */

async function loadUserProfile(){

    try{

        showLoading();

        currentUser = await checkSession();

        if(!currentUser){

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
           USER NAME
        ========================================== */

        userName.textContent =

        data.full_name || "Customer";

        /* ==========================================
           WALLET
        ========================================== */

        const wallet = Number(data.wallet || 0);

        walletBalance.textContent =

        "₦" +

        wallet.toLocaleString(

            "en-NG",

            {

                minimumFractionDigits:2,

                maximumFractionDigits:2

            }

        );

        /* ==========================================
           CASHBACK
        ========================================== */

        const cashback = Number(

            data.cashback || 0

        );

        cashbackBalance.textContent =

        "₦" +

        cashback.toLocaleString(

            "en-NG",

            {

                minimumFractionDigits:2,

                maximumFractionDigits:2

            }

        );

        /* ==========================================
           PROFILE PHOTO
        ========================================== */

        if(

            data.avatar &&

            data.avatar.trim() !== ""

        ){

            profileAvatar.src =

            data.avatar;

        }

        /* ==========================================
           COMPLETE PROFILE
        ========================================== */

        if(

            data.profile_completed

        ){

            completeProfileCard.style.display =

            "none";

        }else{

            completeProfileCard.style.display =

            "flex";

        }

        hideLoading();

    }

    catch(err){

        hideLoading();

        console.error(err);

        showDialog(

            "error",

            "Dashboard Error",

            err.message

        );

    }

}

console.log("✅ Dashboard Part 2 Loaded");
/* ==========================================================
START DASHBOARD
========================================================== */

window.addEventListener("load", async () => {

    updateGreeting();

    await loadUserProfile();

});

/* ==========================================================
ADD MONEY
========================================================== */

addMoneyBtn.addEventListener("click", () => {

    showDialog(

        "account_balance_wallet",

        "Coming Soon",

        "Wallet funding will be available when Paystack is connected."

    );

});

/* ==========================================================
SEARCH
========================================================== */

searchInput.addEventListener("input", () => {

    const keyword = searchInput.value.trim();

    console.log("Searching:", keyword);

    // Product search will be added later.

});

/* ==========================================================
CATEGORY CLICK
========================================================== */

document.querySelectorAll(".category-card").forEach(card=>{

    card.addEventListener("click",()=>{

        const category=

        card.innerText.trim();

        console.log("Category:",category);

    });

});

/* ==========================================================
BANNER SLIDER
========================================================== */

const slides = document.querySelectorAll(".banner-slide");

let currentSlide = 0;

function nextSlide(){

    slides[currentSlide].classList.remove("active");

    currentSlide++;

    if(currentSlide >= slides.length){

        currentSlide = 0;

    }

    slides[currentSlide].classList.add("active");

}

if(slides.length > 0){

    setInterval(nextSlide,4000);

}

console.log("✅ Dashboard Part 3 Loaded");
/* ==========================================================
BOTTOM NAVIGATION
========================================================== */

const bottomItems = document.querySelectorAll(".bottom-item");

bottomItems.forEach(item=>{

    item.addEventListener("click",()=>{

        bottomItems.forEach(btn=>{

            btn.classList.remove("active");

        });

        item.classList.add("active");

        const page=item.innerText.trim();

        console.log("Navigate:",page);

        switch(page){

            case "Home":

                window.location.href="../dashboard/dashboard.html";

            break;

            case "Wishlist":

                // window.location.href="../wishlist/wishlist.html";

            break;

            case "Cart":

                // window.location.href="../cart/cart.html";

            break;

            case "Orders":

                // window.location.href="../orders/orders.html";

            break;

            case "Profile":

                // window.location.href="../profile/profile.html";

            break;

        }

    });

});

/* ==========================================================
COMPLETE PROFILE BUTTON
========================================================== */

const completeProfileBtn=document.getElementById("completeProfileBtn");

if(completeProfileBtn){

    completeProfileBtn.addEventListener("click",()=>{

        // Change this later when we build the profile page

        // window.location.href="../profile/profile.html";

        showDialog(

            "person",

            "Profile",

            "The Profile page will be built next."

        );

    });

}

/* ==========================================================
LOGOUT
========================================================== */

async function logout(){

    await db.auth.signOut();

    window.location.href="../auth/login.html";

}

/* ==========================================================
AUTO REFRESH USER DATA
========================================================== */

setInterval(async()=>{

    if(currentUser){

        await loadUserProfile();

    }

},60000);

/* ==========================================================
READY
========================================================== */

console.log("======================================");

console.log("Dashboard Ready");

console.log("Welcome To Don Martial Shopping Mart");

console.log("======================================");

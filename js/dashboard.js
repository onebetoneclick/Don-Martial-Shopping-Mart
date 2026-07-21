/* ==========================================================
DON MARTIAL SHOPPING MART
ADMIN DASHBOARD
========================================================== */

"use strict";

console.clear();

console.log("=====================================");
console.log("DON MARTIAL SHOPPING MART");
console.log("Admin Dashboard Loading...");
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

const adminName=document.getElementById("adminName");

const adminAvatar=document.getElementById("adminAvatar");

const totalProducts=document.getElementById("totalProducts");

const totalCustomers=document.getElementById("totalCustomers");

const totalOrders=document.getElementById("totalOrders");

const totalRevenue=document.getElementById("totalRevenue");

const walletBalance=document.getElementById("walletBalance");

const pendingOrders=document.getElementById("pendingOrders");

const loadingOverlay=document.getElementById("loadingOverlay");

const dialogOverlay=document.getElementById("dialogOverlay");

const dialogIcon=document.getElementById("dialogIcon");

const dialogTitle=document.getElementById("dialogTitle");

const dialogMessage=document.getElementById("dialogMessage");

const dialogButton=document.getElementById("dialogButton");

/* ==========================================================
BUTTONS
========================================================== */

const dashboardBtn=document.getElementById("dashboardBtn");

const productsBtn=document.getElementById("productsBtn");

const customersBtn=document.getElementById("customersBtn");

const ordersBtn=document.getElementById("ordersBtn");

const walletBtn=document.getElementById("walletBtn");

const notificationBtn=document.getElementById("notificationBtn");

const analyticsBtn=document.getElementById("analyticsBtn");

const settingsBtn=document.getElementById("settingsBtn");

const logoutBtn=document.getElementById("logoutBtn");

const addProductBtn=document.getElementById("addProductBtn");

const manageProductsBtn=document.getElementById("manageProductsBtn");

const manageCustomersBtn=document.getElementById("manageCustomersBtn");

const manageOrdersBtn=document.getElementById("manageOrdersBtn");

const walletManagerBtn=document.getElementById("walletManagerBtn");

const sendNotificationBtn=document.getElementById("sendNotificationBtn");

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
ADMIN SESSION
========================================================== */

const adminSession=

JSON.parse(

sessionStorage.getItem("admin")

);

if(!adminSession){

    window.location.href=

    "../../pages/admin/login.html";

}

console.log("✅ Admin Dashboard Part 1 Loaded");
/* ==========================================================
LOAD ADMIN PROFILE
========================================================== */

async function loadAdminProfile(){

    try{

        adminName.textContent=

        adminSession.full_name || "Administrator";

        if(adminSession.avatar){

            adminAvatar.src=

            adminSession.avatar;

        }

    }

    catch(err){

        console.error(err);

    }

}

/* ==========================================================
LOAD TOTAL PRODUCTS
========================================================== */

async function loadProducts(){

    const{

        count,

        error

    }=await db

    .from("products")

    .select("*",{

        count:"exact",

        head:true

    });

    if(error){

        console.error(error);

        return;

    }

    totalProducts.textContent=

    count || 0;

}

/* ==========================================================
LOAD TOTAL CUSTOMERS
========================================================== */

async function loadCustomers(){

    const{

        count,

        error

    }=await db

    .from("profiles")

    .select("*",{

        count:"exact",

        head:true

    });

    if(error){

        console.error(error);

        return;

    }

    totalCustomers.textContent=

    count || 0;

}

/* ==========================================================
LOAD TOTAL ORDERS
========================================================== */

async function loadOrders(){

    const{

        count,

        error

    }=await db

    .from("orders")

    .select("*",{

        count:"exact",

        head:true

    });

    if(error){

        console.error(error);

        totalOrders.textContent="0";

        return;

    }

    totalOrders.textContent=

    count || 0;

}
/* ==========================================================
LOAD REVENUE
========================================================== */

async function loadRevenue(){

    try{

        const{

            data,

            error

        }=await db

        .from("orders")

        .select("total_amount,status");

        if(error){

            throw error;

        }

        let revenue=0;

        let pending=0;

        data.forEach(order=>{

            if(order.status==="completed"){

                revenue+=Number(

                    order.total_amount||0

                );

            }

            if(order.status==="pending"){

                pending++;

            }

        });

        totalRevenue.textContent=

        "₦"+

        revenue.toLocaleString(

            "en-NG",

            {

                minimumFractionDigits:2,

                maximumFractionDigits:2

            }

        );

        pendingOrders.textContent=

        pending;

    }

    catch(err){

        console.error(err);

    }

}

/* ==========================================================
LOAD WALLET BALANCE
========================================================== */

async function loadWalletBalance(){

    try{

        const{

            data,

            error

        }=await db

        .from("profiles")

        .select("wallet");

        if(error){

            throw error;

        }

        let total=0;

        data.forEach(user=>{

            total+=Number(

                user.wallet||0

            );

        });

        walletBalance.textContent=

        "₦"+

        total.toLocaleString(

            "en-NG",

            {

                minimumFractionDigits:2,

                maximumFractionDigits:2

            }

        );

    }

    catch(err){

        console.error(err);

    }

}

console.log("✅ Admin Dashboard Part 2 Loaded");
/* ==========================================================
INITIALIZE DASHBOARD
========================================================== */

async function initializeDashboard(){

    try{

        showLoading();

        await loadAdminProfile();

        await Promise.all([

            loadProducts(),

            loadCustomers(),

            loadOrders(),

            loadRevenue(),

            loadWalletBalance()

        ]);

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

/* ==========================================================
START DASHBOARD
========================================================== */

window.addEventListener("load",()=>{

    initializeDashboard();

});

/* ==========================================================
QUICK ACTION BUTTONS
========================================================== */

addProductBtn.addEventListener("click",()=>{

    window.location.href=

    "../../pages/admin/add-product.html";

});

manageProductsBtn.addEventListener("click",()=>{

    window.location.href=

    "../../pages/admin/products.html";

});

manageCustomersBtn.addEventListener("click",()=>{

    window.location.href=

    "../../pages/admin/customers.html";

});

manageOrdersBtn.addEventListener("click",()=>{

    window.location.href=

    "../../pages/admin/orders.html";

});

walletManagerBtn.addEventListener("click",()=>{

    window.location.href=

    "../../pages/admin/wallet.html";

});

sendNotificationBtn.addEventListener("click",()=>{

    window.location.href=

    "../../pages/admin/send-notification.html";

});

/* ==========================================================
SIDEBAR MENU
========================================================== */

dashboardBtn.addEventListener("click",()=>{

    window.location.href=

    "../../pages/admin/dashboard.html";

});

productsBtn.addEventListener("click",()=>{

    window.location.href=

    "../../pages/admin/products.html";

});

customersBtn.addEventListener("click",()=>{

    window.location.href=

    "../../pages/admin/customers.html";

});

ordersBtn.addEventListener("click",()=>{

    window.location.href=

    "../../pages/admin/orders.html";

});

walletBtn.addEventListener("click",()=>{

    window.location.href=

    "../../pages/admin/wallet.html";

});

notificationBtn.addEventListener("click",()=>{

    window.location.href=

    "../../pages/admin/send-notification.html";

});

analyticsBtn.addEventListener("click",()=>{

    showDialog(

        "analytics",

        "Coming Soon",

        "Analytics module will be available soon."

    );

});

settingsBtn.addEventListener("click",()=>{

    showDialog(

        "settings",

        "Coming Soon",

        "Admin settings will be available soon."

    );

});
/* ==========================================================
LOGOUT
========================================================== */

logoutBtn.addEventListener("click",()=>{

    const confirmLogout=confirm(

        "Are you sure you want to logout?"

    );

    if(!confirmLogout){

        return;

    }

    sessionStorage.removeItem("admin");

    window.location.href=

    "../../pages/admin/login.html";

});

/* ==========================================================
AUTO REFRESH
========================================================== */

setInterval(async()=>{

    await Promise.all([

        loadProducts(),

        loadCustomers(),

        loadOrders(),

        loadRevenue(),

        loadWalletBalance()

    ]);

},60000);

/* ==========================================================
WINDOW FOCUS REFRESH
========================================================== */

window.addEventListener("focus",()=>{

    initializeDashboard();

});

/* ==========================================================
READY
========================================================== */

console.log("=====================================");

console.log("Admin Dashboard Ready");

console.log("Don Martial Shopping Mart");

console.log("=====================================");
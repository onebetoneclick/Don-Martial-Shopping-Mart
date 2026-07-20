/* ==========================================================
DON MARTIAL SHOPPING MART
SETTINGS.JS
========================================================== */

"use strict";

console.clear();

console.log("=====================================");
console.log("DON MARTIAL SHOPPING MART");
console.log("Settings Loading...");
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

const profileAvatar = document.getElementById("profileAvatar");

const userName = document.getElementById("userName");

const userEmail = document.getElementById("userEmail");

const customerID = document.getElementById("customerID");

const loadingOverlay = document.getElementById("loadingOverlay");

const dialogOverlay = document.getElementById("dialogOverlay");

const dialogIcon = document.getElementById("dialogIcon");

const dialogTitle = document.getElementById("dialogTitle");

const dialogMessage = document.getElementById("dialogMessage");

const dialogButton = document.getElementById("dialogButton");

const backBtn = document.getElementById("backBtn");

const logoutBtn = document.getElementById("logoutBtn");

const profileBtn = document.getElementById("profileBtn");

const themeSelect = document.getElementById("themeSelect");

const darkMode = document.getElementById("darkMode");

/* ==========================================================
CURRENT USER
========================================================== */

let currentUser = null;

let currentProfile = null;

/* ==========================================================
LOADING
========================================================== */

function showLoading() {

    loadingOverlay.classList.add("active");

}

function hideLoading() {

    loadingOverlay.classList.remove("active");

}

/* ==========================================================
CUSTOM DIALOG
========================================================== */

function showDialog(icon, title, message) {

    dialogIcon.innerHTML = `

        <span class="material-symbols-rounded">

            ${icon}

        </span>

    `;

    dialogTitle.textContent = title;

    dialogMessage.textContent = message;

    dialogOverlay.classList.add("active");

}

dialogButton.addEventListener("click", () => {

    dialogOverlay.classList.remove("active");

});

/* ==========================================================
CHECK SESSION
========================================================== */

async function checkSession() {

    const {

        data,

        error

    } = await db.auth.getSession();

    if (error) {

        console.error(error);

        return null;

    }

    if (!data.session) {

        window.location.href = "../../pages/auth/login.html";

        return null;

    }

    return data.session.user;

}

console.log("✅ Settings Part 1 Loaded");
/* ==========================================================
LOAD USER PROFILE
========================================================== */

async function loadUserProfile() {

    try {

        showLoading();

        currentUser = await checkSession();

        if (!currentUser) {

            hideLoading();

            return;

        }

        const {

            data,

            error

        } = await db

            .from("profiles")

            .select("*")

            .eq("user_id", currentUser.id)

            .single();

        if (error) {

            throw error;

        }

        currentProfile = data;

        /* ==========================================
        USER NAME
        ========================================== */

        userName.textContent =

            data.full_name || "Customer";

        /* ==========================================
        EMAIL
        ========================================== */

        userEmail.textContent =

            data.email || currentUser.email;

        /* ==========================================
        CUSTOMER ID
        ========================================== */

        customerID.textContent =

            data.customer_id || "DM000000";

        /* ==========================================
        PROFILE PHOTO
        ========================================== */

        if (

            data.avatar &&

            data.avatar.trim() !== ""

        ) {

            profileAvatar.src = data.avatar;

        }

        /* ==========================================
        THEME
        ========================================== */

        if (data.theme) {

            themeSelect.value = data.theme;

        }

        /* ==========================================
        DARK MODE
        ========================================== */

        if (data.dark_mode === true) {

            darkMode.checked = true;

            document.body.classList.add("dark-mode");

        }

        hideLoading();

    }

    catch (err) {

        hideLoading();

        console.error(err);

        showDialog(

            "error",

            "Settings Error",

            err.message

        );

    }

}

console.log("✅ Settings Part 2 Loaded");
/* ==========================================================
BACK BUTTON
========================================================== */

backBtn.addEventListener("click", () => {

    window.location.href = "../../pages/dashboard/dashboard.html";

});

/* ==========================================================
PROFILE PAGE
========================================================== */

profileBtn.addEventListener("click", () => {

    window.location.href = "../../pages/auth/profile.html";

});

/* ==========================================================
CHANGE PASSWORD PAGE
========================================================== */

const changePasswordBtn = document.getElementById("changePasswordBtn");

changePasswordBtn.addEventListener("click", () => {

    window.location.href = "../../pages/auth/change-password.html";

});

/* ==========================================================
SAVE THEME
========================================================== */

themeSelect.addEventListener("change", async () => {

    if (!currentUser) return;

    try {

        showLoading();

        const { error } = await db

            .from("profiles")

            .update({

                theme: themeSelect.value

            })

            .eq("user_id", currentUser.id);

        if (error) throw error;

        hideLoading();

        showDialog(

            "palette",

            "Theme Updated",

            "Your preferred theme has been saved."

        );

    }

    catch (err) {

        hideLoading();

        console.error(err);

        showDialog(

            "error",

            "Update Failed",

            err.message

        );

    }

});

/* ==========================================================
DARK MODE
========================================================== */

darkMode.addEventListener("change", async () => {

    document.body.classList.toggle(

        "dark-mode",

        darkMode.checked

    );

    if (!currentUser) return;

    try {

        await db

            .from("profiles")

            .update({

                dark_mode: darkMode.checked

            })

            .eq("user_id", currentUser.id);

    }

    catch (err) {

        console.error(err);

    }

});

/* ==========================================================
COMING SOON BUTTONS
========================================================== */

const comingSoonButtons = [

    "addressBtn",

    "walletBtn",

    "transactionBtn",

    "paymentMethodBtn",

    "deviceBtn",

    "privacyBtn",

    "twoFactorBtn",

    "helpCenterBtn",

    "contactBtn",

    "aboutBtn",

    "rateBtn"

];

comingSoonButtons.forEach(id => {

    const button = document.getElementById(id);

    if (!button) return;

    button.addEventListener("click", () => {

        showDialog(

            "construction",

            "Coming Soon",

            "This feature will be available in the next update."

        );

    });

});

console.log("✅ Settings Part 3 Loaded");
/* ==========================================================
LOGOUT
========================================================== */

logoutBtn.addEventListener("click", async () => {

    const confirmLogout = confirm(

        "Are you sure you want to logout?"

    );

    if (!confirmLogout) {

        return;

    }

    try {

        showLoading();

        const { error } = await db.auth.signOut();

        if (error) throw error;

        hideLoading();

        window.location.href = "../auth/login.html";

    }

    catch (err) {

        hideLoading();

        console.error(err);

        showDialog(

            "error",

            "Logout Failed",

            err.message

        );

    }

});

/* ==========================================================
AUTO REFRESH PROFILE
========================================================== */

setInterval(async () => {

    if (currentUser) {

        await loadUserProfile();

    }

}, 60000);

/* ==========================================================
INITIALIZE SETTINGS
========================================================== */

window.addEventListener("load", async () => {

    await loadUserProfile();

});

/* ==========================================================
READY
========================================================== */

console.log("=====================================");

console.log("Settings Ready");

console.log("Don Martial Shopping Mart");

console.log("=====================================");
/* ==========================================================
   DON MARTIAL SHOPPING MART
   LOGIN.JS
========================================================== */

"use strict";

console.clear();

console.log("======================================");
console.log("DON MARTIAL SHOPPING MART");
console.log("Login System Loading...");
console.log("======================================");

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

const loginForm = document.getElementById("loginForm");

const email = document.getElementById("email");

const password = document.getElementById("password");

const rememberMe = document.getElementById("rememberMe");

const loginBtn = document.getElementById("loginBtn");

const googleLogin = document.getElementById("googleLogin");

const togglePassword = document.getElementById("togglePassword");

/* ==========================================================
   DIALOG
========================================================== */

const dialogOverlay = document.getElementById("dialogOverlay");

const dialogIcon = document.getElementById("dialogIcon");

const dialogTitle = document.getElementById("dialogTitle");

const dialogMessage = document.getElementById("dialogMessage");

const dialogButton = document.getElementById("dialogButton");

/* ==========================================================
   LOADING
========================================================== */

const loadingOverlay = document.getElementById("loadingOverlay");

/* ==========================================================
   SHOW DIALOG
========================================================== */

function showDialog(icon, title, message){

    dialogIcon.innerHTML = `

        <span class="material-symbols-rounded">

            ${icon}

        </span>

    `;

    dialogTitle.textContent = title;

    dialogMessage.textContent = message;

    dialogOverlay.classList.add("active");

}

/* ==========================================================
   CLOSE DIALOG
========================================================== */

dialogButton.addEventListener("click",()=>{

    dialogOverlay.classList.remove("active");

});

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
   BUTTON STATE
========================================================== */

function disableLoginButton(){

    loginBtn.disabled = true;

    loginBtn.innerHTML = `

        <span class="material-symbols-rounded">

            progress_activity

        </span>

        Signing In...

    `;

}

function enableLoginButton(){

    loginBtn.disabled = false;

    loginBtn.innerHTML = `

        <span class="material-symbols-rounded">

            login

        </span>

        Login

    `;

}

/* ==========================================================
   SHOW / HIDE PASSWORD
========================================================== */

togglePassword.addEventListener("click",()=>{

    if(password.type==="password"){

        password.type="text";

        togglePassword.innerHTML=`

            <span class="material-symbols-rounded">

                visibility_off

            </span>

        `;

    }else{

        password.type="password";

        togglePassword.innerHTML=`

            <span class="material-symbols-rounded">

                visibility

            </span>

        `;

    }

});

/* ==========================================================
   CHECK EXISTING SESSION
========================================================== */

async function checkSession(){

    try{

        const {

            data,

            error

        } = await db.auth.getSession();

        if(error){

            console.log(error.message);

            return;

        }

        if(data.session){

            window.location.href="../dashboard.html";

        }

    }

    catch(err){

        console.log(err);

    }

}

console.log("✅ Login Part 1 Loaded");
/* ==========================================================
   FORM VALIDATION
========================================================== */

function validateForm(){

    const emailRegex =

    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email.value.trim())){

        showDialog(

            "mail",

            "Invalid Email",

            "Please enter a valid email address."

        );

        email.focus();

        return false;

    }

    if(password.value.trim().length<8){

        showDialog(

            "lock",

            "Invalid Password",

            "Password must be at least 8 characters."

        );

        password.focus();

        return false;

    }

    return true;

}

/* ==========================================================
   REMEMBER ME
========================================================== */

function saveRememberMe(){

    if(rememberMe.checked){

        localStorage.setItem(

            "remember_email",

            email.value.trim()

        );

    }else{

        localStorage.removeItem(

            "remember_email"

        );

    }

}

/* ==========================================================
   LOAD REMEMBERED EMAIL
========================================================== */

function loadRememberMe(){

    const rememberedEmail =

    localStorage.getItem(

        "remember_email"

    );

    if(rememberedEmail){

        email.value = rememberedEmail;

        rememberMe.checked = true;

    }

}

/* ==========================================================
   AUTO REMOVE SPACES
========================================================== */

email.addEventListener("input",()=>{

    email.value = email.value.trim();

});

/* ==========================================================
   ENTER KEY
========================================================== */

document.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        if(document.activeElement.tagName==="INPUT"){

            return;

        }

    }

});

/* ==========================================================
   FORM SUBMIT
========================================================== */

loginForm.addEventListener(

    "submit",

    async(e)=>{

        e.preventDefault();

        if(!validateForm()){

            return;

        }

        saveRememberMe();

        await loginUser();

    }

);

console.log("✅ Login Part 2 Loaded");
/* ==========================================================
   LOGIN USER
========================================================== */

async function loginUser(){

    try{

        disableLoginButton();

        showLoading();

        /* ==========================================
           SIGN IN
        ========================================== */

        const {

            data,

            error

        } = await db.auth.signInWithPassword({

            email:email.value.trim(),

            password:password.value

        });

        if(error){

            throw error;

        }

        if(!data.user){

            throw new Error(

                "Unable to login."

            );

        }

        /* ==========================================
           GET PROFILE
        ========================================== */

        const {

            data:profile,

            error:profileError

        } = await db

        .from("profiles")

        .select("*")

        .eq("user_id",data.user.id)

        .single();

        if(profileError){

            throw profileError;

        }

        /* ==========================================
           ACCOUNT STATUS
        ========================================== */

        if(profile.status !== "Active"){

            await db.auth.signOut();

            throw new Error(

                "Your account has been suspended."

            );

        }

        /* ==========================================
           UPDATE LAST LOGIN
        ========================================== */

        await db

        .from("profiles")

        .update({

            last_login:new Date().toISOString()

        })

        .eq("user_id",data.user.id);

        hideLoading();

        enableLoginButton();

        showDialog(

            "check_circle",

            "Login Successful",

            "Welcome back " +

            profile.full_name +

            "."

        );

        dialogButton.onclick=()=>{

            window.location.href="../dashboard.html";

        };

    }

    catch(err){

        hideLoading();

        enableLoginButton();

        console.error(err);

        let message = err.message;

        if(

            message.includes(

                "Invalid login credentials"

            )

        ){

            message="Incorrect email or password.";

        }

        if(

            message.includes(

                "Email not confirmed"

            )

        ){

            message="Please verify your email before logging in.";

        }

        if(

            message.includes(

                "Network"

            )

        ){

            message="Network error. Please check your internet connection.";

        }

        showDialog(

            "error",

            "Login Failed",

            message

        );

    }

}

console.log("✅ Login Part 3 Loaded");
/* ==========================================================
   GOOGLE LOGIN (COMING SOON)
========================================================== */

googleLogin.addEventListener("click",()=>{

    showDialog(

        "info",

        "Coming Soon",

        "Google Sign In will be available in a future update."

    );

});

/* ==========================================================
   PAGE INITIALIZATION
========================================================== */

window.addEventListener("load",()=>{

    loadRememberMe();

    checkSession();

});

/* ==========================================================
   PREVENT MULTIPLE SUBMITS
========================================================== */

let isLoggingIn = false;

loginForm.addEventListener("submit",async(e)=>{

    e.preventDefault();

    if(isLoggingIn){

        return;

    }

    if(!validateForm()){

        return;

    }

    isLoggingIn = true;

    saveRememberMe();

    await loginUser();

    isLoggingIn = false;

});

/* ==========================================================
   AUTO LOWERCASE EMAIL
========================================================== */

email.addEventListener("blur",()=>{

    email.value = email.value.trim().toLowerCase();

});

/* ==========================================================
   CLOSE DIALOG WITH ESC
========================================================== */

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        dialogOverlay.classList.remove("active");

    }

});

/* ==========================================================
   FINAL DEBUG
========================================================== */

console.log("======================================");
console.log("Login System Ready");
console.log(window.APP_CONFIG);
console.log(window.supabaseClient);
console.log("======================================");

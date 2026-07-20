/* ==========================================================
   DON MARTIAL SHOPPING MART
   SIGNUP.JS
========================================================== */

"use strict";

console.clear();

console.log("======================================");
console.log("DON MARTIAL SHOPPING MART");
console.log("Signup System Loading...");
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

const signupForm = document.getElementById("signupForm");

const fullName = document.getElementById("fullName");

const email = document.getElementById("email");

const phone = document.getElementById("phone");

const password = document.getElementById("password");

const confirmPassword = document.getElementById("confirmPassword");

const agreeTerms = document.getElementById("agreeTerms");

const signupBtn = document.getElementById("signupBtn");

const googleSignup = document.getElementById("googleSignup");

const togglePassword = document.getElementById("togglePassword");

const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

const strengthFill = document.getElementById("strengthFill");

const strengthText = document.getElementById("strengthText");

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
   PASSWORD VISIBILITY
========================================================== */

togglePassword.addEventListener("click",()=>{

    if(password.type==="password"){

        password.type="text";

        togglePassword.innerHTML=`

        <span class="material-symbols-rounded">

        visibility_off

        </span>`;

    }else{

        password.type="password";

        togglePassword.innerHTML=`

        <span class="material-symbols-rounded">

        visibility

        </span>`;

    }

});

toggleConfirmPassword.addEventListener("click",()=>{

    if(confirmPassword.type==="password"){

        confirmPassword.type="text";

        toggleConfirmPassword.innerHTML=`

        <span class="material-symbols-rounded">

        visibility_off

        </span>`;

    }else{

        confirmPassword.type="password";

        toggleConfirmPassword.innerHTML=`

        <span class="material-symbols-rounded">

        visibility

        </span>`;

    }

});

/* ==========================================================
   PASSWORD STRENGTH
========================================================== */

password.addEventListener("input",checkPasswordStrength);

function checkPasswordStrength(){

    const value=password.value;

    let score=0;

    if(value.length>=8) score++;

    if(/[A-Z]/.test(value)) score++;

    if(/[a-z]/.test(value)) score++;

    if(/[0-9]/.test(value)) score++;

    if(/[^A-Za-z0-9]/.test(value)) score++;

    switch(score){

        case 0:

        case 1:

            strengthFill.style.width="20%";

            strengthFill.style.background="#FF4D4F";

            strengthText.innerHTML="Weak Password";

        break;

        case 2:

            strengthFill.style.width="40%";

            strengthFill.style.background="#FF9800";

            strengthText.innerHTML="Fair Password";

        break;

        case 3:

            strengthFill.style.width="60%";

            strengthFill.style.background="#FFC107";

            strengthText.innerHTML="Good Password";

        break;

        case 4:

            strengthFill.style.width="80%";

            strengthFill.style.background="#4CAF50";

            strengthText.innerHTML="Strong Password";

        break;

        case 5:

            strengthFill.style.width="100%";

            strengthFill.style.background="#00C853";

            strengthText.innerHTML="Very Strong Password";

        break;

    }

}

console.log("✅ Signup Part 1 Loaded");
/* ==========================================================
   FORM VALIDATION
========================================================== */

function validateForm(){

    if(fullName.value.trim().length < 3){

        showDialog(

            "warning",

            "Invalid Name",

            "Please enter your full name."

        );

        fullName.focus();

        return false;

    }

    const emailRegex =

    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email.value.trim())){

        showDialog(

            "error",

            "Invalid Email",

            "Please enter a valid email address."

        );

        email.focus();

        return false;

    }

    const phoneRegex = /^0\d{10}$/;

    if(!phoneRegex.test(phone.value.trim())){

        showDialog(

            "error",

            "Invalid Phone",

            "Phone number must contain exactly 11 digits."

        );

        phone.focus();

        return false;

    }

    if(password.value.length < 8){

        showDialog(

            "lock",

            "Weak Password",

            "Password must be at least 8 characters."

        );

        password.focus();

        return false;

    }

    if(password.value !== confirmPassword.value){

        showDialog(

            "error",

            "Password Mismatch",

            "Passwords do not match."

        );

        confirmPassword.focus();

        return false;

    }

    if(!agreeTerms.checked){

        showDialog(

            "warning",

            "Terms Required",

            "Please agree to the Terms & Conditions."

        );

        return false;

    }

    return true;

}

/* ==========================================================
   BUTTON LOADING
========================================================== */

function disableSignupButton(){

    signupBtn.disabled = true;

    signupBtn.innerHTML = `

        <span class="material-symbols-rounded">

            progress_activity

        </span>

        Creating Account...

    `;

}

function enableSignupButton(){

    signupBtn.disabled = false;

    signupBtn.innerHTML = `

        <span class="material-symbols-rounded">

            person_add

        </span>

        Create Account

    `;

}

/* ==========================================================
   PHONE NUMBER
========================================================== */

phone.addEventListener("input",()=>{

    phone.value = phone.value.replace(/\D/g,"");

    if(phone.value.length>11){

        phone.value = phone.value.substring(0,11);

    }

});

/* ==========================================================
   PASSWORD MATCH
========================================================== */

confirmPassword.addEventListener("keyup",()=>{

    if(confirmPassword.value==="") return;

    if(password.value===confirmPassword.value){

        confirmPassword.style.color="#00B761";

    }else{

        confirmPassword.style.color="#FF4D4F";

    }

});

console.log("✅ Signup Part 2 Loaded");
/* ==========================================================
   CREATE ACCOUNT
========================================================== */

async function createAccount(){

    if(!validateForm()){

        return;

    }

    try{

        disableSignupButton();

        showLoading();

        /* ==========================================
           CREATE AUTH USER
        ========================================== */

        const{

            data,

            error

        } = await db.auth.signUp({

            email:email.value.trim(),

            password:password.value,

            options:{

                data:{

                    full_name:fullName.value.trim()

                }

            }

        });

        if(error){

            throw error;

        }

        if(!data.user){

            throw new Error(

                "Unable to create your account."

            );

        }

        /* ==========================================
           INSERT PROFILE
        ========================================== */

        const{

            error:profileError

        } = await db

        .from("profiles")

        .insert({

            user_id:data.user.id,

            full_name:fullName.value.trim(),

            email:email.value.trim(),

            phone:phone.value.trim(),

            avatar:"default-avatar.png",

            address:null,

            city:null,

            state:null,

            wallet:0,

            profile_completed:false,

            verified:false,

            status:"Active",

            role:"Customer",

            last_login:null

        });

        if(profileError){

            throw profileError;

        }

        hideLoading();

        enableSignupButton();

        showDialog(

            "check_circle",

            "Account Created",

            "Your account has been created successfully. Please login to continue."

        );

        dialogButton.onclick = ()=>{

            window.location.href="login.html";

        };

    }

    catch(error){

        hideLoading();

        enableSignupButton();

        console.error(error);

        let message = error.message;

        /* ==========================================
           FRIENDLY ERRORS
        ========================================== */

        if(message.includes("User already registered")){

            message="This email already has an account. Please login instead.";

        }

        if(message.includes("duplicate")){

            message="This email already exists.";

        }

        if(message.includes("Invalid login credentials")){

            message="Invalid email or password.";

        }

        if(message.includes("Password should")){

            message="Please choose a stronger password.";

        }

        showDialog(

            "error",

            "Signup Failed",

            message

        );

    }

}

console.log("✅ Signup Part 3 Loaded");
/* ==========================================================
   SIGNUP FORM
========================================================== */

signupForm.addEventListener("submit",async(e)=>{

    e.preventDefault();

    await createAccount();

});

/* ==========================================================
   GOOGLE SIGNUP
========================================================== */

googleSignup.addEventListener("click",()=>{

    showDialog(

        "info",

        "Coming Soon",

        "Google Sign Up will be available soon."

    );

});

/* ==========================================================
   CHECK SESSION
========================================================== */

async function checkSession(){

    try{

        const{

            data,

            error

        } = await db.auth.getSession();

        if(error){

            console.log(error.message);

            return;

        }

        if(data.session){

           window.location.href = "pages/dashboard/dashboard.html";

        }

    }

    catch(err){

        console.log(err);

    }

}

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
   PAGE LOAD
========================================================== */

window.addEventListener("load",()=>{

    checkSession();

});

/* ==========================================================
   DEBUG
========================================================== */

console.log("===============================");

console.log("Signup System Ready");

console.log(window.APP_CONFIG);

console.log(window.supabaseClient);

console.log("===============================");

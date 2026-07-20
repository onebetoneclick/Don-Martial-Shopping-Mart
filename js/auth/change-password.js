/* ==========================================================
DON MARTIAL SHOPPING MART
CHANGE PASSWORD
========================================================== */

"use strict";

console.clear();

console.log("=====================================");
console.log("DON MARTIAL SHOPPING MART");
console.log("Change Password Loading...");
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

const passwordForm = document.getElementById("passwordForm");

const currentPassword = document.getElementById("currentPassword");

const newPassword = document.getElementById("newPassword");

const confirmPassword = document.getElementById("confirmPassword");

const strengthFill = document.getElementById("strengthFill");

const strengthText = document.getElementById("strengthText");

const lengthRule = document.getElementById("lengthRule");

const upperRule = document.getElementById("upperRule");

const numberRule = document.getElementById("numberRule");

const specialRule = document.getElementById("specialRule");

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

    dialogIcon.innerHTML = `

        <span class="material-symbols-rounded">

            ${icon}

        </span>

    `;

    dialogTitle.textContent = title;

    dialogMessage.textContent = message;

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

    currentUser = data.session.user;

    return currentUser;

}

/* ==========================================================
BACK BUTTON
========================================================== */

backBtn.addEventListener("click",()=>{

    window.location.href="../../pages/auth/settings.html";

});

console.log("✅ Change Password Part 1 Loaded");
/* ==========================================================
SHOW / HIDE PASSWORD
========================================================== */

document.querySelectorAll(".togglePassword").forEach(button=>{

    button.addEventListener("click",()=>{

        const input = document.getElementById(

            button.dataset.target

        );

        if(input.type==="password"){

            input.type="text";

            button.innerHTML=`

                <span class="material-symbols-rounded">

                    visibility_off

                </span>

            `;

        }else{

            input.type="password";

            button.innerHTML=`

                <span class="material-symbols-rounded">

                    visibility

                </span>

            `;

        }

    });

});

/* ==========================================================
PASSWORD STRENGTH
========================================================== */

function checkPasswordStrength(password){

    let score = 0;

    /* --------------------------
       Rules
    -------------------------- */

    const hasLength = password.length >= 8;

    const hasUpper = /[A-Z]/.test(password);

    const hasNumber = /[0-9]/.test(password);

    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    /* --------------------------
       Checklist
    -------------------------- */

    updateRule(lengthRule,hasLength);

    updateRule(upperRule,hasUpper);

    updateRule(numberRule,hasNumber);

    updateRule(specialRule,hasSpecial);

    if(hasLength) score++;

    if(hasUpper) score++;

    if(hasNumber) score++;

    if(hasSpecial) score++;

    updateStrength(score);

}

/* ==========================================================
RULE UI
========================================================== */

function updateRule(element,passed){

    const icon = element.querySelector("span");

    if(passed){

        element.classList.add("valid");

        icon.textContent="check_circle";

    }else{

        element.classList.remove("valid");

        icon.textContent="radio_button_unchecked";

    }

}

/* ==========================================================
STRENGTH BAR
========================================================== */

function updateStrength(score){

    switch(score){

        case 0:

        case 1:

            strengthFill.style.width="25%";

            strengthFill.style.background="#EF4444";

            strengthText.textContent="Weak";

            strengthText.style.color="#EF4444";

        break;

        case 2:

            strengthFill.style.width="50%";

            strengthFill.style.background="#F59E0B";

            strengthText.textContent="Fair";

            strengthText.style.color="#F59E0B";

        break;

        case 3:

            strengthFill.style.width="75%";

            strengthFill.style.background="#3B82F6";

            strengthText.textContent="Good";

            strengthText.style.color="#3B82F6";

        break;

        case 4:

            strengthFill.style.width="100%";

            strengthFill.style.background="#22C55E";

            strengthText.textContent="Strong";

            strengthText.style.color="#22C55E";

        break;

    }

}

/* ==========================================================
LIVE PASSWORD CHECK
========================================================== */

newPassword.addEventListener("input",()=>{

    checkPasswordStrength(

        newPassword.value

    );

});

console.log("✅ Change Password Part 2 Loaded");
/* ==========================================================
CHANGE PASSWORD
========================================================== */

passwordForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    try{

        showLoading();

        await checkSession();

        /* ==========================================
        VALIDATION
        ========================================== */

        if(currentPassword.value.trim()===""){

            throw new Error("Please enter your current password.");

        }

        if(newPassword.value.length < 8){

            throw new Error("Your new password must be at least 8 characters long.");

        }

        if(newPassword.value !== confirmPassword.value){

            throw new Error("New password and confirmation password do not match.");

        }

        if(newPassword.value === currentPassword.value){

            throw new Error("Your new password must be different from your current password.");

        }

        /* ==========================================
        UPDATE PASSWORD
        ========================================== */

        const {

            data,

            error

        } = await db.auth.updateUser({

            password: newPassword.value

        });

        if(error){

            throw error;

        }

        hideLoading();

        showDialog(

            "check_circle",

            "Password Updated",

            "Your password has been changed successfully."

        );

        /* ==========================================
        RESET FORM
        ========================================== */

        passwordForm.reset();

        strengthFill.style.width="0%";

        strengthText.textContent="Weak";

        strengthText.style.color="#EF4444";

        [

            lengthRule,

            upperRule,

            numberRule,

            specialRule

        ].forEach(rule=>{

            rule.classList.remove("valid");

            rule.querySelector("span").textContent="radio_button_unchecked";

        });

    }

    catch(err){

        hideLoading();

        console.error(err);

        showDialog(

            "error",

            "Password Update Failed",

            err.message

        );

    }

});

console.log("✅ Change Password Part 3 Loaded");
/* ==========================================================
INITIALIZE PAGE
========================================================== */

window.addEventListener("load", async () => {

    showLoading();

    const user = await checkSession();

    hideLoading();

    if(!user){

        return;

    }

});

/* ==========================================================
DIALOG BUTTON
========================================================== */

dialogButton.addEventListener("click",()=>{

    dialogOverlay.classList.remove("active");

    if(dialogTitle.textContent==="Password Updated"){

        window.location.href="../../pages/auth/settings.html";

    }

});

/* ==========================================================
CLEAR PASSWORD FIELDS
========================================================== */

function clearPasswordFields(){

    currentPassword.value="";

    newPassword.value="";

    confirmPassword.value="";

}

/* ==========================================================
PREVENT DOUBLE SUBMISSION
========================================================== */

let isSubmitting = false;

passwordForm.addEventListener("submit",()=>{

    if(isSubmitting){

        return false;

    }

    isSubmitting=true;
    isSubmitting = false;

    setTimeout(()=>{

        isSubmitting=false;

    },3000);

});

/* ==========================================================
READY
========================================================== */

console.log("=====================================");

console.log("Change Password Ready");

console.log("Don Martial Shopping Mart");

console.log("=====================================");
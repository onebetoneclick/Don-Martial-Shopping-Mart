// ==========================================
// DON MARTIAL SHOPPING MART
// INDEX.JS
// PART 1
// ==========================================

// ==========================================
// DOM ELEMENTS
// ==========================================

const slides = document.querySelectorAll(".slide");

const dots = document.querySelectorAll(".dot");

const nextBtn = document.getElementById("nextBtn");

const prevBtn = document.getElementById("prevBtn");

const loadingScreen = document.getElementById("loadingScreen");

// ==========================================
// SETTINGS
// ==========================================

let currentSlide = 0;

let autoSlide;

// ==========================================
// LOADING SCREEN
// ==========================================

window.addEventListener("load", () => {

    setTimeout(() => {

        loadingScreen.style.opacity = "0";

        loadingScreen.style.pointerEvents = "none";

        setTimeout(() => {

            loadingScreen.remove();

        }, 500);

    }, 2500);

});

// ==========================================
// SHOW SLIDE
// ==========================================

function showSlide(index){

    slides.forEach((slide)=>{

        slide.classList.remove("active");

    });

    dots.forEach((dot)=>{

        dot.classList.remove("active");

    });

    slides[index].classList.add("active");

    dots[index].classList.add("active");

    updateButtons();

}

// ==========================================
// UPDATE BUTTONS
// ==========================================

function updateButtons(){

    prevBtn.style.visibility =

        currentSlide === 0

        ? "hidden"

        : "visible";

    if(currentSlide === slides.length - 1){

        nextBtn.style.display = "none";

    }else{

        nextBtn.style.display = "inline-flex";

    }

}
// ==========================================
// DON MARTIAL SHOPPING MART
// INDEX.JS
// PART 2
// Navigation
// ==========================================

// ==========================================
// NEXT BUTTON
// ==========================================

nextBtn.addEventListener("click", () => {

    if(currentSlide < slides.length - 1){

        currentSlide++;

        showSlide(currentSlide);

        restartAutoSlide();

    }

});

// ==========================================
// PREVIOUS BUTTON
// ==========================================

prevBtn.addEventListener("click", () => {

    if(currentSlide > 0){

        currentSlide--;

        showSlide(currentSlide);

        restartAutoSlide();

    }

});

// ==========================================
// DOT CLICK
// ==========================================

dots.forEach((dot,index)=>{

    dot.addEventListener("click",()=>{

        currentSlide=index;

        showSlide(currentSlide);

        restartAutoSlide();

    });

});

// ==========================================
// AUTO SLIDE
// ==========================================

function startAutoSlide(){

    autoSlide=setInterval(()=>{

        if(currentSlide < slides.length-1){

            currentSlide++;

        }else{

            currentSlide=0;

        }

        showSlide(currentSlide);

    },5000);

}

// ==========================================
// RESTART AUTO SLIDE
// ==========================================

function restartAutoSlide(){

    clearInterval(autoSlide);

    startAutoSlide();

}

// ==========================================
// START AUTO SLIDE
// ==========================================

startAutoSlide();

// ==========================================
// SHOW FIRST SLIDE
// ==========================================

showSlide(currentSlide);
// ==========================================
// DON MARTIAL SHOPPING MART
// INDEX.JS
// PART 3
// Premium Features
// ==========================================

// ==========================================
// MOBILE SWIPE
// ==========================================

let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("touchstart",(e)=>{

    touchStartX = e.changedTouches[0].screenX;

});

document.addEventListener("touchend",(e)=>{

    touchEndX = e.changedTouches[0].screenX;

    handleSwipe();

});

function handleSwipe(){

    if(touchEndX < touchStartX - 60){

        if(currentSlide < slides.length-1){

            currentSlide++;

            showSlide(currentSlide);

            restartAutoSlide();

        }

    }

    if(touchEndX > touchStartX + 60){

        if(currentSlide > 0){

            currentSlide--;

            showSlide(currentSlide);

            restartAutoSlide();

        }

    }

}

// ==========================================
// KEYBOARD SUPPORT
// ==========================================

document.addEventListener("keydown",(e)=>{

    if(e.key==="ArrowRight"){

        nextBtn.click();

    }

    if(e.key==="ArrowLeft"){

        prevBtn.click();

    }

});

// ==========================================
// SAVE ONBOARDING
// ==========================================

const createBtn=document.querySelector(".create-btn");

const loginBtn=document.querySelector(".login-btn");

createBtn.addEventListener("click",()=>{

    localStorage.setItem("onboardingCompleted","true");

});

loginBtn.addEventListener("click",()=>{

    localStorage.setItem("onboardingCompleted","true");

});

// ==========================================
// RETURNING USERS
// ==========================================

const completed=

localStorage.getItem("onboardingCompleted");

if(completed==="true"){

    console.log("Returning visitor.");

}

// ==========================================
// CHECK LOGIN
// ==========================================

async function checkLogin(){

    try{

        const {data}=

        await window.supabaseClient.auth.getSession();

        if(data.session){

            window.location.href=

            "pages/dashboard/dashboard.html";

        }

    }catch(error){

        console.log(error);

    }

}

checkLogin();

// ==========================================
// PREVENT IMAGE DRAG
// ==========================================

document.querySelectorAll("img").forEach(img=>{

    img.draggable=false;

});

// ==========================================
// DISABLE RIGHT CLICK ON IMAGES
// ==========================================

document.addEventListener("contextmenu",(e)=>{

    if(e.target.tagName==="IMG"){

        e.preventDefault();

    }

});

// ==========================================
// PRELOAD ONBOARDING IMAGES
// ==========================================

const preloadImages=[

    "assets/onboarding/shop1.png",

    "assets/onboarding/shop2.png",

    "assets/onboarding/shop3.png",

    "assets/onboarding/shop4.png"

];

preloadImages.forEach(src=>{

    const image=new Image();

    image.src=src;

});

// ==========================================
// READY
// ==========================================

console.log("✅ Don Martial Shopping Mart Onboarding Ready");
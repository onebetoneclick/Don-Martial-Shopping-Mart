// ==========================================
// DON MARTIAL SHOPPING MART
// CONFIG
// ==========================================

window.APP_CONFIG = {

    // ======================================
    // APP INFORMATION
    // ======================================

    APP_NAME: "Don Martial Shopping Mart",

    VERSION: "1.0.0",

    DEFAULT_THEME: "blue",

    CURRENCY: "NGN",

    COUNTRY: "Nigeria",

    // ======================================
    // SUPABASE
    // ======================================

    SUPABASE_URL: "https://arvvpdmjzkzwitnecpup.supabase.co",

    SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFydnZwZG1qemt6d2l0bmVjcHVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzNjExODMsImV4cCI6MjA5OTkzNzE4M30.htGbuzKv06X3RYMbzegaXcc448p4obDB88y-6oUyUT4",

    // ======================================
    // STORAGE BUCKETS
    // ======================================

    STORAGE: {

        AVATARS: "avatars",

        PRODUCTS: "products",

        BANNERS: "banners"

    },

    // ======================================
    // CUSTOMER
    // ======================================

    CUSTOMER_PREFIX: "DM",

    DEFAULT_WALLET: 0,

    DEFAULT_ROLE: "Customer",

    DEFAULT_STATUS: "Active"

};

console.log("✅ config.js loaded");
console.log(window.APP_CONFIG);

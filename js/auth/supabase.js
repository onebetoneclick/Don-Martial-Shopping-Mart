// ==========================================
// DON MARTIAL SHOPPING MART
// SUPABASE
// ==========================================

if(typeof window.supabase==="undefined"){

    throw new Error(

        "Supabase CDN not loaded."

    );

}

// ==========================================
// CONFIG
// ==========================================

const SUPABASE_URL =
window.APP_CONFIG.SUPABASE_URL;

const SUPABASE_ANON_KEY =
window.APP_CONFIG.SUPABASE_ANON_KEY;

// ==========================================
// CLIENT
// ==========================================

window.supabaseClient =
window.supabase.createClient(

    SUPABASE_URL,

    SUPABASE_ANON_KEY,

    {

        auth:{

            persistSession:true,

            autoRefreshToken:true,

            detectSessionInUrl:true

        }

    }

);

console.log("================================");

console.log("Supabase Connected");

console.log(window.supabaseClient);

console.log("================================");

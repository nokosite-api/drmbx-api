const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const BASE_URL = "https://www.dramaboxdb.com";
let CACHED_BUILD_ID = null;

const HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
};

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
let supabase = null;
if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
}

async function fetchBuildId() {
    if (CACHED_BUILD_ID) return CACHED_BUILD_ID;

    console.log("[*] Fetching Build ID...");
    console.time("BuildID-Fetch");
    try {
        const response = await axios.get(BASE_URL, {
            headers: HEADERS,
            timeout: 10000
        });
        console.timeEnd("BuildID-Fetch");
        const html = response.data;
        const match = html.match(/"buildId":"([^"]+)"/);

        if (match && match[1]) {
            CACHED_BUILD_ID = match[1];
            return CACHED_BUILD_ID;
        }
    } catch (error) {
        console.timeEnd("BuildID-Fetch");
        console.error("[!] Error fetching Build ID:", error.message);
    }
    return null;
}

async function checkAuthorization(req) {
    const userKey = req.headers['x-api-key'];
    if (!userKey) return { valid: false, error: "Missing x-api-key header" };

    if (process.env.API_SECRET && userKey === process.env.API_SECRET) {
        return { valid: true, owner: "Master Key (Env)" };
    }

    if (!supabase) {
        return { valid: false, error: "Server Configuration Error" };
    }

    const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('key', userKey)
        .eq('is_active', true)
        .single();

    if (error || !data) {
        return { valid: false, error: "Invalid or inactive API Key" };
    }

    return { valid: true, owner: data.owner };
}

module.exports = {
    fetchBuildId,
    checkAuthorization,
    BASE_URL,
    HEADERS
};

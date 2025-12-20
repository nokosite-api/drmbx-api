const axios = require('axios');
const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Referer': 'https://www.goodshort.com/'
};

const BASE_URL = "https://www.goodshort.com";

// Extract window.__INITIAL_STATE__ from HTML
function extractState(html) {
    try {
        const match = html.match(/window\.__INITIAL_STATE__\s*=\s*({.+?});/);
        if (match && match[1]) {
            return JSON.parse(match[1]);
        }
    } catch (e) {
        console.error("Error parsing Goodshort state:", e);
    }
    return null;
}

async function getGoodshortHome(lang = 'en') {
    try {
        const url = lang === 'id' ? `${BASE_URL}/id` : BASE_URL;
        const { data } = await axios.get(url, { headers });
        const state = extractState(data);
        // Map to Dramabox structure if possible, or return raw state section
        // Home usually corresponds to 'HomeModule' or 'Browse'
        return state?.HomeModule || state?.Browse || {};
    } catch (error) {
        console.error("Goodshort Home Error:", error.message);
        throw error;
    }
}

async function searchGoodshort(query, lang = 'en') {
    try {
        const baseUrl = lang === 'id' ? `${BASE_URL}/id` : BASE_URL;
        const url = `${baseUrl}/search?q=${encodeURIComponent(query)}`;
        const { data } = await axios.get(url, { headers });
        const state = extractState(data);
        return state?.SearchModule?.searchResult || {};
    } catch (error) {
        console.error("Goodshort Search Error:", error.message);
        throw error;
    }
}

// For movie details, we might need the full URL or at least the slug. 
// If we only have ID, we might need a workaround. 
// For now, let's assume the client passes the full path or we try to construct it.
// Based on the user's URL: https://www.goodshort.com/episodes/divorced-mom-beats-them-all-31001200334
// It seems to be /episodes/{slug}-{id}
async function getGoodshortMovie(pathOrId, lang = 'en') {
    try {
        let url = pathOrId;
        const baseUrl = lang === 'id' ? `${BASE_URL}/id` : BASE_URL;

        if (!pathOrId.startsWith('http')) {
            if (pathOrId.startsWith('/')) {
                // Check if path already starts with /id
                if (lang === 'id' && !pathOrId.startsWith('/id')) {
                    url = `${BASE_URL}/id${pathOrId}`;
                } else {
                    url = `${BASE_URL}${pathOrId}`;
                }
            } else if (pathOrId.startsWith('episodes/')) {
                url = `${baseUrl}/${pathOrId}`;
            } else {
                url = `${baseUrl}/episodes/${pathOrId}`;
            }
        }

        const { data } = await axios.get(url, { headers });
        const state = extractState(data);

        // Return relevant movie data
        // Based on analysis, it seems to be in 'BookInfoModule'
        return state?.BookInfoModule || {};
    } catch (error) {
        console.error("Goodshort Movie Error:", error.message);
        throw error;
    }
}

module.exports = {
    getGoodshortHome,
    searchGoodshort,
    getGoodshortMovie,
    extractState
};

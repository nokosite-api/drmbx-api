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
        // Use Cookie for language selection instead of URL path
        const reqHeaders = { ...headers };
        if (lang === 'id') {
            reqHeaders['Cookie'] = 'currentLanguage=id';
        }

        const { data } = await axios.get(BASE_URL, { headers: reqHeaders });
        const state = extractState(data);
        return state?.HomeModule || state?.Browse || {};
    } catch (error) {
        console.error("Goodshort Home Error:", error.message);
        throw error;
    }
}

async function searchGoodshort(query, lang = 'en') {
    try {
        const reqHeaders = { ...headers };
        if (lang === 'id') {
            reqHeaders['Cookie'] = 'currentLanguage=id';
        }

        const url = `${BASE_URL}/search?q=${encodeURIComponent(query)}`;
        const { data } = await axios.get(url, { headers: reqHeaders });
        const state = extractState(data);
        return state?.SearchModule?.searchResult || {};
    } catch (error) {
        console.error("Goodshort Search Error:", error.message);
        throw error;
    }
}

async function getGoodshortMovie(pathOrId, lang = 'en') {
    try {
        let url = pathOrId;
        const reqHeaders = { ...headers };
        if (lang === 'id') {
            reqHeaders['Cookie'] = 'currentLanguage=id';
        }

        if (!pathOrId.startsWith('http')) {
            if (pathOrId.startsWith('/')) {
                url = `${BASE_URL}${pathOrId}`;
            } else if (pathOrId.startsWith('episodes/')) {
                url = `${BASE_URL}/${pathOrId}`;
            } else {
                url = `${BASE_URL}/episodes/${pathOrId}`;
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

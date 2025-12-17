const axios = require('axios');
const { fetchBuildId, checkAuthorization, BASE_URL, HEADERS } = require('../../lib/dramabox');

export default async function handler(req, res) {
    // 1. Auth Check
    const auth = await checkAuthorization(req);
    if (!auth.valid) {
        return res.status(401).json({ error: "Unauthorized", message: auth.error });
    }

    // 2. Build ID
    const buildId = await fetchBuildId();
    if (!buildId) return res.status(500).json({ error: "Failed to retrieve Build ID" });

    const { q, lang = 'en' } = req.query;
    if (!q) return res.status(400).json({ error: "Missing 'q' parameter" });

    try {
        const targetUrl = `${BASE_URL}/_next/data/${buildId}/${lang}/search.json`;
        const apiRes = await axios.get(targetUrl, {
            headers: HEADERS,
            params: { searchValue: q },
            timeout: 15000
        });

        const bookList = apiRes.data.pageProps?.bookList || [];
        return res.status(200).json({
            status: "success",
            lang,
            count: bookList.length,
            results: bookList
        });
    } catch (error) {
        return res.status(500).json({ error: "Upstream Error", details: error.message });
    }
}

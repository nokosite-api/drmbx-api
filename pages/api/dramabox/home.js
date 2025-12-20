const axios = require('axios');
const { fetchBuildId, checkAuthorization, BASE_URL, HEADERS } = require('../../../lib/dramabox');

export default async function handler(req, res) {
    // 1. Auth Check
    const auth = await checkAuthorization(req);
    if (!auth.valid) {
        return res.status(401).json({ error: "Unauthorized", message: auth.error });
    }

    const { checkScope } = require('../../../lib/dramabox');
    if (!checkScope(auth, 'dramabox')) {
        return res.status(403).json({ error: "Forbidden", message: "Key does not have 'dramabox' permission" });
    }

    // 2. Build ID
    const buildId = await fetchBuildId();
    if (!buildId) return res.status(500).json({ error: "Failed to retrieve Build ID" });

    const { lang = 'en' } = req.query;
    let path = `${lang}.json`;
    if (lang === 'en') path = 'index.json';
    if (lang === 'id') path = 'in.json'; // Map 'id' to 'in' (Indonesian)

    try {
        const targetUrl = `${BASE_URL}/_next/data/${buildId}/${path}`;
        const apiRes = await axios.get(targetUrl, { headers: HEADERS, timeout: 10000 });

        return res.status(200).json({
            status: "success",
            lang,
            data: apiRes.data.pageProps || {}
        });
    } catch (error) {
        return res.status(500).json({ error: "Upstream Error", details: error.message });
    }
}

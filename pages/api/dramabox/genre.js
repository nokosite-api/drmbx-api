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

    // 2. Validate Inputs
    const { id, lang = 'en' } = req.query;
    if (!id) {
        return res.status(400).json({ error: "Missing required parameter: id" });
    }

    // 3. Build ID
    const buildId = await fetchBuildId();
    if (!buildId) return res.status(500).json({ error: "Failed to retrieve Build ID" });

    // 4. Construct URL
    // Pattern: /_next/data/{buildId}/{lang}/genres/{id}.json
    try {
        const targetUrl = `${BASE_URL}/_next/data/${buildId}/${lang}/genres/${id}.json`;
        const apiRes = await axios.get(targetUrl, { headers: HEADERS, timeout: 10000 });

        return res.status(200).json({
            status: "success",
            data: apiRes.data.pageProps || {}
        });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: "Genre not found", details: "Invalid Genre ID" });
        }
        return res.status(500).json({ error: "Upstream Error", details: error.message });
    }
}

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
    const { id, slug, lang = 'en' } = req.query;
    if (!id) {
        return res.status(400).json({ error: "Missing required parameter: id" });
    }

    // 3. Build ID
    const buildId = await fetchBuildId();
    if (!buildId) return res.status(500).json({ error: "Failed to retrieve Build ID" });

    // 4. Construct URL
    // Pattern: /_next/data/{buildId}/{lang}/movie/{id}/{slug}.json
    // If slug is missing, we might try to guess or use a default, 
    // but usually the API needs the exact slug or at least *some* slug. 
    // Based on research, the slug is part of the URL structure.
    // If the user doesn't provide a slug, we might need to handle it or error out. 
    // For now, let's assume if slug is missing, we try without it or use a placeholder if the server accepts it, 
    // or just fail. Tests showed the URL *includes* the slug.

    // However, usually Next.js data files NEED the full path. 
    // Let's default to a placeholder if missing, though it might 404.
    const urlSlug = slug || 'unknown';

    try {
        const targetUrl = `${BASE_URL}/_next/data/${buildId}/${lang}/movie/${id}/${urlSlug}.json`;
        const apiRes = await axios.get(targetUrl, { headers: HEADERS, timeout: 10000 });

        return res.status(200).json({
            status: "success",
            data: apiRes.data.pageProps || {}
        });
    } catch (error) {
        // If 404, it might mean the slug was wrong or ID is invalid.
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: "Movie not found", details: "Check ID and Slug match" });
        }
        return res.status(500).json({ error: "Upstream Error", details: error.message });
    }
}

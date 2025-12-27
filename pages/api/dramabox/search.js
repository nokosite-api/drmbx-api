const axios = require('axios');
const { checkAuthorization } = require('../../../lib/dramabox');

const SANSEKAI_API = "https://dramabox.sansekai.my.id/api/dramabox";

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

    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Missing 'q' parameter" });

    try {
        // Use Sansekai API
        const targetUrl = `${SANSEKAI_API}/search`;
        const apiRes = await axios.get(targetUrl, {
            params: { query: q },
            timeout: 15000
        });

        // Sansekai returns array directly
        const items = apiRes.data || [];

        // Map to standard format
        const results = items.map(item => ({
            bookId: item.bookId || item.id,
            bookName: item.bookName || item.title,
            cover: item.cover,
            introduction: item.introduction
        }));

        return res.status(200).json({
            status: "success",
            count: results.length,
            results: results
        });
    } catch (error) {
        console.error("Sansekai Search Error:", error.message);
        return res.status(500).json({ error: "Upstream Error", details: error.message });
    }
}

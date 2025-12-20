const { searchGoodshort } = require('../../../lib/goodshort');
const { checkAuthorization } = require('../../../lib/dramabox');

export default async function handler(req, res) {
    const auth = await checkAuthorization(req);
    if (!auth.valid) {
        return res.status(401).json({ error: "Unauthorized", message: auth.error });
    }

    const { checkScope } = require('../../../lib/dramabox');
    if (!checkScope(auth, 'goodshort')) {
        return res.status(403).json({ error: "Forbidden", message: "Key does not have 'goodshort' permission" });
    }

    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Missing 'q' parameter" });
    const { lang } = req.query;

    try {
        const rawResult = await searchGoodshort(q, lang);

        return res.status(200).json({
            status: "success",
            source: "goodshort",
            data: rawResult
        });
    } catch (error) {
        return res.status(500).json({ error: "Scraping Error", details: error.message });
    }
}

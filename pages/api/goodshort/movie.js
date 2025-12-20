const { getGoodshortMovie } = require('../../../lib/goodshort');
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

    const { id, path } = req.query;
    const identifier = path || id;

    if (!identifier) {
        return res.status(400).json({ error: "Missing 'id' or 'path' parameter" });
    }

    try {
        const rawData = await getGoodshortMovie(identifier);

        // Normalize for frontend compatibility (Dramabox uses chapterList, Goodshort uses chapterVoList)
        const normalizedData = {
            ...rawData,
            chapterList: rawData.chapterVoList || [],
            // Ensure book object exists
            book: rawData.book || {}
        };

        return res.status(200).json({
            status: "success",
            source: "goodshort",
            data: normalizedData
        });
    } catch (error) {
        return res.status(500).json({ error: "Scraping Error", details: error.message });
    }
}

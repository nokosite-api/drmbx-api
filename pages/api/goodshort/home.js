const { getGoodshortHome } = require('../../../lib/goodshort');
const { checkAuthorization } = require('../../../lib/dramabox');

export default async function handler(req, res) {
    // 1. Auth Check
    const auth = await checkAuthorization(req);
    if (!auth.valid) {
        return res.status(401).json({ error: "Unauthorized", message: auth.error });
    }

    try {
        const rawData = await getGoodshortHome();

        // Normalization attempt (optional, based on finding similar structures)
        // Goodshort usually has 'bookList' or similar in HomeModule

        return res.status(200).json({
            status: "success",
            source: "goodshort",
            data: rawData
        });
    } catch (error) {
        return res.status(500).json({ error: "Scraping Error", details: error.message });
    }
}

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

    // 2. Validate Inputs
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ error: "Missing required parameter: id" });
    }

    try {
        // Use Sansekai API
        const targetUrl = `${SANSEKAI_API}/allepisode`;
        const apiRes = await axios.get(targetUrl, {
            params: { bookId: id },
            timeout: 15000
        });

        // Sansekai returns array of episodes
        const items = apiRes.data || [];

        // Map to structure compatible with Frontend 'api.ts'
        // Frontend expects: json.data.chapterList (array)
        // Each chapter needs: id, name, index, mp4

        const chapterList = items.map(ep => {
            const videoUrl = extractVideoUrl(ep);
            return {
                id: ep.id,
                name: ep.title || ep.name,
                index: ep.appIndex || ep.index,
                // Crucial: Frontend uses this prop
                mp4: videoUrl || "",
                // Also provide modern props just in case
                cdnList: ep.cdnList
            };
        });

        return res.status(200).json({
            status: "success",
            // Wrap in pageProps structure for compatibility
            data: {
                chapterList: chapterList,
                bookInfo: {
                    bookId: id,
                    // We might not have bookName here unless we fetch details too, 
                    // but Frontend usually passes title from search.
                }
            }
        });

    } catch (error) {
        console.error("Sansekai Movie Error:", error.message);
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: "Movie not found", details: "ID not found upstream" });
        }
        return res.status(500).json({ error: "Upstream Error", details: error.message });
    }
}

function extractVideoUrl(ep) {
    if (!ep.cdnList || ep.cdnList.length === 0) return null;

    // Iterate over CDN providers
    for (const cdn of ep.cdnList) {
        if (cdn.videoPathList && cdn.videoPathList.length > 0) {
            // Sort by quality (descending) or pick default
            const sorted = cdn.videoPathList.sort((a, b) => b.quality - a.quality);
            return sorted[0].videoPath;
        }
    }
    return null;
}

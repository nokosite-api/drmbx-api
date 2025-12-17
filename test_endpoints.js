const { fetchBuildId, BASE_URL, HEADERS } = require('./lib/dramabox');
const axios = require('axios');

async function getDramaboxData(path, locale = 'en') {
    const buildId = await fetchBuildId();
    if (!buildId) throw new Error("Failed to fetch Build ID");

    // Construct URL: /_next/data/{buildId}/{locale}/{path}.json
    // Note: 'path' for movie is 'movie/id/slug', for genre 'genres/id'
    // Home was: /_next/data/{buildId}/{locale}/index.json
    // Search was: /_next/data/{buildId}/{locale}/search.json?q=...

    // Adjust path for locale if needed. Usually path comes after locale.
    const url = `${BASE_URL}/_next/data/${buildId}/${locale}/${path}.json`;
    console.log(`Requesting: ${url}`);

    const response = await axios.get(url, { headers: HEADERS });
    return response.data;
}

async function testEndpoints() {
    try {
        console.log("Fetching Build ID...");
        const buildId = await fetchBuildId();
        console.log("Build ID:", buildId);

        // Test Movie Detail
        const moviePath = `movie/42000000577/the-lost-heir-a-christmas-reckoning`;
        console.log(`\nTesting Movie Detail: ${moviePath}`);
        try {
            const movieData = await getDramaboxData(moviePath);
            if (movieData.pageProps) {
                // Log top-level keys
                console.log("PageProps Keys:", Object.keys(movieData.pageProps));

                // If there's a 'data' key, log its keys or a sample
                if (movieData.pageProps.data) {
                    console.log("Data Keys:", Object.keys(movieData.pageProps.data));
                    // Print a preview of the data to find relevant fields
                    console.log("Data Preview:", JSON.stringify(movieData.pageProps.data, null, 2).substring(0, 500));
                } else if (movieData.pageProps.detail) {
                    // Sometimes it might be called 'detail'
                    console.log("Detail Keys:", Object.keys(movieData.pageProps.detail));
                }
            }
        } catch (e) {
            console.error("Movie Data Failed:", e.message);
        }

        // Test Genre
        const genrePath = `genres/260`;
        console.log(`\nTesting Genre: ${genrePath}`);
        try {
            // Note: genres/260 might need language prefix in page path for Next.js
            // let's try standard path first logic in lib/data handles it? 
            // The lib/dramabox.js constructs URL as: /_next/data/${buildId}/${locale}/${path}.json
            // So if I pass 'genres/260' and locale 'en', it becomes /_next/data/.../en/genres/260.json
            const genreData = await getDramaboxData(genrePath);
            if (genreData.pageProps) {
                console.log("Genre PageProps Keys:", Object.keys(genreData.pageProps));
                // likely has 'data' or 'list'
                if (genreData.pageProps.data) {
                    console.log("Genre Data Keys:", Object.keys(genreData.pageProps.data));
                }
            }
        } catch (e) {
            console.error("Genre Data Failed:", e.message);
        }

    } catch (error) {
        console.error("Test failed:", error);
    }
}

testEndpoints();

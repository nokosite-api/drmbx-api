const axios = require('axios');

// Note: Ensure your local server is running on localhost:3000
const API_URL = "http://localhost:3000/api";
// Use the API SECRET from your .env or a valid key you generated
const API_KEY = "MK-D04F5F9750BCE8D27A6671E81F6041F9"; // Generated Key

async function testLocalEndpoints() {
    try {
        console.log("Testing Local API Endpoints...");

        // 1. Movie Detail
        // Params: id=42000000577, slug=the-lost-heir-a-christmas-reckoning
        console.log("\n[1] Testing /api/movie...");
        try {
            const res = await axios.get(`${API_URL}/movie`, {
                params: {
                    id: "42000000577",
                    slug: "the-lost-heir-a-christmas-reckoning"
                },
                headers: { 'x-api-key': API_KEY }
            });
            console.log("✅ Movie Success!");
            console.log("   Title:", res.data.data.data?.bookName || "Unknown");
            console.log("   Chapters:", res.data.data.chapterList?.length || 0);
        } catch (e) {
            console.error("❌ Movie Failed:", e.response?.data || e.message);
        }

        // 2. Genre
        // Params: id=260 (Revenge)
        console.log("\n[2] Testing /api/genre...");
        try {
            const res = await axios.get(`${API_URL}/genre`, {
                params: { id: "260" },
                headers: { 'x-api-key': API_KEY }
            });
            console.log("✅ Genre Success!");
            console.log("   Name:", res.data.data.data?.name || res.data.data.typeTwoName || "Unknown");
            console.log("   Movies:", res.data.data.bookList?.length || 0);
        } catch (e) {
            console.error("❌ Genre Failed:", e.response?.data || e.message);
        }


        // 3. Home Data
        console.log("\n[3] Testing /api/home...");
        try {
            const res = await axios.get(`${API_URL}/home`, {
                params: { lang: "en" },
                headers: { 'x-api-key': API_KEY }
            });
            console.log("✅ Home Success!");
            if (res.data.data && res.data.data.data) {
                // The structure is usually data.data.list or similar sections?
                // Let's print keys of data.data
                console.log("Home Data Keys:", Object.keys(res.data.data.data));
                // log first item if array
                // console.log("Sample:", JSON.stringify(res.data.data.data, null, 2).substring(0, 300));
            } else {
                console.log("Structure:", Object.keys(res.data.data || {}));
            }
        } catch (e) {
            console.error("❌ Home Failed:", e.message);
        }

    } catch (error) {
        console.error("Test Script Error:", error);
    }
}

testLocalEndpoints();

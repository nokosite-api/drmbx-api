const axios = require('axios');

// Note: Ensure your local server is running on localhost:3000
const API_URL = "http://localhost:3000/api";
// Use the API SECRET from your .env or a valid key you generated
const API_KEY = "123456"; // Default fall-back key from .env

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

    } catch (error) {
        console.error("Test Script Error:", error);
    }
}

testLocalEndpoints();

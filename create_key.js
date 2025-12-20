const axios = require('axios');

const crypto = require('crypto');

function generateKey() {
    return 'MK-' + crypto.randomBytes(16).toString('hex').toUpperCase();
}

async function createKey() {
    try {
        const newKey = generateKey();
        const res = await axios.post('http://localhost:3000/api/admin/keys',
            {
                owner: "Test Script",
                key: newKey,
                limit: 1000
            },
            {
                headers: {
                    'x-admin-password': 'HeisyaKanoko2007'
                }
            }
        );
        console.log("Key Created:", res.data);
    } catch (e) {
        console.error("Failed to create key:", e.response?.data || e.message);
    }
}

createKey();

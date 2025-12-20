import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminPassword = process.env.ADMIN_PASSWORD;

// Service Role Client (Bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
    // 1. Check Admin Password
    const password = req.headers['x-admin-password'];
    if (password !== adminPassword) {
        return res.status(401).json({ error: 'Invalid Admin Password' });
    }

    if (req.method === 'GET') {
        const { data, error } = await supabaseAdmin
            .from('api_keys')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("[Admin API Error] GET /keys failed:", error.message);
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json(data);
    }

    if (req.method === 'POST') {
        const { owner, key, permissions } = req.body;
        const { data, error } = await supabaseAdmin
            .from('api_keys')
            .insert([{
                owner,
                key,
                is_active: true,
                permissions: permissions || ['dramabox', 'goodshort'] // Default to all if missing
            }])
            .select();

        if (error) return res.status(500).json({ error: error.message });
        return res.status(201).json(data[0]);
    }

    if (req.method === 'DELETE') {
        const { id } = req.query;
        const { error } = await supabaseAdmin
            .from('api_keys')
            .delete()
            .eq('id', id);

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ message: 'Deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}

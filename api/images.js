import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get all images from database
        const { rows } = await sql`
      SELECT id, url, filename, uploaded_at
      FROM images
      ORDER BY uploaded_at DESC
    `;

        return res.status(200).json({
            success: true,
            images: rows,
        });
    } catch (error) {
        console.error('Fetch error:', error);

        // If table doesn't exist, return empty array
        if (error.message.includes('does not exist')) {
            return res.status(200).json({
                success: true,
                images: [],
                needsInit: true,
            });
        }

        return res.status(500).json({ error: 'Failed to fetch images', details: error.message });
    }
}

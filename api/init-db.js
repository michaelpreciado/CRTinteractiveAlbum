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

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Create images table
        await sql`
      CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        url TEXT NOT NULL,
        filename TEXT,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

        // Add some default images
        const defaultImages = [
            'https://picsum.photos/id/10/400/300',
            'https://picsum.photos/id/11/400/300',
            'https://picsum.photos/id/12/400/300',
            'https://picsum.photos/id/13/400/300',
            'https://picsum.photos/id/14/400/300',
        ];

        // Check if table is empty
        const { rows } = await sql`SELECT COUNT(*) as count FROM images`;

        if (parseInt(rows[0].count) === 0) {
            // Insert default images
            for (let i = 0; i < defaultImages.length; i++) {
                await sql`
          INSERT INTO images (url, filename, uploaded_at)
          VALUES (${defaultImages[i]}, ${`Sample Image ${i + 1}`}, NOW())
        `;
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Database initialized successfully',
        });
    } catch (error) {
        console.error('Init error:', error);
        return res.status(500).json({ error: 'Failed to initialize database', details: error.message });
    }
}

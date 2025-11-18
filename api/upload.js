import { put } from '@vercel/blob';
import { sql } from '@vercel/postgres';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

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
        const { image, filename } = req.body;

        if (!image) {
            return res.status(400).json({ error: 'No image provided' });
        }

        // Convert base64 to buffer
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // Upload to Vercel Blob
        const blob = await put(filename || `image-${Date.now()}.jpg`, buffer, {
            access: 'public',
            contentType: image.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg',
        });

        // Store reference in database
        await sql`
      INSERT INTO images (url, filename, uploaded_at)
      VALUES (${blob.url}, ${filename || 'Untitled'}, NOW())
    `;

        return res.status(200).json({
            success: true,
            url: blob.url,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ error: 'Failed to upload image', details: error.message });
    }
}

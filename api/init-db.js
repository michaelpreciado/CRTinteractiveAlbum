import { sql } from '@vercel/postgres'
import { handleCors } from './_cors.js'

const DEFAULT_IMAGES = [
    { url: 'https://picsum.photos/id/10/400/300', filename: 'Sample Image 1' },
    { url: 'https://picsum.photos/id/11/400/300', filename: 'Sample Image 2' },
    { url: 'https://picsum.photos/id/12/400/300', filename: 'Sample Image 3' },
    { url: 'https://picsum.photos/id/13/400/300', filename: 'Sample Image 4' },
    { url: 'https://picsum.photos/id/14/400/300', filename: 'Sample Image 5' },
]

export default async function handler(req, res) {
    if (handleCors(req, res)) return

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const secret = process.env.INIT_SECRET
    if (secret && req.headers['x-init-secret'] !== secret) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        await sql`
            CREATE TABLE IF NOT EXISTS images (
                id SERIAL PRIMARY KEY,
                url TEXT NOT NULL,
                filename TEXT,
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `

        const { rows } = await sql`SELECT COUNT(*) as count FROM images`

        if (parseInt(rows[0].count) === 0) {
            for (const img of DEFAULT_IMAGES) {
                await sql`
                    INSERT INTO images (url, filename, uploaded_at)
                    VALUES (${img.url}, ${img.filename}, NOW())
                `
            }
        }

        return res.status(200).json({ success: true, message: 'Database initialized' })
    } catch (error) {
        console.error('Init error:', error)
        return res.status(500).json({ error: 'Failed to initialize database' })
    }
}

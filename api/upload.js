import { put } from '@vercel/blob'
import { sql } from '@vercel/postgres'
import { handleCors } from './_cors.js'

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
}

const ALLOWED_MIME_TYPES = new Set([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/avif',
])

function validateBase64Image(base64String) {
    const match = base64String?.match(/^data:(image\/[\w+]+);base64,/)
    if (!match) return null
    const mimeType = match[1]
    return ALLOWED_MIME_TYPES.has(mimeType) ? mimeType : null
}

export default async function handler(req, res) {
    if (handleCors(req, res)) return

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
        const { image, filename } = req.body

        if (!image) {
            return res.status(400).json({ error: 'No image provided' })
        }

        const mimeType = validateBase64Image(image)
        if (!mimeType) {
            return res.status(400).json({ error: 'Invalid or unsupported image format' })
        }

        const base64Data = image.replace(/^data:image\/[\w+]+;base64,/, '')
        const buffer = Buffer.from(base64Data, 'base64')

        const safeFilename = filename
            ? filename.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100)
            : `image-${Date.now()}.jpg`

        const blob = await put(safeFilename, buffer, {
            access: 'public',
            contentType: mimeType,
        })

        await sql`
            INSERT INTO images (url, filename, uploaded_at)
            VALUES (${blob.url}, ${safeFilename}, NOW())
        `

        return res.status(200).json({ success: true, url: blob.url })
    } catch (error) {
        console.error('Upload error:', error)
        return res.status(500).json({ error: 'Failed to upload image' })
    }
}

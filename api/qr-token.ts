import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createCipheriv, createHash, randomBytes } from 'node:crypto'

const TOKEN_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-in-production'
const EXPIRY_SECONDS = 90 * 86400

function encryptToken(
  params: { saleDt: string; strCd: string; posNo: string; tranNo: string }
): string {
  const exp = Math.floor(Date.now() / 1000) + EXPIRY_SECONDS
  const plaintext = `${params.saleDt}:${params.strCd}:${params.posNo}:${params.tranNo}:${exp}`
  const key = createHash('sha256').update(TOKEN_SECRET).digest()
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return Buffer.concat([iv, encrypted, authTag]).toString('base64url')
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  const { saleDt, strCd, posNo, tranNo } = req.body as Record<string, string>

  if (!saleDt || !strCd || !posNo || !tranNo) {
    res.status(400).json({ error: '필수 파라미터 누락 (saleDt, strCd, posNo, tranNo)' })
    return
  }

  res.json({ token: encryptToken({ saleDt, strCd, posNo, tranNo }) })
}

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createDecipheriv, createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const TOKEN_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-in-production'

function decryptToken(token: string): { saleDt: string; strCd: string; posNo: string; tranNo: string } {
  const buf = Buffer.from(token, 'base64url')
  const iv = buf.subarray(0, 12)
  const authTag = buf.subarray(buf.length - 16)
  const ciphertext = buf.subarray(12, buf.length - 16)
  const key = createHash('sha256').update(TOKEN_SECRET).digest()
  const decipher = createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(authTag)
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8')
  const [saleDt, strCd, posNo, tranNo, exp] = plaintext.split(':')
  if (Math.floor(Date.now() / 1000) > Number(exp)) throw new Error('Token expired')
  return { saleDt, strCd, posNo, tranNo }
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  const { token } = req.query

  if (!token || typeof token !== 'string') {
    res.status(400).json({ error: '토큰이 필요합니다.' })
    return
  }

  try {
    decryptToken(token)

    // TODO: 실제 영수증 API 호출
    const data = JSON.parse(readFileSync(join(process.cwd(), 'sample/recv.json'), 'utf-8'))
    res.json(data)
  } catch {
    res.status(401).json({ error: '유효하지 않은 토큰입니다.' })
  }
}

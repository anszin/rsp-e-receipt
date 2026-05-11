import type { VercelRequest, VercelResponse } from '@vercel/node'
import { decryptToken } from '../lib/token'
import { readFileSync } from 'fs'
import { join } from 'path'

const TOKEN_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-in-production'

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
    // AES-256-GCM 복호화 → 위변조/만료 토큰 차단
    decryptToken(token, TOKEN_SECRET)

    // TODO: 실제 영수증 API 호출
    // const { saleDt, strCd, posNo, tranNo } = payload

    const data = JSON.parse(readFileSync(join(process.cwd(), 'sample/recv.json'), 'utf-8'))
    res.json(data)
  } catch {
    res.status(401).json({ error: '유효하지 않은 토큰입니다.' })
  }
}

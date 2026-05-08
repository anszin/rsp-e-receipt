import type { VercelRequest, VercelResponse } from '@vercel/node'
import jwt from 'jsonwebtoken'
import { readFileSync } from 'fs'
import { join } from 'path'

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-in-production'

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
    // JWT 검증 → 위변조된 토큰은 여기서 차단
    jwt.verify(token, JWT_SECRET)

    // TODO: 실제 영수증 API 호출
    // const { saleDt, strCd, posNo, tranNo } = payload
    // const data = await fetch(`${process.env.RECEIPT_API_URL}?saleDt=...`)

    const data = JSON.parse(readFileSync(join(process.cwd(), 'sample/recv.json'), 'utf-8'))
    res.json(data)
  } catch {
    res.status(401).json({ error: '유효하지 않은 토큰입니다.' })
  }
}

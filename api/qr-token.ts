import type { VercelRequest, VercelResponse } from '@vercel/node'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-in-production'

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

  const token = jwt.sign({ saleDt, strCd, posNo, tranNo }, JWT_SECRET, { expiresIn: '90d' })
  res.json({ token })
}

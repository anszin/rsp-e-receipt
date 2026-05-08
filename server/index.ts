import express from 'express'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import dotenv from 'dotenv'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = Number(process.env.PORT) || 3001
const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-in-production'

app.use(cors())
app.use(express.json())

// POS → 결제 완료 후 토큰 발급
app.post('/api/qr-token', (req, res) => {
  const { saleDt, strCd, posNo, tranNo } = req.body as Record<string, string>

  if (!saleDt || !strCd || !posNo || !tranNo) {
    res.status(400).json({ error: '필수 파라미터 누락 (saleDt, strCd, posNo, tranNo)' })
    return
  }

  const token = jwt.sign({ saleDt, strCd, posNo, tranNo }, JWT_SECRET, { expiresIn: '90d' })
  res.json({ token })
})

// 프론트 → 토큰 검증 후 영수증 조회
app.get('/api/receipt', (req, res) => {
  const { token } = req.query

  if (!token || typeof token !== 'string') {
    res.status(400).json({ error: '토큰이 필요합니다.' })
    return
  }

  try {
    // JWT 검증 → 4개 값 추출 (위변조 불가)
    jwt.verify(token, JWT_SECRET) as {
      saleDt: string; strCd: string; posNo: string; tranNo: string
    }

    // TODO: 실제 영수증 API 호출
    // const { saleDt, strCd, posNo, tranNo } = payload
    // const data = await fetch(`${process.env.RECEIPT_API_URL}?saleDt=${saleDt}&strCd=${strCd}&posNo=${posNo}&tranNo=${tranNo}`)

    // 현재: 샘플 데이터 반환
    const samplePath = join(__dirname, '../sample/recv.json')
    const data = JSON.parse(readFileSync(samplePath, 'utf-8'))
    res.json(data)
  } catch {
    res.status(401).json({ error: '유효하지 않은 토큰입니다.' })
  }
})

app.listen(PORT, () => {
  console.log(`API 서버: http://localhost:${PORT}`)
})

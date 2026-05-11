import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'

const EXPIRY_SECONDS = 90 * 86400

function deriveKey(secret: string): Buffer {
  return createHash('sha256').update(secret).digest()
}

export function encryptToken(
  params: { saleDt: string; strCd: string; posNo: string; tranNo: string },
  secret: string
): string {
  const exp = Math.floor(Date.now() / 1000) + EXPIRY_SECONDS
  const plaintext = `${params.saleDt}:${params.strCd}:${params.posNo}:${params.tranNo}:${exp}`
  const key = deriveKey(secret)
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return Buffer.concat([iv, encrypted, authTag]).toString('base64url')
}

export function decryptToken(
  token: string,
  secret: string
): { saleDt: string; strCd: string; posNo: string; tranNo: string } {
  const buf = Buffer.from(token, 'base64url')
  const iv = buf.subarray(0, 12)
  const authTag = buf.subarray(buf.length - 16)
  const ciphertext = buf.subarray(12, buf.length - 16)
  const key = deriveKey(secret)
  const decipher = createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(authTag)
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8')
  const [saleDt, strCd, posNo, tranNo, exp] = plaintext.split(':')
  if (Math.floor(Date.now() / 1000) > Number(exp)) throw new Error('Token expired')
  return { saleDt, strCd, posNo, tranNo }
}

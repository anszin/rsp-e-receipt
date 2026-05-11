import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'

const SAMPLE_PARAMS = {
  saleDt: '20260506',
  strCd:  '2302',
  posNo:  '0552',
  tranNo: '0093',
}

export default function QrPage() {
  const [qrUrl, setQrUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/qr-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(SAMPLE_PARAMS),
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<{ token: string }>
      })
      .then(({ token }) => {
        const base = window.location.origin + window.location.pathname
        setQrUrl(`${base}?token=${token}`)
      })
      .catch(() => setError('토큰 발급에 실패했습니다. 서버가 실행 중인지 확인하세요.'))
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-6 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 flex flex-col items-center gap-4">
        <p className="text-sm font-bold text-gray-500 tracking-widest">[ 샘플 QR 코드 ]</p>

        {error && (
          <p className="text-red-500 text-sm text-center max-w-xs">{error}</p>
        )}
        {!error && !qrUrl && (
          <p className="text-gray-400 text-sm">QR 생성 중...</p>
        )}
        {qrUrl && (
          <>
            <QRCodeSVG value={qrUrl} size={260} level="L" />
            <div className="text-[11px] text-gray-400 text-center break-all max-w-xs">
              {qrUrl}
            </div>
          </>
        )}
      </div>

      <div className="text-xs text-gray-400 text-center space-y-1">
        <p>이 QR을 스캔하면 샘플 영수증이 표시됩니다.</p>
        <p>같은 네트워크에 연결된 기기에서 스캔해야 합니다.</p>
      </div>
    </div>
  )
}

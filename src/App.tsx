import { useState, useEffect } from 'react'
import ReceiptView from './components/ReceiptView'
import ReceiptSkeleton from './components/ReceiptSkeleton'
import QrPage from './pages/QrPage'
import { parseEjLines } from './utils/parseEjData'
import type { ApiResponse, EjLine } from './types/receipt'

export default function App() {
  const token = new URLSearchParams(window.location.search).get('token')

  const [lines, setLines] = useState<EjLine[] | null>(null)
  const [loading, setLoading] = useState(!!token)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return

    fetch(`/api/receipt?token=${encodeURIComponent(token)}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<ApiResponse>
      })
      .then(data => setLines(parseEjLines(data.respBody.output.ejDataList)))
      .catch(() => setError('영수증을 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  if (!token) return <QrPage />

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {loading && <ReceiptSkeleton />}
      {error && (
        <div className="w-full max-w-sm mx-auto bg-white rounded shadow p-6 text-center text-red-500">
          {error}
        </div>
      )}
      {!loading && !error && lines && <ReceiptView lines={lines} />}
    </div>
  )
}

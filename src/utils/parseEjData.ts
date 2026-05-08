import type { EjDataEntry, EjLine, EjTag } from '../types/receipt'

const TAG_RE = /^\[([A-Z]{3})(\d)L\](.*)/s
const CUT_OFFSET = 3  // 프린터 헤드~커팅날 간격 (라인 수)

export function parseEjLines(ejDataList: EjDataEntry[]): EjLine[] {
  const all = ejDataList.map((entry): EjLine | null => {
    const m = entry.ejData.match(TAG_RE)
    if (!m) return null
    const [, type, variant, content] = m
    const tag = `${type}${variant}` as EjTag
    return { tag, bold: variant === '1', content: content.trimEnd() }
  }).filter((l): l is EjLine => l !== null)

  // 고객 영수증 구간: 첫 번째 NOR 라인 이후
  const firstNorIdx = all.findIndex(l => l.tag === 'NOR0' || l.tag === 'NOR1')
  if (firstNorIdx === -1) return all

  const customerSection = all.slice(firstNorIdx)

  // 제외: JNL0(간략 포맷 중복), BMP, STT, END
  const SKIP_TAGS: EjTag[] = ['JNL0', 'BMP0', 'STT0', 'END0']
  const filtered = customerSection.filter(l => !SKIP_TAGS.includes(l.tag))

  // CUT0L 위치를 찾아 3줄 앞에 CUT_MARKER 삽입 후 CUT0L 제거
  const cutIdx = filtered.findIndex(l => l.tag === 'CUT0')
  if (cutIdx === -1) return filtered

  const markerIdx = Math.max(0, cutIdx - CUT_OFFSET)
  const cutMarker: EjLine = { tag: 'CUT_MARKER', bold: false, content: '' }

  const result = [...filtered]
  result.splice(cutIdx, 1)           // CUT0L 제거
  result.splice(markerIdx, 0, cutMarker)  // 3줄 앞에 마커 삽입

  return result
}

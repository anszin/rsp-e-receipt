// ── API 응답 원본 타입 ──────────────────────────────────────
export interface ApiHeader {
  domain: string
  func: string
  saleDt: string
  strCd: string
  posNo: string
  tranNo: string
  seq: string
  respCd: string
  retryYn: string
  orgSeq: string
}

export interface EjDataEntry {
  ejData: string
}

export interface EjSignEntry {
  signSeqNo: string
  signData: string
}

export interface ApiOutput {
  saleDy: string
  strCd: string
  posNo: string
  tranNo: string
  ejSeqNo: number
  migDataFg: string
  ejDataList: EjDataEntry[]
  ejSignList: EjSignEntry[]
}

export interface ApiResponse {
  header: ApiHeader
  respBody: {
    status: { opType: string; appMode: string }
    output: ApiOutput
    result: {
      retCd: string
      retTm: string
      nextTrnsNo: string
      returnMsgList: { type: string; title: string; msg: string }[]
    }
  }
}

// ── 파싱된 EJ 라인 타입 ────────────────────────────────────
export type EjTag = 'NOR0' | 'NOR1' | 'JNL0' | 'JNL1' | 'BAR0' | 'STT0' | 'CUT0' | 'BMP0' | 'END0' | 'CUT_MARKER'

export interface EjLine {
  tag: EjTag
  bold: boolean
  content: string
}

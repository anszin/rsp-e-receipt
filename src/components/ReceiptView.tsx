import type { EjLine } from '../types/receipt'

interface Props {
  lines: EjLine[]
}

const FONT = "'GulimChe', 'Gulim', 'DotumChe', monospace"

function ReceiptPaper({ lines, title }: { lines: EjLine[]; title?: string }) {
  return (
    <div className="bg-white shadow-md w-full"
      style={{ fontFamily: FONT, fontSize: 13, lineHeight: 1.6 }}
    >
      {title && (
        <div className="px-4 pt-3 pb-2 flex items-center justify-center border-b border-dashed border-gray-200">
          <p className="text-sm font-bold tracking-widest text-gray-400">{title}</p>
        </div>
      )}
      <div className="py-3 flex justify-center overflow-x-auto">
        <div style={{ width: '40ch' }}>
          {lines.map((line, i) => {
            if (line.tag === 'BAR0') {
              return (
                <div key={i} className="my-2 flex flex-col items-center gap-1 w-full">
                  <div className="flex gap-px justify-center">
                    {line.content.split('').map((_, j) => (
                      <div key={j} className="bg-black"
                        style={{ width: j % 3 === 0 ? 2 : 1, height: 32 }} />
                    ))}
                  </div>
                  <span className="text-[10px] tracking-widest text-gray-600 text-center">{line.content}</span>
                </div>
              )
            }

            if (/^[-=*]{8,}$/.test(line.content.trim())) {
              return <div key={i} className="border-t border-dashed border-gray-400 my-1" />
            }

            if (line.content.trim() === '') {
              return <div key={i} className="h-1.5" />
            }

            return (
              <p key={i}
                className={`whitespace-pre overflow-hidden ${line.bold ? 'font-bold text-black' : 'text-gray-800'}`}
              >
                {line.content}
              </p>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function ReceiptView({ lines }: Props) {
  const cutIdx = lines.findIndex(l => l.tag === 'CUT_MARKER')

  const firstPart  = cutIdx === -1 ? lines : lines.slice(0, cutIdx)
  const secondPart = cutIdx === -1 ? []    : lines.slice(cutIdx + 1)

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col gap-2">
      <ReceiptPaper lines={firstPart} title="[ 샘플 영수증 ]" />

      {secondPart.length > 0 && (
        <>
          <ReceiptPaper lines={secondPart} />
        </>
      )}
    </div>
  )
}

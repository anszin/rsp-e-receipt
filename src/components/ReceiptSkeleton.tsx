function SkeletonLine({ width = 'w-full', height = 'h-4' }: { width?: string; height?: string }) {
  return <div className={`${width} ${height} bg-gray-200 rounded animate-pulse`} />
}

export default function ReceiptSkeleton() {
  return (
    <div className="w-full max-w-sm mx-auto bg-white font-mono text-sm shadow-md">
      {/* 헤더 */}
      <div className="px-5 pt-6 pb-4 flex flex-col items-center gap-2 border-b border-dashed border-gray-300">
        <SkeletonLine width="w-40" height="h-6" />
        <SkeletonLine width="w-24" height="h-4" />
        <SkeletonLine width="w-32" height="h-3" />
        <SkeletonLine width="w-48" height="h-3" />
        <SkeletonLine width="w-28" height="h-3" />
      </div>

      {/* 거래 정보 */}
      <div className="px-5 py-3 border-b border-dashed border-gray-300 flex flex-col gap-2">
        <div className="flex justify-between">
          <SkeletonLine width="w-16" height="h-3" />
          <SkeletonLine width="w-28" height="h-3" />
        </div>
        <div className="flex justify-between">
          <SkeletonLine width="w-16" height="h-3" />
          <SkeletonLine width="w-20" height="h-3" />
        </div>
        <div className="flex justify-between">
          <SkeletonLine width="w-16" height="h-3" />
          <SkeletonLine width="w-12" height="h-3" />
        </div>
      </div>

      {/* 상품 목록 헤더 */}
      <div className="px-5 py-2 border-b border-gray-300">
        <SkeletonLine width="w-full" height="h-3" />
      </div>

      {/* 상품 목록 */}
      <div className="px-5 py-3 border-b border-dashed border-gray-300 flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1">
            <SkeletonLine width="w-48" height="h-3" />
            <div className="flex justify-between pl-2">
              <SkeletonLine width="w-24" height="h-3" />
              <SkeletonLine width="w-16" height="h-3" />
            </div>
          </div>
        ))}
      </div>

      {/* 합계 */}
      <div className="px-5 py-3 border-b border-dashed border-gray-300 flex flex-col gap-2">
        {['w-32', 'w-28', 'w-24'].map((w, i) => (
          <div key={i} className="flex justify-between">
            <SkeletonLine width={w} height="h-3" />
            <SkeletonLine width="w-20" height="h-3" />
          </div>
        ))}
        <div className="flex justify-between mt-1">
          <SkeletonLine width="w-20" height="h-5" />
          <SkeletonLine width="w-24" height="h-5" />
        </div>
      </div>

      {/* 결제 정보 */}
      <div className="px-5 py-3 border-b border-dashed border-gray-300 flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <SkeletonLine width="w-20" height="h-3" />
            <SkeletonLine width="w-28" height="h-3" />
          </div>
        ))}
      </div>

      {/* 푸터 */}
      <div className="px-5 py-5 flex flex-col items-center gap-2">
        <SkeletonLine width="w-36" height="h-4" />
        <SkeletonLine width="w-48" height="h-3" />
      </div>
    </div>
  )
}

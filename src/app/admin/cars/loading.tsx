export default function Loading() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-2.5 w-12 animate-pulse rounded-full bg-[#EDE8E1] mb-2" />
          <div className="h-8 w-28 animate-pulse rounded-full bg-[#E8E4DE] mb-1.5" />
          <div className="h-3.5 w-40 animate-pulse rounded-full bg-[#EDE8E1]" />
        </div>
        <div className="h-9 w-24 animate-pulse rounded-lg bg-[#E8E4DE]" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E0DDD8] overflow-hidden">
        {/* Table header */}
        <div className="flex items-center gap-4 px-5 py-3 border-b border-[#EDEAE6] bg-[#F9F7F4]">
          {[14, 40, 16, 16, 14].map((w, i) => (
            <div key={i} className={`h-2.5 w-${w} animate-pulse rounded-full bg-[#DDD8D0]`} style={{ width: `${w * 4}px` }} />
          ))}
        </div>
        {/* Table rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-[#F0EDE9] last:border-0">
            <div className="h-12 w-18 animate-pulse rounded-xl bg-[#EDE8E1] shrink-0" style={{ width: 72 }} />
            <div className="flex-1 min-w-0">
              <div className="h-3.5 w-52 animate-pulse rounded-full bg-[#E8E4DE] mb-1.5" />
              <div className="h-3 w-28 animate-pulse rounded-full bg-[#EDE8E1]" />
            </div>
            <div className="h-5 w-18 animate-pulse rounded-full bg-[#EDE8E1]" style={{ width: 72 }} />
            <div className="h-3.5 w-20 animate-pulse rounded-full bg-[#EDE8E1]" />
            <div className="h-7 w-16 animate-pulse rounded-lg bg-[#EDE8E1]" />
          </div>
        ))}
      </div>
    </div>
  );
}

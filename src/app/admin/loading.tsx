export default function Loading() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-7 w-36 animate-pulse rounded-full bg-[#E8E4DE]" />
          <div className="h-3.5 w-52 animate-pulse rounded-full bg-[#EDE8E1] mt-2" />
        </div>
        <div className="h-9 w-24 animate-pulse rounded-lg bg-[#E8E4DE]" />
      </div>

      {/* Inventory stats — 4 cols */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#E0DDD8] px-5 py-4">
            <div className="h-2.5 w-16 animate-pulse rounded-full bg-[#EDE8E1] mb-3" />
            <div className="h-9 w-12 animate-pulse rounded-lg bg-[#E8E4DE]" />
          </div>
        ))}
      </div>

      {/* Analytics mini-stats — 3 cols */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#E0DDD8] px-5 py-4 flex items-center gap-4">
            <div className="w-10 h-10 animate-pulse rounded-xl bg-[#EDE8E1] shrink-0" />
            <div>
              <div className="h-2.5 w-20 animate-pulse rounded-full bg-[#EDE8E1] mb-2" />
              <div className="h-6 w-14 animate-pulse rounded-lg bg-[#E8E4DE]" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick links — 3 cols */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-4 bg-white rounded-xl border border-[#E0DDD8]">
            <div>
              <div className="h-3.5 w-28 animate-pulse rounded-full bg-[#E8E4DE] mb-1.5" />
              <div className="h-3 w-36 animate-pulse rounded-full bg-[#EDE8E1]" />
            </div>
            <div className="h-4 w-4 animate-pulse rounded bg-[#EDE8E1]" />
          </div>
        ))}
      </div>

      {/* Recent vehicles table */}
      <div className="bg-white rounded-xl border border-[#E0DDD8] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EDEAE6] flex items-center justify-between">
          <div className="h-3.5 w-32 animate-pulse rounded-full bg-[#E8E4DE]" />
          <div className="h-3 w-16 animate-pulse rounded-full bg-[#EDE8E1]" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-[#F0EDE9] last:border-0">
            <div className="h-10 w-14 animate-pulse rounded-lg bg-[#EDE8E1] shrink-0" />
            <div className="flex-1">
              <div className="h-3.5 w-48 animate-pulse rounded-full bg-[#E8E4DE] mb-1.5" />
              <div className="h-3 w-24 animate-pulse rounded-full bg-[#EDE8E1]" />
            </div>
            <div className="h-5 w-16 animate-pulse rounded-full bg-[#EDE8E1]" />
            <div className="h-3.5 w-20 animate-pulse rounded-full bg-[#EDE8E1]" />
          </div>
        ))}
      </div>
    </div>
  );
}

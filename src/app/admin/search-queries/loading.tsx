export default function Loading() {
  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="h-2.5 w-12 animate-pulse rounded-full bg-[#EDE8E1] mb-2" />
        <div className="h-8 w-40 animate-pulse rounded-full bg-[#E8E4DE] mb-2" />
        <div className="h-3.5 w-80 animate-pulse rounded-full bg-[#EDE8E1]" />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-9 w-56 animate-pulse rounded-lg bg-[#E8E4DE]" />
        <div className="h-9 w-28 animate-pulse rounded-lg bg-[#E8E4DE]" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E0DDD8] overflow-hidden">
        <div className="flex items-center gap-4 px-5 py-3 border-b border-[#EDEAE6] bg-[#F9F7F4]">
          <div className="h-2.5 w-48 animate-pulse rounded-full bg-[#DDD8D0]" />
          <div className="h-2.5 w-16 animate-pulse rounded-full bg-[#DDD8D0]" />
          <div className="h-2.5 w-20 animate-pulse rounded-full bg-[#DDD8D0] ml-auto" />
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-[#F0EDE9] last:border-0">
            <div className="h-4 w-4 animate-pulse rounded bg-[#EDE8E1] shrink-0" />
            <div className="flex-1">
              <div className="h-3.5 w-40 animate-pulse rounded-full bg-[#E8E4DE]" />
            </div>
            <div className="h-4 w-12 animate-pulse rounded-full bg-[#EDE8E1]" />
            <div className="h-5 w-16 animate-pulse rounded-full bg-[#EDE8E1]" />
            <div className="flex gap-1.5 ml-auto">
              <div className="h-7 w-7 animate-pulse rounded-lg bg-[#EDE8E1]" />
              <div className="h-7 w-7 animate-pulse rounded-lg bg-[#EDE8E1]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

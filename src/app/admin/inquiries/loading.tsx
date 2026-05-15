export default function Loading() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="h-2.5 w-12 animate-pulse rounded-full bg-[#EDE8E1] mb-2" />
        <div className="h-8 w-32 animate-pulse rounded-full bg-[#E8E4DE] mb-2" />
        <div className="h-3.5 w-64 animate-pulse rounded-full bg-[#EDE8E1]" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-[#E8E4DE]" />
        ))}
      </div>

      {/* Inquiry cards */}
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#E0DDD8] p-5 flex gap-4 items-start">
            <div className="h-12 w-16 animate-pulse rounded-xl bg-[#EDE8E1] shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 w-32 animate-pulse rounded-full bg-[#E8E4DE]" />
                <div className="h-5 w-16 animate-pulse rounded-full bg-[#EDE8E1]" />
              </div>
              <div className="h-3 w-48 animate-pulse rounded-full bg-[#EDE8E1] mb-1.5" />
              <div className="h-3 w-full animate-pulse rounded-full bg-[#F0EDE9] mb-1" />
              <div className="h-3 w-3/4 animate-pulse rounded-full bg-[#F0EDE9]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

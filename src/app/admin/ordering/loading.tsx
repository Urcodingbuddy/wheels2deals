export default function Loading() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="h-2.5 w-12 animate-pulse rounded-full bg-[#EDE8E1] mb-2" />
        <div className="h-8 w-36 animate-pulse rounded-full bg-[#E8E4DE] mb-2" />
        <div className="h-3.5 w-96 animate-pulse rounded-full bg-[#EDE8E1]" />
      </div>

      {/* Indexed section label */}
      <div className="h-3 w-28 animate-pulse rounded-full bg-[#EDE8E1] mb-3" />

      {/* Draggable rows */}
      <div className="space-y-2 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 bg-white rounded-xl border border-[#E0DDD8]">
            <div className="h-4 w-4 animate-pulse rounded bg-[#EDE8E1] shrink-0" />
            <div className="h-10 w-14 animate-pulse rounded-lg bg-[#EDE8E1] shrink-0" />
            <div className="flex-1">
              <div className="h-3.5 w-48 animate-pulse rounded-full bg-[#E8E4DE] mb-1.5" />
              <div className="h-3 w-24 animate-pulse rounded-full bg-[#EDE8E1]" />
            </div>
            <div className="flex gap-1">
              <div className="h-7 w-7 animate-pulse rounded-lg bg-[#EDE8E1]" />
              <div className="h-7 w-7 animate-pulse rounded-lg bg-[#EDE8E1]" />
            </div>
          </div>
        ))}
      </div>

      {/* Unindexed section label */}
      <div className="h-3 w-24 animate-pulse rounded-full bg-[#EDE8E1] mb-3" />

      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 bg-white rounded-xl border border-[#E0DDD8] opacity-60">
            <div className="h-4 w-4 animate-pulse rounded bg-[#EDE8E1] shrink-0" />
            <div className="h-10 w-14 animate-pulse rounded-lg bg-[#EDE8E1] shrink-0" />
            <div className="flex-1">
              <div className="h-3.5 w-40 animate-pulse rounded-full bg-[#E8E4DE] mb-1.5" />
              <div className="h-3 w-20 animate-pulse rounded-full bg-[#EDE8E1]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

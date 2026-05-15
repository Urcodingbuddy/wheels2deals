export default function Loading() {
  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="h-2.5 w-12 animate-pulse rounded-full bg-[#EDE8E1] mb-2" />
        <div className="h-8 w-36 animate-pulse rounded-full bg-[#E8E4DE] mb-2" />
        <div className="h-3.5 w-72 animate-pulse rounded-full bg-[#EDE8E1]" />
      </div>

      {/* Summary cards — 2 cols */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-[#E8E4DE] bg-white p-5">
            <div className="h-3 w-24 animate-pulse rounded-full bg-[#EDE8E1] mb-3" />
            <div className="h-10 w-20 animate-pulse rounded-lg bg-[#E8E4DE]" />
          </div>
        ))}
      </div>

      {/* Daily views chart */}
      <div className="rounded-2xl border border-[#E8E4DE] bg-white p-5 mb-6">
        <div className="h-3.5 w-32 animate-pulse rounded-full bg-[#E8E4DE] mb-6" />
        <div className="h-48 animate-pulse rounded-xl bg-[#F0EDE9]" />
      </div>

      {/* Bottom charts — 2 cols */}
      <div className="grid grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-[#E8E4DE] bg-white p-5">
            <div className="h-3.5 w-36 animate-pulse rounded-full bg-[#E8E4DE] mb-6" />
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((__, j) => (
                <div key={j} className="flex items-center gap-3">
                  <div className="h-3 w-32 animate-pulse rounded-full bg-[#EDE8E1] shrink-0" />
                  <div
                    className="h-5 animate-pulse rounded bg-[#E8E4DE]"
                    style={{ width: `${80 - j * 10}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

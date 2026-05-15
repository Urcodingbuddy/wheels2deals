export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FCFAF6]">

      {/* ── Desktop filter rail sidebar ── */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-[72px] h-[calc(100vh-72px)] w-[280px] bg-[#FBF8F2] border-r border-[#E5DDD0] z-30">
        {/* Rail header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EAE6DF]">
          <div className="h-5 w-16 animate-pulse rounded-full bg-[#E5DDD0]" />
        </div>
        {/* 10 filter section rows */}
        <nav className="flex-1 py-2 flex flex-col gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-2.5">
              <div className="h-[18px] w-[18px] animate-pulse rounded bg-[#EAE4DA] shrink-0" />
              <div
                className="h-4 animate-pulse rounded-full bg-[#E8E2D8]"
                style={{ width: `${48 + (i % 4) * 12}%` }}
              />
              <div className="h-3 w-3 animate-pulse rounded bg-[#EAE4DA] shrink-0 ml-auto" />
            </div>
          ))}
        </nav>
      </aside>

      {/* ── Main content area ── */}
      <main className="bg-[#FCFAF6] pb-12 lg:ml-[280px]">
        <div className="mx-auto w-full max-w-[1120px] px-6 py-6 lg:px-8 lg:py-8">

          {/* Mobile filter button */}
          <div className="mb-5 lg:hidden">
            <div className="h-10 w-24 animate-pulse rounded-full bg-[#E8E2D8]" />
          </div>

          {/* Car grid — 6 card skeletons */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="relative flex flex-col overflow-hidden rounded-lg border border-[#E5E0D8] bg-white shadow-sm"
              >
                {/* Image — exact aspect-video */}
                <div className="relative aspect-video animate-pulse bg-[#ECE5D9] shrink-0">
                  {/* Condition badge — absolute top-4 left-4 */}
                  <div className="absolute top-4 left-4 h-6 w-24 animate-pulse rounded-full bg-[#E0D9CE]" />
                </div>

                {/* Like button — absolute top-4 right-4 */}
                <div className="absolute top-4 right-4 h-10 w-10 animate-pulse rounded-full bg-[#E0D9CE] z-10" />

                {/* Card body */}
                <div className="flex flex-col flex-grow p-4 sm:p-5">
                  {/* Year · Brand */}
                  <div className="h-2.5 w-28 animate-pulse rounded-full bg-[#EDE8E1] mb-1.5" />
                  {/* Title */}
                  <div className="h-5 w-4/5 animate-pulse rounded-full bg-[#E8E2D8] mb-3" />

                  {/* 3-col stats grid with border-y */}
                  <div className="grid grid-cols-3 gap-1 py-2.5 border-y border-[#E8E4DE]/60 rounded-lg mb-3">
                    {Array.from({ length: 3 }).map((__, j) => (
                      <div
                        key={j}
                        className={`flex flex-col items-center px-1 gap-1 ${j < 2 ? "border-r border-[#E8E4DE]/40" : ""}`}
                      >
                        <div className="h-4 w-4 animate-pulse rounded bg-[#EDE8E1]" />
                        <div className="h-2.5 w-10 animate-pulse rounded-full bg-[#EDE8E1]" />
                      </div>
                    ))}
                  </div>

                  {/* Location + body type row */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="h-3 w-20 animate-pulse rounded-full bg-[#EDE8E1]" />
                    <div className="h-3 w-16 animate-pulse rounded-full bg-[#EDE8E1]" />
                  </div>

                  {/* Footer: "READY TO DRIVE" badge + "View Details" button */}
                  <div className="mt-auto flex justify-between items-center">
                    <div className="h-5 w-24 animate-pulse rounded bg-[#EDE8E1]" />
                    <div className="h-9 w-32 animate-pulse rounded-full bg-[#EDE8E1]" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}

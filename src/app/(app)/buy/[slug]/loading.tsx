export default function Loading() {
  return (
    <div className="bg-white min-h-screen">
      <div className="w-[90vw] mx-auto py-8 pb-24 lg:pb-8">
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-10 lg:items-start">

          {/* ── Gallery + title — order 1 mobile, col-1 desktop ── */}
          <div className="order-1 lg:order-none flex flex-col gap-4">
            {/* Main image — matches aspect-[2/1] rounded-2xl */}
            <div className="aspect-[2/1] animate-pulse rounded-2xl bg-[#ECE5D9]" />

            {/* Inline thumbnails — matches w-[70px] h-[50px] md:w-[88px] md:h-[64px] */}
            <div className="flex gap-2 md:gap-3 overflow-x-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[70px] h-[50px] md:w-[88px] md:h-[64px] animate-pulse rounded-lg md:rounded-xl bg-[#E8E1D5] shrink-0"
                />
              ))}
            </div>

            {/* Title + subtitle — sits below thumbnails */}
            <div>
              <div className="h-8 w-4/5 animate-pulse rounded-full bg-[#EFE8DD] mb-2" />
              <div className="h-4 w-2/5 animate-pulse rounded-full bg-[#ECE5D9]" />
            </div>
          </div>

          {/* ── Details panel — order 2 mobile, col-2 sticky spanning all rows ── */}
          <div className="order-2 lg:order-none lg:sticky lg:top-6 lg:col-start-2 lg:row-start-1 lg:row-span-3">

            {/* Featured badge */}
            <div className="flex items-center gap-2 mb-3">
              <div className="h-5 w-16 animate-pulse rounded-full bg-[#F0E8D5]" />
            </div>

            {/* Vehicle details box */}
            <div className="mb-6 rounded-xl border border-[#E8E4DE] overflow-hidden">
              {/* Box header */}
              <div className="px-4 py-3 bg-[#F6F5F1] border-b border-[#E8E4DE] flex items-center justify-between">
                <div className="h-3 w-28 animate-pulse rounded-full bg-[#DDD8D0]" />
                <div className="h-5 w-14 animate-pulse rounded-full bg-[#DDD8D0]" />
              </div>

              {/* 9 detail rows: Brand, Model, Year, Body Type, Fuel Type, Transmission, Odometer, Color, Location */}
              <div className="px-4 py-1">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3 border-b border-[#E8E4DE] last:border-0"
                  >
                    <div className="h-3 w-20 animate-pulse rounded-full bg-[#ECE5D9]" />
                    <div className="h-3 w-24 animate-pulse rounded-full bg-[#E8E1D5]" />
                  </div>
                ))}
              </div>
            </div>

            {/* Enquire button */}
            <div className="h-12 w-full animate-pulse rounded-xl bg-[#E8E4DE]" />
          </div>

          {/* ── Description — order 4 mobile, left col desktop ── */}
          <div className="order-4 lg:order-none p-4 bg-[#F6F5F1] rounded-xl border border-[#E8E4DE]">
            <div className="h-3 w-24 animate-pulse rounded-full bg-[#DDD8D0] mb-3" />
            {[null, null, null, "w-2/3"].map((w, i) => (
              <div
                key={i}
                className={`h-3 animate-pulse rounded-full bg-[#ECE5D9] mt-2 ${w ?? "w-full"}`}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

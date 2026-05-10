export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FCFAF6]">
      <div className="border-b border-[#E9E1D5] bg-[radial-gradient(circle_at_top_left,#EFF2E0_0%,#FCFAF6_45%,#F7F2E8_100%)]">
        <div className="mx-auto w-[92vw] max-w-[1440px] py-8">
          <div className="h-4 w-28 animate-pulse rounded-full bg-[#DFD8CA]" />
          <div className="mt-4 h-14 max-w-3xl animate-pulse rounded-[28px] bg-[#E8E1D5]" />
          <div className="mt-4 h-5 max-w-2xl animate-pulse rounded-full bg-[#EEE7DA]" />
        </div>
      </div>

      <div className="mx-auto grid w-[92vw] max-w-[1440px] grid-cols-1 gap-4 py-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[28px] border border-[#E8E1D5] bg-white p-4 shadow-[0_10px_30px_rgba(42,53,16,0.05)]"
          >
            <div className="aspect-[16/10] animate-pulse rounded-[22px] bg-[#ECE5D9]" />
            <div className="mt-4 h-3 w-24 animate-pulse rounded-full bg-[#E6DFD2]" />
            <div className="mt-3 h-7 w-3/4 animate-pulse rounded-full bg-[#EFE8DD]" />
            <div className="mt-4 flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((__, chipIndex) => (
                <div
                  key={chipIndex}
                  className="h-8 w-24 animate-pulse rounded-full bg-[#F2ECE1]"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

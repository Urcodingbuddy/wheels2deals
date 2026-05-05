import Link from "next/link";

const CARS = [
  {
    title: "BMW 3 Series",
    specs: "AWD · 2.0T Turbo · 8-Speed",
    href: "/buy?model=bmw-3-series",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Mercedes C-Class",
    specs: "RWD · 2.0T Turbo · 9-Speed",
    href: "/buy?model=mercedes-c-class",
    image:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Toyota Land Cruiser",
    specs: "4WD · 3.3L Twin-Turbo · 10-Speed",
    href: "/buy?model=land-cruiser",
    image:
      "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Nissan Patrol",
    specs: "4WD · 5.6L V8 · 7-Speed",
    href: "/buy?model=nissan-patrol",
    image:
      "https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Porsche Cayenne",
    specs: "AWD · 3.0T · 8-Speed Tiptronic",
    href: "/buy?model=porsche-cayenne",
    image:
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Range Rover Sport",
    specs: "AWD · 3.0L Inline-6 · 8-Speed",
    href: "/buy?model=range-rover-sport",
    image:
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1200&auto=format&fit=crop",
  },
];

const ROWS = [CARS.slice(0, 3), CARS.slice(3, 6)];

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

export function JourneySection() {
  return (
    <section
      id="how-it-works"
      className="py-20 px-10 bg-[var(--color-page-bg)]"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Header row */}
        <div className="reveal flex items-end justify-between mb-10 gap-6">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(28px,3.5vw,44px)] font-semibold text-[#2A3510] leading-[1.05] mb-2">
              Explore popular car models
            </h2>
            <p className="font-[family-name:var(--font-body)] text-[14px] text-[#888] font-normal">
              Handpicked models - trending across the UAE this week
            </p>
          </div>
          <Link
            href="/buy"
            className="flex-shrink-0 inline-flex items-center gap-2 rounded-full border border-[#2A3510] px-5 py-2.5 font-[family-name:var(--font-body)] text-[12px] font-semibold text-[#2A3510] no-underline transition-all duration-200 hover:bg-[#2A3510] hover:text-white whitespace-nowrap"
          >
            Explore All
            <ArrowIcon />
          </Link>
        </div>

        {/* 3 × 2 flex-expand grid */}
        <div className="flex flex-col gap-8">
          {ROWS.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className="journey-row h-60"
            >
              {row.map((car, colIdx) => {
                const delayClass = `reveal-delay-${rowIdx * 3 + colIdx + 1}`;
                return (
                  <Link
                    key={car.title}
                    href={car.href}
                    className={`journey-card reveal ${delayClass} relative rounded-[14px] overflow-hidden cursor-pointer no-underline block`}
                  >
                    {/* Photo */}
                    <img
                      src={car.image}
                      alt={car.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000000e0] via-[#00000040] to-transparent pointer-events-none" />

                    {/* Bottom content */}
                    <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-10 flex items-end justify-between">
                      <div>
                        <p className="font-[family-name:var(--font-display)] text-[clamp(18px,1.8vw,24px)] font-semibold text-white leading-tight tracking-[-0.02em] mb-1">
                          {car.title}
                        </p>
                        <p className="font-[family-name:var(--font-body)] text-[11px] font-medium text-white/55 tracking-[0.03em]">
                          {car.specs}
                        </p>
                      </div>
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/15 border border-white/25 text-white flex-shrink-0 transition-all duration-300 hover:bg-[#C9A84C] hover:border-[#C9A84C]">
                        <ArrowIcon />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

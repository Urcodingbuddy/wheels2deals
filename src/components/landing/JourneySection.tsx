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
      className="py-20 px-3.5 bg-[var(--color-page-bg)]"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Header row */}
        <div className="reveal flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="flex flex-col items-start text-left">
            <p className="mb-3 font-[family-name:var(--font-body)] text-[13px] font-bold uppercase tracking-[0.22em] text-[#C5A846]">
              Trending Models
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(28px,3.5vw,44px)] font-semibold text-[#2A3510] leading-[1.05] tracking-tight -ml-[3px]">
              Explore popular car models
            </h2>
            <p className="mt-2 font-[family-name:var(--font-body)] text-[17px] text-[#2A3510]/58">
              Handpicked models - trending across the UAE this week
            </p>
          </div>
          <Link
            href="/buy"
            className="flex-shrink-0 inline-flex items-center gap-2 rounded-full border border-[#2A3510] px-6 py-3 md:px-5 md:py-2.5 font-[family-name:var(--font-body)] text-[13px] md:text-[12px] font-semibold text-[#2A3510] no-underline transition-all duration-200 hover:bg-[#2A3510] hover:text-white whitespace-nowrap w-fit"
          >
            Explore All
            <ArrowIcon />
          </Link>
        </div>

        {/* 3 × 2 flex-expand grid (Desktop) / Horizontal Scroll (Mobile) */}
        <div className="flex flex-col gap-8">
          {/* Mobile View: Horizontal Scroll */}
          <div className="flex md:hidden overflow-x-auto overflow-y-hidden gap-4 pb-6 no-scrollbar -mx-3.5 px-3.5 snap-x snap-mandatory">
            {CARS.map((car, idx) => (
              <Link
                key={car.title}
                href={car.href}
                className="reveal flex-shrink-0 w-[280px] h-[400px] snap-center relative rounded-[20px] overflow-hidden cursor-pointer no-underline block"
              >
                <img
                  src={car.image}
                  alt={car.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000e0] via-[#00000040] to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-10">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <p className="flex-1 font-[family-name:var(--font-display)] text-[22px] font-semibold text-white leading-[1.1] tracking-[-0.02em]">
                      {car.title.replace("-", "\u2011")}
                    </p>
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/15 border border-white/25 text-white translate-y-1.5">
                      <ArrowIcon />
                    </span>
                  </div>
                  <p className="font-[family-name:var(--font-body)] text-[11px] font-medium text-white/55 tracking-[0.03em]">
                    {car.specs}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop View: 3-column Grid */}
          <div className="hidden md:grid w-full grid-cols-3 gap-8">
            {CARS.map((car, idx) => {
              const delayClass = `reveal-delay-${idx + 1}`;
              return (
                <Link
                  key={car.title}
                  href={car.href}
                  className={`reveal ${delayClass} relative aspect-[3/2] rounded-[20px] overflow-hidden cursor-pointer no-underline block group shadow-sm transition-all duration-500 hover:shadow-xl`}
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
                  <div className="absolute bottom-0 left-0 right-0 px-8 pb-8 pt-12 flex items-end justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-[family-name:var(--font-display)] text-[26px] font-semibold text-white leading-tight tracking-[-0.02em] mb-1 truncate">
                        {car.title.replace("-", "\u2011")}
                      </p>
                      <p className="font-[family-name:var(--font-body)] text-[12px] font-medium text-white/55 tracking-[0.03em]">
                        {car.specs}
                      </p>
                    </div>
                    <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/15 border border-white/25 text-white transition-all duration-300 group-hover:bg-[#2A3510] group-hover:border-[#2A3510] group-hover:scale-110">
                      <ArrowIcon />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

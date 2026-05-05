import Link from "next/link";

const CATEGORIES = [
  { label: "Economy Cars", count: 16, href: "/buy?type=economy", img: "/car_01.png" },
  { label: "Exotic Cars",  count: 8,  href: "/buy?type=exotic",  img: "/car_02.png" },
  { label: "Sport Cars",   count: 16, href: "/buy?type=sport",   img: "/car_03.png" },
  { label: "Luxury Cars",  count: 24, href: "/buy?type=luxury",  img: "/car_04.png" },
  { label: "SUVs",         count: 9,  href: "/buy?type=suv",     img: "/car_05.png" },
];

export function CategorySection() {
  return (
    <section className="py-20 px-10 bg-[var(--color-page-bg)]">
      <div className="max-w-[1440px] mx-auto">

        {/* Header */}
        <div className="reveal mb-12">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(28px,3.5vw,44px)] font-extrabold text-[#2A3510] leading-[1.05] mb-2">
            Selected top-rated cars
          </h2>
          <p className="font-[family-name:var(--font-body)] text-[14px] text-[#888] font-normal">
            Browse verified listings across every category in the UAE
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="reveal group flex flex-col rounded-[16px] border border-[#e8e8e8] bg-white overflow-hidden no-underline transition-all duration-300 hover:border-[#C9A84C] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
            >
              {/* Car image */}
              <div className="flex items-center justify-center h-[160px] px-4 pt-6 pb-2 overflow-hidden">
                <img
                  src={cat.img}
                  alt={cat.label}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Label + pill */}
              <div className="flex flex-col items-center gap-3 px-4 pb-6 pt-3">
                <span className="font-[family-name:var(--font-display)] text-[15px] font-bold text-[#2A3510] text-center leading-tight">
                  {cat.label}
                </span>
                <span className="inline-flex items-center justify-center rounded-full px-4 py-1.5 font-[family-name:var(--font-body)] text-[12px] font-semibold transition-all duration-200 bg-[#f2f2f2] text-[#666] group-hover:bg-[#2A3510] group-hover:text-white">
                  {cat.count} Cars
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

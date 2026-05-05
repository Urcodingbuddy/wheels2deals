import Image from "next/image";

type Brand = {
  name: string;
  logo: string;
};

const BRANDS: Brand[] = [
  { name: "Toyota", logo: "/brands/toyota.png" },
  { name: "BMW", logo: "/brands/bmw.png" },
  { name: "Mercedes", logo: "/brands/mercedes-benz.png" },
  { name: "Audi", logo: "/brands/audi.png" },
  { name: "Nissan", logo: "/brands/nissan.png" },
  { name: "Porsche", logo: "/brands/porsche.png" },
  { name: "Land Rover", logo: "/brands/land-rover.png" },
  { name: "Lexus", logo: "/brands/lexus.png" },
  { name: "Honda", logo: "/brands/honda.png" },
  { name: "Hyundai", logo: "/brands/hyundai.png" },
  { name: "Kia", logo: "/brands/kia.png" },
  { name: "Ford", logo: "/brands/ford.png" },
  { name: "Chevrolet", logo: "/brands/chevrolet.png" },
  { name: "Mitsubishi", logo: "/brands/mitsubishi.png" },
  { name: "Jeep", logo: "/brands/jeep.png" },
  { name: "Infiniti", logo: "/brands/infiniti.png" },
];

const FIRST_ROW = BRANDS.slice(0, 8);
const SECOND_ROW = BRANDS.slice(8);

function LogoCard({ brand }: { brand: Brand }) {
  return (
    <article className="brand-card flex h-[88px] w-[152px] shrink-0 items-center justify-center rounded-[18px] border border-[#2A3510]/10 bg-white/70 px-6 shadow-[0_14px_36px_rgba(42,53,16,0.08)] backdrop-blur-[10px]">
      <div className="relative h-[42px] w-[104px]">
        <Image
          src={brand.logo}
          alt={`${brand.name} logo`}
          fill
          sizes="104px"
          className="brand-card-image object-contain"
        />
      </div>
    </article>
  );
}

function MarqueeRow({
  brands,
  direction,
}: {
  brands: Brand[];
  direction: "left" | "right";
}) {
  const trackClass =
    direction === "left" ? "marquee-track-left" : "marquee-track-right";
  const repeats = 3;

  return (
    <div className="marquee-wrap w-full overflow-hidden">
      <div className={trackClass}>
        {Array.from({ length: repeats }).map((_, repeatIndex) => (
          <div
            key={`${direction}-repeat-${repeatIndex}`}
            className="marquee-content"
            aria-hidden={repeatIndex > 0}
          >
            {brands.map((brand) => (
              <LogoCard
                key={`${direction}-${repeatIndex}-${brand.name}`}
                brand={brand}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function BrandsSection() {
  return (
    <section className="overflow-hidden bg-[var(--color-page-bg)] py-20">
      <div className="mx-auto mb-12 max-w-[1440px] px-6 sm:px-10">
        <div className="reveal flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 font-[family-name:var(--font-body)] text-[11px] font-bold uppercase tracking-[0.22em] text-[#2A3510]/38">
              Trusted Makes
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(28px,3.5vw,44px)] font-extrabold leading-[1.05] text-[#2A3510]">
              Brands We Deal In
            </h2>
            <p className="mt-2 max-w-[520px] font-[family-name:var(--font-body)] text-[14px] text-[#2A3510]/58">
              Two continuous rows of the most in-demand brands across the UAE.
            </p>
          </div>
          <span className="font-[family-name:var(--font-body)] text-[12px] font-bold uppercase tracking-[0.18em] text-[#2A3510]/35">
            16 Brands
          </span>
        </div>
      </div>

      <div className="mb-4 h-px w-full bg-gradient-to-r from-transparent via-[#2A3510]/18 to-transparent" />
      <div className="space-y-4">
        <MarqueeRow brands={FIRST_ROW} direction="left" />
        <MarqueeRow brands={SECOND_ROW} direction="right" />
      </div>
      <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-[#2A3510]/18 to-transparent" />
    </section>
  );
}

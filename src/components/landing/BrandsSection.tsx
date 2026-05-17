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
    <div className="relative mx-4 sm:mx-8 h-[40px] w-[100px] sm:h-[64px] sm:w-[140px] shrink-0">
      <Image
        src={brand.logo}
        alt={`${brand.name} certified used cars on Wheels2Deals UAE`}
        fill
        sizes="(max-width: 640px) 100px, 140px"
        className="object-contain"
      />
    </div>
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
    <div className="marquee-wrap relative w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-4 sm:w-12 bg-[linear-gradient(to_right,var(--color-page-bg)_50%,transparent)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-4 sm:w-12 bg-[linear-gradient(to_left,var(--color-page-bg)_50%,transparent)]" />
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
    <section className="overflow-hidden bg-[var(--color-page-bg)] pt-20 pb-8 px-3.5">
      <div className="mx-auto mb-20 max-w-[1440px]">
        <div className="reveal flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col items-start text-left">
            <p className="mb-3 font-[family-name:var(--font-body)] text-[13px] font-bold uppercase tracking-[0.22em] text-[#C5A846]">
              Built on Trust
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(28px,3.5vw,44px)] font-semibold leading-[1.05] tracking-tight text-[#2A3510] -ml-[3px]">
              Every Leading Brand
            </h2>
            <p className="mt-2 font-[family-name:var(--font-body)] text-[17px] text-[#2A3510]/58">
              One Reliable Platform.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4 h-px w-full bg-gradient-to-r from-transparent via-[#2A3510]/18 to-transparent" />
      <div className="space-y-10">
        <MarqueeRow brands={FIRST_ROW} direction="left" />
        <MarqueeRow brands={SECOND_ROW} direction="right" />
      </div>
      <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-[#2A3510]/18 to-transparent" />
    </section>
  );
}

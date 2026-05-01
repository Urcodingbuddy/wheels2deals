import { ParallaxImage } from "@/components/ParallaxImage";

const CARS = [
  {
    title: "Escalade",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop",
    tag: "Luxury SUV",
    desc: "The ultimate expression of luxury and capability: 7 seats.",
  },
  {
    title: "718",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop",
    tag: "Model currently not available in your country",
    desc: "Precise mid-engine sports car: 2 doors, 2 seats.",
  },
  {
    title: "G-Class",
    image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1200&auto=format&fit=crop",
    tag: "Off-road Luxury",
    desc: "Iconic design meets uncompromised off-road capability.",
  },
  {
    title: "Phantom",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop",
    tag: "Ultra Luxury",
    desc: "The pinnacle of bespoke luxury and commanding presence.",
  },
  {
    title: "Urus",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1200&auto=format&fit=crop",
    tag: "Super SUV",
    desc: "Soul of a super sports car, functionality of an SUV.",
  },
  {
    title: "911 GT3",
    image: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1200&auto=format&fit=crop",
    tag: "Track Focused",
    desc: "Motorsport technology engineered for the road.",
  },
];

const ROWS = [CARS.slice(0, 2), CARS.slice(2, 4), CARS.slice(4, 6)];

export function JourneySection() {
  return (
    <section id="journey-section" className="py-30 px-10">
      <div className="max-w-[1440px] mx-auto">
        <h2 className="reveal text-left font-[family-name:var(--font-display)] text-[clamp(48px,5vw,64px)] font-extrabold uppercase text-white leading-[0.95] mb-30">
          Find the key to your next adventure.
        </h2>

        <div className="max-w-[1160px] mx-auto flex flex-col gap-6">
          {ROWS.map((row, rowIdx) => (
            <div key={rowIdx} className="journey-row">
              {row.map((car, colIdx) => {
                const idx = rowIdx * 2 + colIdx;
                return (
                  <div
                    key={car.title}
                    className={`journey-card reveal reveal-delay-${idx + 1} relative rounded-md overflow-hidden cursor-pointer`}
                  >
                    <ParallaxImage src={car.image} alt={car.title} />

                    <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-[#00000066] to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-[#000000d9] to-transparent pointer-events-none" />

                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
                      <div>
                        <div className="inline-block bg-white/25 backdrop-blur-[8px] px-2 py-1 rounded-[2px] mb-3">
                          <span className="font-[family-name:var(--font-body)] text-[10px] font-medium text-white">
                            {car.tag}
                          </span>
                        </div>
                        <p className="font-[family-name:var(--font-body)] text-[13px] font-normal text-white m-0">
                          {car.desc}
                        </p>
                      </div>
                      <svg
                        width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor"
                        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                        className="text-white/70 mb-[2px]"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

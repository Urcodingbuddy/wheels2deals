import { ParallaxImage } from "@/components/ParallaxImage";

export function BrandsSection() {
  return (
    <section id="brands-section" className="py-30 px-10">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              name: "Porsche.",
              image:
                "https://images.unsplash.com/photo-1744278187074-c43c4bf0fa22?q=80&w=2060&auto=format&fit=crop",
            },
            {
              name: "Ferrari.",
              image:
                "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=800&auto=format&fit=crop",
            },
            {
              name: "Lamborghini.",
              image:
                "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=800&auto=format&fit=crop",
            },
          ].map((car, i) => (
            <div key={car.name} className={`reveal reveal-delay-${i + 1} cursor-pointer group`}>
              <div className="relative aspect-[16/10] rounded-md overflow-hidden mb-4">
                <ParallaxImage src={car.image} alt={car.name} />
              </div>
              <div className="flex justify-between items-center px-1">
                <h3 className="font-[family-name:var(--font-display)] text-[22px] font-bold uppercase text-white">
                  {car.name}
                </h3>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white/50 transition-transform duration-[400ms] group-hover:translate-x-1 group-hover:text-white"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

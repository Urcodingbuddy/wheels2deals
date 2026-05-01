import Link from "next/link";

export function PavilionSection() {
  return (
    <section className="bg-[#000000] pt-[80px] px-10 pb-[120px]">
      <div className="max-w-[1440px] mx-auto">
        <h2 className="reveal font-[family-name:var(--font-display)] text-[clamp(48px,5vw,64px)] font-bold uppercase text-white mb-14 leading-none">
          THE WHEELS2DEALS PAVILION
        </h2>

        <div className="grid grid-cols-3 gap-6">
          {[
            {
              title: "Discover Wheels2Deals",
              image:
                "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop",
            },
            {
              title: "Our Heritage",
              image:
                "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800&auto=format&fit=crop",
            },
            {
              title: "Vehicle Services",
              image:
                "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?q=80&w=800&auto=format&fit=crop",
            },
          ].map((item, i) => (
            <div key={item.title} className={`reveal reveal-delay-${i + 1}`}>
              <div className="relative aspect-[16/10] rounded-md overflow-hidden mb-5 img-zoom-wrap cursor-pointer">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover img-zoom transition-transform duration-[700ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                />
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-[22px] font-bold uppercase text-white mb-2">
                {item.title}
              </h3>
              <Link
                href="#"
                className="inline-block font-[family-name:var(--font-body)] text-[10px] font-medium tracking-[0.1em] uppercase text-[#aaaaaa] border-b border-[#aaaaaa]/40 pb-0.5 transition-colors hover:text-white hover:border-white/60"
              >
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

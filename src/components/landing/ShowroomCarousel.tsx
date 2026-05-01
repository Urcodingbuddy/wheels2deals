"use client";

import { useState } from "react";

const CARS = [
  {
    make: "Porsche",
    model: "Taycan 4S",
    price: "AED 380,000",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=800&auto=format&fit=crop",
  },
  {
    make: "BMW",
    model: "M5 Competition",
    price: "AED 320,000",
    image: "https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?q=80&w=800&auto=format&fit=crop",
  },
  {
    make: "Mercedes",
    model: "AMG GT 63 S",
    price: "AED 740,000",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800&auto=format&fit=crop",
  },
  {
    make: "Lamborghini",
    model: "Urus S",
    price: "AED 1,200,000",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=800&auto=format&fit=crop",
  },
  {
    make: "Rolls-Royce",
    model: "Ghost",
    price: "AED 2,100,000",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format&fit=crop",
  },
  {
    make: "Ferrari",
    model: "SF90 Stradale",
    price: "AED 3,200,000",
    image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=800&auto=format&fit=crop",
  },
  {
    make: "Bentley",
    model: "Continental GT",
    price: "AED 1,650,000",
    image: "https://images.unsplash.com/photo-1580274455191-1c62238fa1c9?q=80&w=800&auto=format&fit=crop",
  },
  {
    make: "McLaren",
    model: "720S",
    price: "AED 1,400,000",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop",
  },
  {
    make: "Aston Martin",
    model: "DB12",
    price: "AED 1,100,000",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop",
  },
];

// Per-slot values indexed 0 (far-left) → 6 (far-right); slots ±3 are off-screen buffers
const SCALES    = [0.50, 0.62, 0.78, 1.00, 0.78, 0.62, 0.50];
const OPACITIES = [0.00, 0.40, 0.62, 1.00, 0.62, 0.40, 0.00];
const SLOT_GAP  = 268; // px between card centres

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export function ShowroomCarousel() {
  const [active, setActive] = useState(0);
  const total = CARS.length;

  function getPos(idx: number): number {
    let p = mod(idx - active, total);
    if (p > Math.floor(total / 2)) p -= total;
    return p;
  }

  const prev = () => setActive((a) => mod(a - 1, total));
  const next = () => setActive((a) => mod(a + 1, total));

  return (
    <div className="select-none">
      {/* Track */}
      <div className="relative h-[430px] overflow-hidden">
        {CARS.map((car, idx) => {
          const pos = getPos(idx);
          if (Math.abs(pos) > 3) return null;

          const si      = pos + 3;
          const scale   = SCALES[si];
          const opacity = OPACITIES[si];
          const xOffset = pos * SLOT_GAP;
          const zIndex  = 5 - Math.abs(pos);
          const isActive = pos === 0;

          return (
            <div
              key={car.model}
              onClick={() => !isActive && setActive(idx)}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "270px",
                transform: `translateX(calc(-50% + ${xOffset}px)) translateY(-50%) scale(${scale})`,
                opacity,
                zIndex,
                transition:
                  "transform 0.58s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.58s ease",
                cursor: isActive ? "default" : "pointer",
                pointerEvents: Math.abs(pos) >= 3 ? "none" : "auto",
              }}
            >
              {/* Card */}
              <div className="relative h-[390px] rounded-2xl overflow-hidden">
                <img
                  src={car.image}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-full object-cover"
                />

                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

                {/* Text overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="font-[family-name:var(--font-body)] text-[9.5px] font-semibold tracking-[0.22em] uppercase text-white/45 mb-1">
                    {car.make}
                  </p>
                  <h3 className="font-[family-name:var(--font-display)] text-[24px] font-extrabold uppercase text-white leading-none tracking-[-0.01em] mb-2">
                    {car.model}
                  </h3>
                  <p className="font-[family-name:var(--font-body)] text-[12px] font-medium text-white/60">
                    {car.price}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-5 mt-10">
        {/* Prev */}
        <button
          onClick={prev}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-transparent text-white/40 transition-all duration-200 hover:border-white/35 hover:text-white"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Dots */}
        <div className="flex items-center gap-[7px]">
          {CARS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="cursor-pointer rounded-full border-none bg-transparent p-0 transition-all duration-300"
              style={{
                width:           active === i ? "22px" : "6px",
                height:          "6px",
                backgroundColor: active === i ? "#ffffff" : "rgba(255,255,255,0.25)",
              }}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={next}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-transparent text-white/40 transition-all duration-200 hover:border-white/35 hover:text-white"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

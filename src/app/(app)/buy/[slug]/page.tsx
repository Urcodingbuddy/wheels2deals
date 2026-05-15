import { notFound } from "next/navigation";
import { createClient } from "@/lib/server";
import { getEmbedUrl } from "@/lib/video";
import EnquireButton from "./EnquireButton";
import ImageGallery from "./ImageGallery";
import { ViewTracker } from "../ViewTracker";
import type { Enums } from "@/types/database";

// ─── Label maps ───────────────────────────────────────────────────────────────

const FUEL_LABELS: Record<Enums<"fuel_type">, string> = {
  petrol: "Petrol", diesel: "Diesel", electric: "Electric",
  hybrid: "Hybrid", cng: "CNG", lpg: "LPG",
};
const TRANS_LABELS: Record<Enums<"transmission_type">, string> = {
  manual: "Manual", automatic: "Automatic", cvt: "CVT", amt: "AMT",
};
const TYPE_LABELS: Record<Enums<"car_type">, string> = {
  sedan: "Sedan", suv: "SUV", hatchback: "HatchBack", coupe: "Coupe",
  convertible: "Soft Top Convertible", hard_top_convertible: "Hard Top Convertible",
  wagon: "Wagon", van: "Van", truck: "Truck", motorcycle: "Motorcycle",
  crossover: "Cross Over", sports: "Sports Car", jeep: "Jeep", other: "Other",
};

function deriveCondition(km: number): "New" | "Certified" | "Used" {
  if (km === 0) return "New";
  if (km < 30000) return "Certified";
  return "Used";
}

const CONDITION_STYLE = {
  New:       "bg-emerald-500 text-white",
  Certified: "bg-sky-500 text-white",
  Used:      "bg-[#3A4A20] text-white",
};

// ─── Detail row ───────────────────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#E8E4DE] last:border-0">
      <span className="font-[family-name:var(--font-body)] text-[13px] text-[#666666]">{label}</span>
      <span className="font-[family-name:var(--font-body)] text-[13px] font-semibold text-[#2A3510]">{value}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: car } = await supabase
    .from("cars")
    .select("*")
    .eq("slug", slug)
    .eq("status", "available")
    .single();

  if (!car) notFound();

  const condition = deriveCondition(car.km_driven);
  const kmLabel = car.km_driven === 0 ? "Brand New" : `${car.km_driven.toLocaleString()} km`;

  return (
    <div className="bg-white min-h-screen">
      <ViewTracker slug={car.slug} />


      {/* ── Main layout ── */}
      <div className="w-[90vw] mx-auto py-8 pb-24 lg:pb-8">

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">

          {/* ── Left: Gallery ── */}
          <div>
            <ImageGallery images={car.images} title={car.title} />

            {/* Description */}
            {car.description && (
              <div className="mt-6 p-4 bg-[#F6F5F1] rounded-xl border border-[#E8E4DE]">
                <h3 className="font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[0.12em] uppercase text-[#3A4A20] mb-2">
                  About This Car
                </h3>
                <p className="font-[family-name:var(--font-body)] text-[13px] text-[#555555] leading-relaxed">
                  {car.description}
                </p>
              </div>
            )}

            {/* Video */}
            {car.video_url && (
              <div className="mt-6">
                <h3 className="font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-[0.15em] uppercase text-[#888888] mb-3">
                  Video
                </h3>
                <div className="aspect-video rounded-xl overflow-hidden bg-black">
                  <iframe
                    src={getEmbedUrl(car.video_url)}
                    className="w-full h-full"
                    allowFullScreen
                    title={`${car.title} video`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Details panel ── */}
          <div className="lg:sticky lg:top-6">

            {/* Featured badge (standalone, only if featured) */}
            {car.is_featured && (
              <div className="flex items-center gap-2 mb-3">
                <span className="font-[family-name:var(--font-body)] text-[9px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full bg-[#C9A84C] text-white">
                  Featured
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="font-[family-name:var(--font-display)] text-[clamp(20px,2.8vw,30px)] font-semibold uppercase tracking-[-0.02em] text-[#2A3510] leading-tight mb-1">
              {car.title}
            </h1>
            <p className="font-[family-name:var(--font-body)] text-[13px] text-[#888888] mb-6">
              {car.brand} &middot; {car.model} &middot; {car.year}
            </p>

            {/* Vehicle details */}
            <div className="mb-6 rounded-xl border border-[#E8E4DE] overflow-hidden">
              <div className="px-4 py-3 bg-[#F6F5F1] border-b border-[#E8E4DE] flex items-center justify-between">
                <h3 className="font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[0.12em] uppercase text-[#3A4A20]">
                  Vehicle Details
                </h3>
                <span className={`font-[family-name:var(--font-body)] text-[9px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full ${CONDITION_STYLE[condition]}`}>
                  {condition}
                </span>
              </div>
              <div className="px-4 py-1">
                <DetailRow label="Brand"        value={car.brand} />
                <DetailRow label="Model"        value={car.model} />
                <DetailRow label="Year"         value={String(car.year)} />
                <DetailRow label="Body Type"    value={TYPE_LABELS[car.type]} />
                <DetailRow label="Fuel Type"    value={FUEL_LABELS[car.fuel_type]} />
                <DetailRow label="Transmission" value={TRANS_LABELS[car.transmission]} />
                <DetailRow label="Odometer"     value={kmLabel} />
                {car.color        && <DetailRow label="Color"            value={car.color} />}
                {/* Removed Prev. Owners */}

                <DetailRow label="Location" value={car.location} />
              </div>
            </div>

            {/* CTA */}
            <EnquireButton carId={car.id} carTitle={car.title} />

          </div>
        </div>
      </div>
    </div>
  );
}

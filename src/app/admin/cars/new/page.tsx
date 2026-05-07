"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { ImageUploader } from "@/components/ui/ImageUploader";
import {
  createDraftCar,
  updateCarImages,
  publishCar,
  rollbackCarCreation,
} from "@/app/(admin)/actions/car";
import { carSchema, type CarFormValues } from "@/lib/validations/car";
import { Constants } from "@/types/database";
import type { UploadResult } from "@/lib/storage";

// ─── Constants ────────────────────────────────────────────────────────────────

const { car_type, fuel_type, transmission_type } = Constants.public.Enums;

const TYPE_LABELS: Record<string, string> = {
  sedan: "Sedan", suv: "SUV", hatchback: "Hatchback", coupe: "Coupe",
  convertible: "Convertible", wagon: "Wagon", van: "Van", truck: "Truck",
  motorcycle: "Motorcycle", other: "Other",
};
const FUEL_LABELS: Record<string, string> = {
  petrol: "Petrol", diesel: "Diesel", electric: "Electric",
  hybrid: "Hybrid", cng: "CNG", lpg: "LPG",
};
const TRANS_LABELS: Record<string, string> = {
  manual: "Manual", automatic: "Automatic", cvt: "CVT", amt: "AMT",
};

const CURRENT_YEAR = new Date().getFullYear();

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-[0.12em] uppercase text-[#888888]">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="font-[family-name:var(--font-body)] text-[11px] text-red-600">{error}</p>
      )}
    </div>
  );
}

const inputCls =
  "w-full px-3.5 py-2.5 rounded-lg border border-[#E0DDD8] bg-white font-[family-name:var(--font-body)] text-[13px] text-[#2A3510] placeholder:text-[#BBBBBB] focus:outline-none focus:ring-2 focus:ring-[#3A4A20]/25 focus:border-[#3A4A20] transition-all";

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputCls} />;
}

function Select({
  options,
  labelMap,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: readonly string[];
  labelMap: Record<string, string>;
}) {
  return (
    <select {...props} className={inputCls}>
      <option value="">Select…</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {labelMap[o] ?? o}
        </option>
      ))}
    </select>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: number }) {
  const steps = ["Details", "Images", "Publish"];
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = step > n;
        const active = step === n;
        return (
          <div key={label} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-[family-name:var(--font-body)] text-[11px] font-bold transition-all ${
                  done
                    ? "bg-[#3A4A20] text-white"
                    : active
                    ? "bg-[#3A4A20] text-white ring-4 ring-[#3A4A20]/20"
                    : "bg-[#E0DDD8] text-[#888888]"
                }`}
              >
                {done ? <Check size={12} /> : n}
              </div>
              <span
                className={`font-[family-name:var(--font-body)] text-[12px] font-medium ${
                  active ? "text-[#2A3510]" : "text-[#888888]"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-10 h-px mx-3 ${step > n ? "bg-[#3A4A20]" : "bg-[#E0DDD8]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type FormValues = Partial<CarFormValues> & {
  year?: number | string;
  price?: number | string;
  km_driven?: number | string;
  owners_count?: number | string;
};

export default function NewCarPage() {
  const router = useRouter();
  const imageHook = useImageUpload();

  // Step state
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1
  const [form, setForm] = useState<FormValues>({
    year: CURRENT_YEAR,
    km_driven: 0,
    owners_count: 1,
    type: "sedan",
    fuel_type: "petrol",
    transmission: "automatic",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step1Loading, setStep1Loading] = useState(false);

  // Step 2
  const [carId, setCarId] = useState<string | null>(null);
  const [step2Loading, setStep2Loading] = useState(false);
  const [step2Error, setStep2Error] = useState<string | null>(null);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [lastSucceeded, setLastSucceeded] = useState<UploadResult[]>([]);

  // Step 3
  const [step3Loading, setStep3Loading] = useState(false);
  const [step3Error, setStep3Error] = useState<string | null>(null);

  function set(key: keyof FormValues, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  }

  // ── Step 1 submit ──────────────────────────────────────────────────────────

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    setStep1Loading(true);
    setErrors({});

    const parsed = carSchema.safeParse({
      ...form,
      year: Number(form.year),
      price: Number(form.price),
      km_driven: Number(form.km_driven),
      owners_count: form.owners_count ? Number(form.owners_count) : undefined,
    });

    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      const flat2: Record<string, string> = {};
      for (const [k, v] of Object.entries(flat)) {
        if (v?.[0]) flat2[k] = v[0];
      }
      setErrors(flat2);
      setStep1Loading(false);
      return;
    }

    const result = await createDraftCar(parsed.data);
    if (!result.success) {
      if (result.fields) {
        const flat: Record<string, string> = {};
        for (const [k, v] of Object.entries(result.fields)) {
          if (v?.[0]) flat[k] = v[0];
        }
        setErrors(flat);
      } else {
        setErrors({ _: result.error });
      }
      setStep1Loading(false);
      return;
    }

    setCarId(result.data.carId);
    setStep(2);
    setStep1Loading(false);
  }

  // ── Step 2 submit ──────────────────────────────────────────────────────────

  async function handleStep2() {
    if (!carId) return;
    setStep2Loading(true);
    setStep2Error(null);

    const { succeeded, failed } = await imageHook.uploadAll(carId);
    setLastSucceeded(succeeded);

    if (succeeded.length < 3) {
      setStep2Error(
        failed.length > 0
          ? `${failed.length} image(s) failed to upload. ${succeeded.length < 3 ? "Need at least 3." : ""}`
          : "Upload at least 3 images."
      );
      setStep2Loading(false);
      return;
    }

    const urls = succeeded.map((r) => r.url);
    const saveResult = await updateCarImages(carId, urls);

    if (!saveResult.success) {
      setStep2Error(saveResult.error);
      setStep2Loading(false);
      return;
    }

    setUploadedUrls(urls);
    setStep(3);
    setStep2Loading(false);
  }

  // ── Step 3: publish ────────────────────────────────────────────────────────

  async function handlePublish() {
    if (!carId) return;
    setStep3Loading(true);
    setStep3Error(null);

    const result = await publishCar(carId);
    if (!result.success) {
      setStep3Error(result.error);
      setStep3Loading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  async function handleRollback() {
    if (!carId) { setStep(1); return; }
    await rollbackCarCreation(carId, lastSucceeded);
    setCarId(null);
    setUploadedUrls([]);
    setLastSucceeded([]);
    imageHook.reset();
    setStep(1);
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push("/admin")}
          className="p-1.5 rounded-lg text-[#888888] hover:text-[#2A3510] hover:bg-[#E0DDD8] transition-colors bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-[24px] font-semibold uppercase tracking-[-0.02em] text-[#2A3510] leading-none">
            Add New Car
          </h1>
        </div>
      </div>

      <StepIndicator step={step} />

      {/* ── Step 1: Details ──────────────────────────────────────────────── */}
      {step === 1 && (
        <form onSubmit={handleStep1} className="bg-white rounded-xl border border-[#E0DDD8] p-6 space-y-5">
          {errors._ && (
            <p className="text-[12px] text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg font-[family-name:var(--font-body)]">
              {errors._}
            </p>
          )}

          {/* Title */}
          <Field label="Listing Title" error={errors.title} required>
            <Input
              type="text"
              value={(form.title as string) ?? ""}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Toyota Land Cruiser VXR 2024"
            />
          </Field>

          {/* Brand + Model */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Brand" error={errors.brand} required>
              <Input
                type="text"
                value={(form.brand as string) ?? ""}
                onChange={(e) => set("brand", e.target.value)}
                placeholder="e.g. Toyota"
              />
            </Field>
            <Field label="Model" error={errors.model} required>
              <Input
                type="text"
                value={(form.model as string) ?? ""}
                onChange={(e) => set("model", e.target.value)}
                placeholder="e.g. Land Cruiser"
              />
            </Field>
          </div>

          {/* Year + Price */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Year" error={errors.year} required>
              <Input
                type="number"
                value={form.year ?? ""}
                onChange={(e) => set("year", e.target.value)}
                min={1900}
                max={CURRENT_YEAR + 1}
              />
            </Field>
            <Field label="Price (AED)" error={errors.price} required>
              <Input
                type="number"
                value={form.price ?? ""}
                onChange={(e) => set("price", e.target.value)}
                min={0}
                placeholder="e.g. 250000"
              />
            </Field>
          </div>

          {/* Type + Transmission */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Body Type" error={errors.type} required>
              <Select
                value={(form.type as string) ?? ""}
                onChange={(e) => set("type", e.target.value)}
                options={car_type}
                labelMap={TYPE_LABELS}
              />
            </Field>
            <Field label="Transmission" error={errors.transmission} required>
              <Select
                value={(form.transmission as string) ?? ""}
                onChange={(e) => set("transmission", e.target.value)}
                options={transmission_type}
                labelMap={TRANS_LABELS}
              />
            </Field>
          </div>

          {/* Fuel + KM Driven */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Fuel Type" error={errors.fuel_type} required>
              <Select
                value={(form.fuel_type as string) ?? ""}
                onChange={(e) => set("fuel_type", e.target.value)}
                options={fuel_type}
                labelMap={FUEL_LABELS}
              />
            </Field>
            <Field label="KM Driven" error={errors.km_driven} required>
              <Input
                type="number"
                value={form.km_driven ?? ""}
                onChange={(e) => set("km_driven", e.target.value)}
                min={0}
                placeholder="0 for new"
              />
            </Field>
          </div>

          {/* Location + Color */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Location" error={errors.location} required>
              <Input
                type="text"
                value={(form.location as string) ?? ""}
                onChange={(e) => set("location", e.target.value)}
                placeholder="e.g. Dubai"
              />
            </Field>
            <Field label="Color" error={errors.color}>
              <Input
                type="text"
                value={(form.color as string) ?? ""}
                onChange={(e) => set("color", e.target.value)}
                placeholder="e.g. Pearl White"
              />
            </Field>
          </div>

          {/* Owners count + Video URL */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="No. of Previous Owners" error={errors.owners_count}>
              <Input
                type="number"
                value={form.owners_count ?? ""}
                onChange={(e) => set("owners_count", e.target.value)}
                min={1}
                max={20}
              />
            </Field>
            <Field label="Video URL" error={errors.video_url}>
              <Input
                type="url"
                value={(form.video_url as string) ?? ""}
                onChange={(e) => set("video_url", e.target.value)}
                placeholder="https://youtube.com/…"
              />
            </Field>
          </div>

          {/* Description */}
          <Field label="Description" error={errors.description}>
            <textarea
              value={(form.description as string) ?? ""}
              onChange={(e) => set("description", e.target.value)}
              rows={4}
              placeholder="Describe the vehicle's condition, features, and history…"
              className={inputCls + " resize-none"}
            />
          </Field>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={step1Loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#3A4A20] text-white font-[family-name:var(--font-body)] text-[12px] font-semibold tracking-[0.05em] uppercase hover:bg-[#2A3510] disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer border-none"
            >
              {step1Loading ? <Loader2 size={14} className="animate-spin" /> : null}
              {step1Loading ? "Creating Draft…" : "Continue to Images"}
              {!step1Loading && <ArrowRight size={14} />}
            </button>
          </div>
        </form>
      )}

      {/* ── Step 2: Images ────────────────────────────────────────────────── */}
      {step === 2 && (
        <div className="bg-white rounded-xl border border-[#E0DDD8] p-6 space-y-5">
          <div>
            <h2 className="font-[family-name:var(--font-body)] text-[13.5px] font-semibold text-[#2A3510] mb-0.5">
              Upload Photos
            </h2>
            <p className="font-[family-name:var(--font-body)] text-[12px] text-[#888888]">
              Add at least 3 photos. The first image (marked Cover) will be the thumbnail.
            </p>
          </div>

          <ImageUploader hook={imageHook} />

          {step2Error && (
            <p className="font-[family-name:var(--font-body)] text-[12px] text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
              {step2Error}
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleRollback}
              disabled={step2Loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E0DDD8] text-[#888888] hover:text-[#2A3510] hover:border-[#2A3510] font-[family-name:var(--font-body)] text-[12px] font-semibold tracking-[0.05em] uppercase transition-all cursor-pointer bg-transparent disabled:opacity-50"
            >
              <ArrowLeft size={14} />
              Back
            </button>
            <button
              type="button"
              onClick={handleStep2}
              disabled={step2Loading || imageHook.previews.length < 3}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#3A4A20] text-white font-[family-name:var(--font-body)] text-[12px] font-semibold tracking-[0.05em] uppercase hover:bg-[#2A3510] disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer border-none"
            >
              {step2Loading ? <Loader2 size={14} className="animate-spin" /> : null}
              {step2Loading ? "Uploading…" : "Upload & Continue"}
              {!step2Loading && <ArrowRight size={14} />}
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Review & Publish ──────────────────────────────────────── */}
      {step === 3 && (
        <div className="bg-white rounded-xl border border-[#E0DDD8] p-6 space-y-6">
          <div>
            <h2 className="font-[family-name:var(--font-body)] text-[13.5px] font-semibold text-[#2A3510] mb-0.5">
              Review & Publish
            </h2>
            <p className="font-[family-name:var(--font-body)] text-[12px] text-[#888888]">
              Your car is saved as a draft. Publishing will make it visible on the buy page.
            </p>
          </div>

          {/* Preview card */}
          <div className="flex gap-5 p-4 rounded-xl bg-[#F6F5F1] border border-[#E0DDD8]">
            {uploadedUrls[0] && (
              <div className="w-28 h-20 rounded-lg overflow-hidden shrink-0 bg-white">
                <img src={uploadedUrls[0]} alt="Cover" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-[family-name:var(--font-display)] text-[16px] font-semibold uppercase tracking-[-0.01em] text-[#2A3510] truncate">
                {form.title as string}
              </p>
              <p className="font-[family-name:var(--font-body)] text-[12px] text-[#888888] mt-0.5">
                {form.brand as string} · {form.model as string} · {form.year}
              </p>
              <p className="font-[family-name:var(--font-body)] text-[13px] font-semibold text-[#2A3510] mt-2">
                AED {Number(form.price).toLocaleString()}
              </p>
              <p className="font-[family-name:var(--font-body)] text-[11px] text-[#888888] mt-1">
                {uploadedUrls.length} photo{uploadedUrls.length !== 1 ? "s" : ""} uploaded · {form.location as string}
              </p>
            </div>
          </div>

          {step3Error && (
            <p className="font-[family-name:var(--font-body)] text-[12px] text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
              {step3Error}
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={step3Loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E0DDD8] text-[#888888] hover:text-[#2A3510] hover:border-[#2A3510] font-[family-name:var(--font-body)] text-[12px] font-semibold tracking-[0.05em] uppercase transition-all cursor-pointer bg-transparent disabled:opacity-50"
            >
              <ArrowLeft size={14} />
              Back
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={step3Loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#3A4A20] text-white font-[family-name:var(--font-body)] text-[12px] font-semibold tracking-[0.05em] uppercase hover:bg-[#2A3510] disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer border-none"
            >
              {step3Loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {step3Loading ? "Publishing…" : "Publish Now"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

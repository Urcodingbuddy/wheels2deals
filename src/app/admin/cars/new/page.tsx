"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles, AlertCircle, Pencil } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { ImageUploader } from "@/components/ui/ImageUploader";
import {
  createDraftCar,
  updateCarImages,
  publishCar,
  rollbackCarCreation,
} from "@/app/(admin)/actions/car";
import { generateDescriptionWithAi } from "@/app/(admin)/actions/ai";
import { carSchema, type CarFormValues } from "@/lib/validations/car";
import { Constants } from "@/types/database";
import { getEmbedUrl } from "@/lib/video";
import type { UploadResult } from "@/lib/storage";

// ─── Constants ────────────────────────────────────────────────────────────────

const { car_type, fuel_type, transmission_type, car_category } = Constants.public.Enums;

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
const CATEGORY_LABELS: Record<string, string> = {
  economy: "Economy", sports: "Sports", suv: "SUV", luxury: "Luxury", exotic: "Exotic",
};

const CURRENT_YEAR = new Date().getFullYear();

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  required,
  children,
  action,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <label className="flex items-center gap-2 font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.2em] uppercase text-[#3A4A20]">
          {label}
          {required && <span className="w-1 h-1 rounded-full bg-[#C9A84C]" />}
        </label>
        {action}
      </div>
      {children}
      {error && (
        <div className="flex items-center gap-1.5 px-1 text-red-600">
          <AlertCircle size={10} />
          <p className="font-[family-name:var(--font-body)] text-[10px] font-medium leading-none">{error}</p>
        </div>
      )}
    </div>
  );
}

const inputCls =
  "w-full px-4 py-3 rounded-xl border-2 border-[#E8E4DE] bg-white font-[family-name:var(--font-body)] text-[14px] text-[#2A3510] placeholder:text-[#D1CDC7] focus:outline-none focus:border-[#3A4A20] transition-all duration-200 hover:border-[#D1CDC7]";

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

type FormValues = Omit<Partial<CarFormValues>, "year" | "price" | "km_driven" | "type" | "fuel_type" | "transmission"> & {
  year?: number | string;
  price?: number | string;
  km_driven?: number | string;
  type?: string;
  fuel_type?: string;
  transmission?: string;
};

export default function NewCarPage() {
  const router = useRouter();
  const imageHook = useImageUpload();
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  // Step state
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1
  const DRAFT_KEY = "w2d_new_car_draft";

  const [form, setForm] = useState<FormValues>({
    title: "",
    brand: "",
    model: "",
    year: "",
    location: "",
    color: "",
    description: "",
    video_url: "",
    km_driven: "",
    type: "",
    fuel_type: "",
    transmission: "",
    category: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step1Loading, setStep1Loading] = useState(false);

  // Restore draft from localStorage after mount (client-only, avoids hydration mismatch)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) setForm(JSON.parse(saved) as FormValues);
    } catch {}
  }, []);

  // Persist form to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {}
  }, [form]);

  // Step 2
  const [carId, setCarId] = useState<string | null>(null);
  const [step2Loading, setStep2Loading] = useState(false);
  const [step2Error, setStep2Error] = useState<string | null>(null);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [lastSucceeded, setLastSucceeded] = useState<UploadResult[]>([]);

  const [step3Loading, setStep3Loading] = useState(false);
  const [step3Error, setStep3Error] = useState<string | null>(null);

  // AI Generation & Modal
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [isAiDone, setIsAiDone] = useState(false);
  const [previewText, setPreviewText] = useState("");

  // ── Backup Template ────────────────────────────────────────────────────────
  function generateBackupDescription(data: FormValues) {
    const highlights = [
      data.year ? `• Year & Model: ${data.year} ${data.brand} ${data.model}` : null,
      data.km_driven ? `• Mileage: ${data.km_driven} KM` : null,
      data.transmission ? `• Transmission: ${data.transmission}` : null,
      data.fuel_type ? `• Fuel Type: ${data.fuel_type}` : null,
      data.color ? `• Exterior Color: ${data.color}` : null,
      data.location ? `• Location: ${data.location}` : null,
    ].filter(Boolean).join("\n");

    return `This ${data.year} ${data.brand} ${data.model} is a remarkable vehicle offering a perfect blend of style and performance. Well-maintained and located in ${data.location || "our dealership"}, it represents excellent value for money.

The car comes with a ${data.transmission} transmission and runs on ${data.fuel_type}, providing a smooth and reliable driving experience. Whether you're commuting in the city or heading out for a long drive, this ${data.brand} is built to deliver comfort and efficiency.

Vehicle Highlights:
${highlights}

Please contact us for more details or to schedule a viewing.`.trim();
  }

  async function handleGenerateAi(isAuto = false) {
    // 1. Validate mandatory fields for AI
    const aiErrors: Record<string, string> = {};
    if (!form.title) aiErrors.title = "Required for AI generation";
    if (!form.brand) aiErrors.brand = "Required for AI generation";
    if (!form.model) aiErrors.model = "Required for AI generation";

    if (Object.keys(aiErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...aiErrors }));
      return;
    }

    setIsGenerating(true);
    if (isAuto) setShowAiModal(true);
    setPreviewText(""); // Reset preview
    
    const detailsString = `
      Year: ${form.year}
      Brand: ${form.brand}
      Model: ${form.model}
      Body Type: ${form.type}
      Category: ${form.category}
      Transmission: ${form.transmission}
      Fuel: ${form.fuel_type}
      Mileage: ${form.km_driven} KM
      Color: ${form.color}
      Location: ${form.location}
    `;

    const result = await generateDescriptionWithAi(detailsString);
    
    if (result.success && result.text) {
      // Simulate streaming/typewriter effect
      const fullText = result.text;
      const words = fullText.split(" ");
      let currentText = "";
      
      for (let i = 0; i < words.length; i++) {
        currentText += words[i] + " ";
        setPreviewText(currentText);
        // Faster typing for longer text
        await new Promise((resolve) => setTimeout(resolve, 15));
      }

      set("description", fullText);
      if (isAuto) setIsAiDone(true);
    } else {
      // Correctly narrowed branch for failure
      const errorMessage = !result.success ? result.error : "Unknown error";
      console.warn("AI failed, falling back to template:", errorMessage);
      
      const backupText = generateBackupDescription(form);
      set("description", backupText);
      
      if (isAuto) {
        setPreviewText(backupText);
        setIsAiDone(true);
      } else {
        alert("AI is currently busy. We've generated a high-quality template for you instead.");
      }
    }
    
    setIsGenerating(false);
  }

  function set(key: keyof FormValues, value: string | number) {
    let finalValue: any = value;
    if (key === "video_url" && typeof value === "string") {
      finalValue = getEmbedUrl(value);
    }
    if (key === "category" && value === "") {
      finalValue = undefined;
    }
    setForm((prev) => ({ ...prev, [key]: finalValue }));
    setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  }

  // ── Step 1 submit ──────────────────────────────────────────────────────────

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    setStep1Loading(true);
    setErrors({});

    const parsed = carSchema.safeParse(form);

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

    // NEW WORKFLOW: If description is empty, trigger AI first
    if (!form.description || (form.description as string).trim() === "") {
      setStep1Loading(false);
      handleGenerateAi(true);
      return;
    }

    // Otherwise, proceed to save draft normally
    await proceedWithStep1(parsed.data);
  }

  async function proceedWithStep1(data: any) {
    setStep1Loading(true);
    const result = await createDraftCar(data);
    
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

  async function handleAiModalProceed() {
    setShowAiModal(false);
    setIsAiDone(false);
    
    // Re-validate and proceed to save now that description is filled
    const parsed = carSchema.safeParse(form);

    if (parsed.success) {
      await proceedWithStep1(parsed.data);
    }
  }

  function handleAiModalEdit() {
    setShowAiModal(false);
    setIsAiDone(false);
    // Focus the textarea after a short delay to ensure modal is closed
    setTimeout(() => {
      descriptionRef.current?.focus();
    }, 100);
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

    // Clear saved draft on successful publish
    try { localStorage.removeItem(DRAFT_KEY); } catch {}
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
    // Clear saved draft on rollback
    try { localStorage.removeItem(DRAFT_KEY); } catch {}
    setStep(1);
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin")}
            className="p-2 rounded-xl text-[#888888] hover:text-[#2A3510] hover:bg-[#E8E4DE] transition-all bg-transparent border-none cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-[28px] font-bold uppercase tracking-tight text-[#2A3510] leading-none">
              Add New Car
            </h1>
            <p className="font-[family-name:var(--font-body)] text-[12px] text-[#888888] mt-1.5 uppercase tracking-widest font-semibold">
              Draft Mode · Step {step} of 3
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* Main Content Area */}
        <div className="space-y-8">
          <StepIndicator step={step} />

          {/* ── Step 1: Details ──────────────────────────────────────────────── */}
          {step === 1 && (
            <form
              onSubmit={handleStep1}
              className="bg-white rounded-xl border border-[#E0DDD8] p-8 space-y-8"
            >
              {/* Listing Title — full width */}
              <Field label="Listing Title" error={errors.title} required>
                <Input
                  type="text"
                  value={(form.title as string) ?? ""}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. Toyota Land Cruiser VXR 2024"
                />
              </Field>

              {/* Core Details Grid */}
              <div className="grid grid-cols-3 gap-5">
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
                <Field label="Year" error={errors.year} required>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={form.year ?? ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      set("year", val);
                    }}
                    placeholder="e.g. 2024"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-5">
                <Field label="Price (AED)" error={errors.price}>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={form.price ?? ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      set("price", val);
                    }}
                    placeholder="e.g. 85000"
                  />
                </Field>
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

              <div className="grid grid-cols-3 gap-5">
                <Field label="Market Category" error={errors.category}>
                  <Select
                    value={(form.category as string) ?? ""}
                    onChange={(e) => set("category", e.target.value)}
                    options={car_category}
                    labelMap={CATEGORY_LABELS}
                  />
                </Field>
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
                    type="text"
                    inputMode="numeric"
                    value={form.km_driven ?? ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      set("km_driven", val);
                    }}
                    placeholder="e.g. 45000"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-5">
                <Field label="Location" error={errors.location} required>
                  <Input
                    type="text"
                    value={(form.location as string) ?? ""}
                    onChange={(e) => set("location", e.target.value)}
                  />
                </Field>
                <Field label="Color" error={errors.color}>
                  <Input
                    type="text"
                    value={(form.color as string) ?? ""}
                    onChange={(e) => set("color", e.target.value)}
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

              <Field 
                label="Description" 
                error={errors.description}
                action={
                  <button
                    type="button"
                    onClick={() => handleGenerateAi()}
                    disabled={isGenerating}
                    className="flex h-8 items-center gap-1.5 rounded-full bg-[#3A4A20] px-3 py-1 text-white shadow-md hover:bg-[#2A3510] transition-all disabled:opacity-50 cursor-pointer border-none"
                  >
                    {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {isGenerating ? "Generating..." : "AI Generate"}
                    </span>
                  </button>
                }
              >
                <textarea
                  ref={descriptionRef}
                  value={(form.description as string) ?? ""}
                  onChange={(e) => set("description", e.target.value)}
                  rows={8}
                  className={inputCls + " resize-none"}
                  placeholder="Tell us more about the vehicle..."
                />
              </Field>

              {errors._ && (
                <p className="font-[family-name:var(--font-body)] text-[12px] text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
                  {errors._}
                </p>
              )}

              <div className="flex items-center justify-end pt-2">
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
                    {form.category && ` · ${CATEGORY_LABELS[form.category]}`}
                  </p>
                  <p className="font-[family-name:var(--font-body)] text-[13px] font-semibold text-[#2A3510] mt-2">
                    {form.price ? `AED ${Number(form.price).toLocaleString()}` : "Price on Request"}
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

        {/* Sidebar: Listing Assistant */}
        <aside className="space-y-6 sticky top-8">
          {/* Real-time Summary Card */}
          <div className="bg-[#3A4A20] rounded-2xl p-6 text-white shadow-xl shadow-[#3A4A20]/20">
            <h3 className="font-[family-name:var(--font-display)] text-[11px] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-4">
              Listing Summary
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Vehicle</p>
                <p className="text-[18px] font-bold leading-tight mt-0.5">
                  {form.brand || "Brand"} {form.model || ""} {form.year || ""}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Price</p>
                <p className="text-[20px] font-bold text-[#C9A84C]">
                  {form.price ? `AED ${Number(form.price).toLocaleString()}` : "Price on Request"}
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Transmission</p>
                  <p className="text-[11px] font-semibold mt-0.5 capitalize">{form.transmission || "—"}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Fuel</p>
                  <p className="text-[11px] font-semibold mt-0.5 capitalize">{form.fuel_type || "—"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Tips Card */}
          <div className="bg-white rounded-2xl border border-[#E8E4DE] p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#3A4A20]">
              <Sparkles size={16} fill="currentColor" className="text-amber-400" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em]">AI Assistant Tips</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex gap-2 text-[12px] text-[#666666] leading-snug">
                <div className="w-1 h-1 rounded-full bg-[#C9A84C] mt-1.5 shrink-0" />
                Fill the Brand and Model accurately for a detailed description.
              </li>
              <li className="flex gap-2 text-[12px] text-[#666666] leading-snug">
                <div className="w-1 h-1 rounded-full bg-[#C9A84C] mt-1.5 shrink-0" />
                Mention the exact color to help the AI write about aesthetics.
              </li>
              <li className="flex gap-2 text-[12px] text-[#666666] leading-snug">
                <div className="w-1 h-1 rounded-full bg-[#C9A84C] mt-1.5 shrink-0" />
                The AI focuses on performance and comfort by default.
              </li>
            </ul>
          </div>

          {/* Checklist Card */}
          <div className="bg-[#F6F5F1] rounded-2xl border border-[#E8E4DE] p-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#3A4A20] mb-4">Requirements</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${uploadedUrls.length >= 3 ? "bg-[#3A4A20] border-[#3A4A20] text-white" : "border-[#D1CDC7] text-[#D1CDC7]"}`}>
                  <Check size={10} />
                </div>
                <span className="text-[11px] font-medium text-[#666666]">Min. 3 Photos</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${(form.description as string)?.length > 50 ? "bg-[#3A4A20] border-[#3A4A20] text-white" : "border-[#D1CDC7] text-[#D1CDC7]"}`}>
                  <Check size={10} />
                </div>
                <span className="text-[11px] font-medium text-[#666666]">Detailed Description</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${form.video_url ? "bg-[#3A4A20] border-[#3A4A20] text-white" : "border-[#D1CDC7] text-[#D1CDC7]"}`}>
                  <Check size={10} />
                </div>
                <span className="text-[11px] font-medium text-[#666666]">Video Link (Optional)</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* AI Generation Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20">
            <div className="p-8 text-center space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isAiDone ? "bg-green-50 text-green-600" : "bg-[#3A4A20]/10 text-[#3A4A20]"}`}>
                    {isAiDone ? <Check size={20} /> : <Sparkles className="animate-pulse" size={20} />}
                  </div>
                  <div className="text-left">
                    <h3 className="font-[family-name:var(--font-display)] text-[16px] font-bold uppercase tracking-tight text-[#2A3510]">
                      {isAiDone ? "Description Ready" : "Writing AI Description"}
                    </h3>
                    <p className="font-[family-name:var(--font-body)] text-[11px] text-[#888888]">
                      {isAiDone ? "Review the generated listing below" : "Crafting your premium sales description"}
                    </p>
                  </div>
                </div>

                {isAiDone && (
                  <button
                    type="button"
                    onClick={handleAiModalEdit}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#3A4A20] hover:bg-[#3A4A20]/5 font-[family-name:var(--font-body)] text-[10px] font-bold uppercase tracking-wider transition-all border-none bg-transparent cursor-pointer"
                  >
                    <Pencil size={12} />
                    Edit Manually
                  </button>
                )}
              </div>

              {/* Preview Box */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-[#3A4A20]/5 to-transparent pointer-events-none rounded-xl" />
                <div className="h-[280px] w-full overflow-y-auto p-5 text-left bg-[#FAFAF9] rounded-xl border border-[#E8E4DE] custom-scrollbar transition-all">
                  <p className="font-[family-name:var(--font-body)] text-[14px] leading-relaxed text-[#2A3510] whitespace-pre-wrap">
                    {previewText}
                    {!isAiDone && <span className="inline-block w-1.5 h-4 ml-1 bg-[#3A4A20] animate-pulse align-middle" />}
                  </p>
                </div>
                {/* Fade at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#FAFAF9] to-transparent rounded-b-xl pointer-events-none" />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleAiModalProceed}
                  disabled={!isAiDone}
                  className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-[#3A4A20] text-white font-[family-name:var(--font-body)] text-[13px] font-bold uppercase tracking-wider hover:bg-[#2A3510] disabled:opacity-30 shadow-lg shadow-[#3A4A20]/20 transition-all cursor-pointer border-none"
                >
                  {isAiDone ? "Looks Perfect, Proceed" : "Generating..."}
                  {isAiDone && <ArrowRight size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Loader2, Save, X, Image as ImageIcon, AlertCircle, Sparkles, ChevronDown, Search } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { updateCar, updateCarImages, updateCarStatus } from "@/app/(admin)/actions/car";
import { generateDescriptionWithAi } from "@/app/(admin)/actions/ai";
import { carSchema, type CarFormValues } from "@/lib/validations/car";
import { Constants } from "@/types/database";
import { getEmbedUrl } from "@/lib/video";
import { generateCarDescription } from "@/lib/ai-generator";
import type { Tables } from "@/types/database";

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

// ─── Main component ───────────────────────────────────────────────────────────

type FormValues = Omit<Partial<CarFormValues>, "year" | "price" | "km_driven" | "owners_count"> & {
  year?: number | string;
  price?: number | string;
  km_driven?: number | string;
  owners_count?: number | string;
};

export default function EditCarClient({ car }: { car: Tables<"cars"> }) {
  const router = useRouter();
  const imageHook = useImageUpload();

  // Initial data state (stable across saves)
  const [initialForm, setInitialForm] = useState<FormValues>({
    title: car.title,
    brand: car.brand,
    model: car.model,
    year: String(car.year),
    price: car.price ? String(car.price) : "",
    km_driven: String(car.km_driven),
    owners_count: car.owners_count ? String(car.owners_count) : "",
    type: car.type,
    fuel_type: car.fuel_type,
    transmission: car.transmission,
    location: car.location,
    color: car.color ?? "",
    video_url: car.video_url ?? "",
    description: car.description ?? "",
    category: car.category ?? undefined,
  });

  // Current form state
  const [form, setForm] = useState<FormValues>(initialForm);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>(car.images);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [lastSavedForm, setLastSavedForm] = useState<FormValues | null>(null);
  const [isAiDone, setIsAiDone] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(car.status);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Brand / Model dropdowns
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [allMakes, setAllMakes] = useState<string[]>([]);
  const [makesLoading, setMakesLoading] = useState(false);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [modelSearch, setModelSearch] = useState("");
  const [modelOptions, setModelOptions] = useState<string[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const modelSearchRef = useRef<HTMLInputElement>(null);

  // Fetch model options when brand changes
  useEffect(() => {
    const brand = (form.brand as string)?.trim();
    if (!brand) { setModelOptions([]); return; }
    setModelsLoading(true);
    fetch(`/api/car-models?make=${encodeURIComponent(brand)}`)
      .then((r) => r.json())
      .then((d) => setModelOptions(d.models ?? []))
      .catch(() => setModelOptions([]))
      .finally(() => setModelsLoading(false));
  }, [form.brand]);

  // Modal State
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: (() => void) | null;
    confirmLabel?: string;
    variant?: "danger" | "success" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  function showConfirm(title: string, message: string, onConfirm: () => void, confirmLabel = "Confirm", variant: any = "info") {
    setModal({ isOpen: true, title, message, onConfirm, confirmLabel, variant });
  }

  function showAlert(title: string, message: string, variant: any = "info") {
    setModal({ isOpen: true, title, message, onConfirm: null, variant });
  }

  // Check if dirty
  const isDirty = (existingImages.join(",") !== car.images.join(",")) || imageHook.previews.length > 0 || Object.keys(form).some(key => {
    const k = key as keyof FormValues;
    const originalValue = initialForm[k] ?? "";
    const currentValue = form[k] ?? "";
    return String(originalValue) !== String(currentValue);
  });

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

  async function handleSave() {
    showConfirm(
      "Save Changes",
      "Are you sure you want to save these changes? This will update the public listing immediately.",
      async () => {
        setIsSaving(true);
        setErrors({});
        
        // ... internal save logic moved to a helper or kept here ...
        await executeSave();
      },
      "Save Now"
    );
  }

  async function executeSave() {
    setIsSaving(true);
    setErrors({});

    // Validate
    const parsed = carSchema.safeParse(form);

    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      const flat2: Record<string, string> = {};
      for (const [k, v] of Object.entries(flat)) {
        if (v?.[0]) flat2[k] = v[0];
      }
      setErrors(flat2);
      setIsSaving(false);
      showAlert("Check Form", "Some fields need your attention. Please review the errors on the page.", "danger");
      return;
    }

    // 1. Upload new images if any
    let finalUrls = [...existingImages];
    
    if (imageHook.previews.length > 0) {
      setUploadingImages(true);
      const { succeeded, failed } = await imageHook.uploadAll(car.id);
      
      if (failed.length > 0) {
        setErrors({ images: `${failed.length} images failed to upload.` });
        setUploadingImages(false);
        setIsSaving(false);
        setModal(prev => ({ ...prev, isOpen: false }));
        return;
      }

      const newUrls = succeeded.map((r) => r.url);
      finalUrls = [...finalUrls, ...newUrls];
      setUploadingImages(false);
    }

    // 2. Validate total count
    if (finalUrls.length < 3) {
      setErrors({ images: "A car listing must have at least 3 images." });
      setIsSaving(false);
      setModal(prev => ({ ...prev, isOpen: false }));
      return;
    }

    // 3. Update DB
    const imgResult = await updateCarImages(car.id, finalUrls);
    if (!imgResult.success) {
      setErrors({ _: imgResult.error });
      setIsSaving(false);
      setModal(prev => ({ ...prev, isOpen: false }));
      return;
    }

    // Update fields
    const prevForm = { ...form }; // backup for revert
    const result = await updateCar(car.id, parsed.data);
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
      setIsSaving(false);
      showAlert("Update Failed", result.error || "An unexpected error occurred while saving to the database.", "danger");
      return;
    }

    setLastSavedForm(initialForm);
    setInitialForm(prevForm);
    
    setIsSaving(false);
    router.refresh();
    showAlert("Success", "Listing updated successfully!", "success");
  }

  function handleDiscard() {
    if (isDirty) {
      showConfirm(
        "Discard Changes",
        "Are you sure you want to discard all unsaved changes? This cannot be undone.",
        () => {
          setExistingImages(car.images);
          imageHook.reset();
          setModal(prev => ({ ...prev, isOpen: false }));
          router.push("/admin");
        },
        "Discard",
        "danger"
      );
    } else {
      router.push("/admin");
    }
  }

  function handleRevert() {
    if (lastSavedForm) {
      showConfirm(
        "Revert Changes",
        "This will undo your last save locally. You will still need to click Save to persist this.",
        () => {
          const toRevert = { ...lastSavedForm };
          setForm(toRevert);
          setInitialForm(toRevert);
          setLastSavedForm(null);
          setModal(prev => ({ ...prev, isOpen: false }));
        },
        "Revert Now"
      );
    }
  }

  async function handleGenerateAi() {
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
    // Simulate AI "thinking" for premium feel
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const detailsString = `
      Listing Title: ${form.title}
      Brand: ${form.brand}
      Model: ${form.model}
      Year: ${form.year}
      Body Type: ${form.type}
      Category: ${form.category}
      Transmission: ${form.transmission}
      Fuel Type: ${form.fuel_type}
      Mileage: ${form.km_driven ? `${Number(form.km_driven).toLocaleString()} KM` : "Brand New"}
      Color: ${form.color || "Not specified"}
      Location: ${form.location}
      Price: ${form.price ? `AED ${Number(form.price).toLocaleString()}` : "Not specified"}
    `;

    const result = await generateDescriptionWithAi(detailsString);
    
    if (!result.success) {
      showAlert("AI Error", `Generation failed: ${result.error}`, "danger");
    } else {
      set("description", result.text);
    }
    
    setIsGenerating(false);
  }

  return (
    <div className="p-8 max-w-[1280px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={handleDiscard}
            className="p-2 rounded-xl text-[#888888] hover:text-[#2A3510] hover:bg-[#F6F5F1] transition-all bg-transparent border border-transparent cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-[22px] font-semibold uppercase tracking-[-0.01em] text-[#2A3510] leading-none">
              Edit Listing
            </h1>
            <p className="font-[family-name:var(--font-body)] text-[13px] text-[#888888] mt-1.5">
              {car.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lastSavedForm ? (
            <button
              onClick={handleRevert}
              className="px-5 py-2.5 rounded-lg border border-[#3A4A20] text-[#3A4A20] font-[family-name:var(--font-body)] text-[12px] font-semibold tracking-[0.05em] uppercase hover:bg-[#3A4A20] hover:text-white transition-all cursor-pointer bg-transparent"
            >
              Revert Last Change
            </button>
          ) : (
            <button
              onClick={handleDiscard}
              disabled={!isDirty || isSaving}
              className="px-5 py-2.5 rounded-lg border border-[#E0DDD8] text-[#888888] font-[family-name:var(--font-body)] text-[12px] font-semibold tracking-[0.05em] uppercase hover:bg-white hover:text-red-600 hover:border-red-100 transition-all cursor-pointer bg-transparent disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Discard
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#3A4A20] text-white font-[family-name:var(--font-body)] text-[12px] font-semibold tracking-[0.05em] uppercase hover:bg-[#2A3510] disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer border-none shadow-[0_8px_16px_rgba(58,74,32,0.2)]"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-6">
          {/* General Details */}
          <section className="bg-white rounded-2xl border border-[#E0DDD8] p-6 space-y-5">
            <h2 className="font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[0.15em] uppercase text-[#3A4A20] pb-2 border-b border-[#F6F5F1]">
              Vehicle Details
            </h2>

            <Field label="Listing Title" error={errors.title} required>
              <Input
                type="text"
                value={(form.title as string) ?? ""}
                onChange={(e) => set("title", e.target.value)}
              />
            </Field>

            <div className="grid grid-cols-3 gap-5">
              {/* Brand dropdown */}
              <Field label="Brand" error={errors.brand} required>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setBrandDropdownOpen((o) => !o);
                      setBrandSearch("");
                      if (!brandDropdownOpen && allMakes.length === 0) {
                        setMakesLoading(true);
                        fetch("/api/car-makes")
                          .then((r) => r.json())
                          .then((d) => setAllMakes(d.makes ?? []))
                          .catch(() => {})
                          .finally(() => setMakesLoading(false));
                      }
                    }}
                    className={inputCls + " flex items-center justify-between text-left"}
                  >
                    <span className={(form.brand as string) ? "text-[#2A3510]" : "text-[#D1CDC7]"}>
                      {(form.brand as string) || "Select brand"}
                    </span>
                    <ChevronDown size={15} className={`shrink-0 text-[#888] transition-transform ${brandDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {brandDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setBrandDropdownOpen(false)} />
                      <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white border border-[#E0DDD8] rounded-xl shadow-xl z-50 flex flex-col overflow-hidden">
                        <div className="p-2 border-b border-[#E0DDD8] bg-[#F6F5F1]">
                          <div className="relative">
                            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAA]" />
                            <input
                              autoFocus
                              type="text"
                              placeholder="Search brands…"
                              value={brandSearch}
                              onChange={(e) => setBrandSearch(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full h-8 pl-8 pr-3 rounded-lg border border-[#E0DDD8] bg-white font-[family-name:var(--font-body)] text-[12px] focus:border-[#C9A84C] outline-none"
                            />
                          </div>
                        </div>
                        <div className="max-h-[200px] overflow-y-auto flex flex-col py-1" onWheel={(e) => e.stopPropagation()}>
                          {makesLoading && (
                            <p className="text-center py-4 text-[11px] text-[#AAA]">Loading…</p>
                          )}
                          {!makesLoading && (() => {
                            const q = brandSearch.toLowerCase();
                            const list = (allMakes.length > 0 ? allMakes : []).filter((m) =>
                              !q || m.toLowerCase().includes(q)
                            );
                            return (
                              <>
                                {list.map((make) => (
                                  <button
                                    key={make}
                                    type="button"
                                    onClick={() => {
                                      set("brand", make);
                                      set("model", "");
                                      setModelSearch("");
                                      setBrandDropdownOpen(false);
                                    }}
                                    className={`text-left px-4 py-2 text-[13px] font-medium transition-colors hover:bg-[#F6F5F1] ${(form.brand as string) === make ? "text-[#C9A84C] bg-[#C9A84C]/5" : "text-[#2A3510]"}`}
                                  >
                                    {make}
                                  </button>
                                ))}
                                {brandSearch && !list.some((m) => m.toLowerCase() === q) && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      set("brand", brandSearch);
                                      set("model", "");
                                      setBrandDropdownOpen(false);
                                    }}
                                    className="text-left px-4 py-2 text-[13px] font-medium text-[#C9A84C] hover:bg-[#F6F5F1]"
                                  >
                                    Use &ldquo;{brandSearch}&rdquo; →
                                  </button>
                                )}
                                {!brandSearch && list.length === 0 && (
                                  <p className="text-center py-6 text-[11px] text-[#AAA]">No brands found</p>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Field>

              {/* Model dropdown */}
              <Field label="Model" error={errors.model} required>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      if (!(form.brand as string)) return;
                      setModelDropdownOpen((o) => !o);
                      setModelSearch("");
                      setTimeout(() => modelSearchRef.current?.focus(), 50);
                    }}
                    className={inputCls + " flex items-center justify-between text-left " + (!(form.brand as string) ? "opacity-50 cursor-not-allowed" : "")}
                  >
                    <span className={(form.model as string) ? "text-[#2A3510]" : "text-[#D1CDC7]"}>
                      {(form.model as string) || "Select model"}
                    </span>
                    {modelsLoading
                      ? <Loader2 size={14} className="animate-spin text-[#AAA]" />
                      : <ChevronDown size={15} className={`shrink-0 text-[#888] transition-transform ${modelDropdownOpen ? "rotate-180" : ""}`} />
                    }
                  </button>

                  {modelDropdownOpen && (form.brand as string) && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setModelDropdownOpen(false)} />
                      <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white border border-[#E0DDD8] rounded-xl shadow-xl z-50 flex flex-col overflow-hidden">
                        <div className="p-2 border-b border-[#E0DDD8] bg-[#F6F5F1]">
                          <div className="relative">
                            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAA]" />
                            <input
                              ref={modelSearchRef}
                              type="text"
                              placeholder="Search models…"
                              value={modelSearch}
                              onChange={(e) => setModelSearch(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full h-8 pl-8 pr-3 rounded-lg border border-[#E0DDD8] bg-white font-[family-name:var(--font-body)] text-[12px] focus:border-[#C9A84C] outline-none"
                            />
                          </div>
                        </div>
                        <div className="max-h-[200px] overflow-y-auto flex flex-col py-1" onWheel={(e) => e.stopPropagation()}>
                          {modelsLoading && (
                            <p className="text-center py-4 text-[11px] text-[#AAA]">Loading…</p>
                          )}
                          {!modelsLoading && (() => {
                            const q = modelSearch.toLowerCase();
                            const list = modelOptions.filter((m) => !q || m.toLowerCase().includes(q));
                            return (
                              <>
                                {list.map((model) => (
                                  <button
                                    key={model}
                                    type="button"
                                    onClick={() => {
                                      set("model", model);
                                      setModelDropdownOpen(false);
                                    }}
                                    className={`text-left px-4 py-2 text-[13px] font-medium transition-colors hover:bg-[#F6F5F1] ${(form.model as string) === model ? "text-[#C9A84C] bg-[#C9A84C]/5" : "text-[#2A3510]"}`}
                                  >
                                    {model}
                                  </button>
                                ))}
                                {modelSearch && !list.some((m) => m.toLowerCase() === q) && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      set("model", modelSearch);
                                      setModelDropdownOpen(false);
                                    }}
                                    className="text-left px-4 py-2 text-[13px] font-medium text-[#C9A84C] hover:bg-[#F6F5F1]"
                                  >
                                    Use &ldquo;{modelSearch}&rdquo; →
                                  </button>
                                )}
                                {!modelSearch && list.length === 0 && (
                                  <p className="text-center py-6 text-[11px] text-[#AAA]">No models found</p>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </>
                  )}
                </div>
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
                  placeholder="e.g. 150000"
                />
              </Field>
              <Field label="Market Category" error={errors.category}>
                <Select
                  value={(form.category as string) ?? ""}
                  onChange={(e) => set("category", e.target.value)}
                  options={car_category}
                  labelMap={CATEGORY_LABELS}
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
            </div>

            <div className="grid grid-cols-3 gap-5">
              <Field label="Transmission" error={errors.transmission} required>
                <Select
                  value={(form.transmission as string) ?? ""}
                  onChange={(e) => set("transmission", e.target.value)}
                  options={transmission_type}
                  labelMap={TRANS_LABELS}
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

            <div className="grid grid-cols-2 gap-5">
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
            </div>

            <Field label="Video URL" error={errors.video_url}>
              <Input
                type="url"
                value={(form.video_url as string) ?? ""}
                onChange={(e) => set("video_url", e.target.value)}
                placeholder="https://youtube.com/…"
              />
            </Field>

            <Field 
              label="Description" 
              error={errors.description}
              action={
                <button
                  type="button"
                  onClick={handleGenerateAi}
                  disabled={isGenerating}
                  className="flex h-8 items-center gap-1.5 rounded-full bg-[#3A4A20] px-3 py-1 text-white shadow-md hover:bg-[#2A3510] transition-all disabled:opacity-50 cursor-pointer border-none"
                >
                  {isGenerating ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Sparkles size={12} fill="currentColor" className="text-amber-300" />
                  )}
                  <span className="text-[9px] font-bold uppercase tracking-wider">
                    {isGenerating ? "Writing..." : "AI Generate"}
                  </span>
                </button>
              }
            >
              <textarea
                value={(form.description as string) ?? ""}
                onChange={(e) => set("description", e.target.value)}
                rows={8}
                className={inputCls + " resize-none"}
                placeholder="Tell us more about the vehicle..."
              />
            </Field>
          </section>

          {/* Images Section */}
          <section className="bg-white rounded-2xl border border-[#E0DDD8] p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#F6F5F1]">
              <div>
                <h2 className="font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[0.15em] uppercase text-[#3A4A20]">
                  Gallery Management
                </h2>
                <p className="font-[family-name:var(--font-body)] text-[11px] text-[#888888] mt-1">
                  {existingImages.length + imageHook.previews.length} photos selected (minimum 3 required)
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Existing Images */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {existingImages.map((url, i) => (
                  <div 
                    key={url} 
                    className={`group relative aspect-video rounded-xl overflow-hidden bg-[#F6F5F1] border-2 transition-all ${
                      i === 0 ? "border-[#3A4A20] ring-4 ring-[#3A4A20]/5" : "border-transparent hover:border-[#D1CDC7]"
                    }`}
                  >
                    <img src={url} alt={`Existing ${i}`} className="w-full h-full object-cover" />
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      {i !== 0 && (
                        <button
                          onClick={() => {
                            const next = [url, ...existingImages.filter(u => u !== url)];
                            setExistingImages(next);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white text-[#2A3510] text-[10px] font-bold uppercase tracking-wider hover:bg-[#3A4A20] hover:text-white transition-all cursor-pointer border-none shadow-lg"
                        >
                          Make Cover
                        </button>
                      )}
                      <button
                        onClick={() => {
                          showConfirm(
                            "Remove Image",
                            "This image will be removed from your selection. It will only be permanently deleted when you click Save Changes.",
                            () => setExistingImages(existingImages.filter(u => u !== url)),
                            "Remove",
                            "danger"
                          );
                        }}
                        className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-red-600 transition-all cursor-pointer border-none backdrop-blur-md"
                        title="Delete image"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {i === 0 && (
                      <div className="absolute top-2 left-2 bg-[#3A4A20] text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-lg">
                        Main Cover
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Upload New Section */}
              <div className="pt-6 border-t border-[#F6F5F1]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-1 rounded-full bg-[#3A4A20]" />
                  <h3 className="font-[family-name:var(--font-body)] text-[10px] font-bold uppercase tracking-wider text-[#888888]">
                    Add New Photos
                  </h3>
                </div>
                <ImageUploader hook={imageHook} />
              </div>

              {errors.images && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600">
                  <AlertCircle size={14} />
                  <p className="text-[11px] font-medium">{errors.images}</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar info */}
        <aside className="space-y-6">
          <div className="bg-[#F6F5F1] rounded-2xl border border-[#E0DDD8] p-5">
            <h3 className="font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[0.12em] uppercase text-[#888888] mb-4">
              Status & History
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.1em] text-[#888888] mb-2">Listing Visibility</p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'available', label: 'Live / Available', color: 'bg-green-500' },
                    { id: 'draft', label: 'Hidden / Draft', color: 'bg-gray-400' },
                    { id: 'sold', label: 'Mark as Sold', color: 'bg-red-500' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={async () => {
                        if (isUpdatingStatus) return;
                        setIsUpdatingStatus(true);
                        const res = await updateCarStatus(car.id, s.id as any);
                        if (res.success) {
                          setCurrentStatus(s.id as any);
                        } else {
                          alert("Failed to update status");
                        }
                        setIsUpdatingStatus(false);
                      }}
                      disabled={isUpdatingStatus}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        currentStatus === s.id 
                          ? "bg-white border-[#3A4A20] text-[#3A4A20] shadow-sm" 
                          : "bg-transparent border-transparent text-[#888888] hover:bg-[#E0DDD8]"
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${s.color}`} />
                      {s.label}
                      {currentStatus === s.id && <Check size={10} className="ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.1em] text-[#888888] mb-1">Created At</p>
                <p className="text-[13px] font-medium text-[#2A3510]">
                  {new Date(car.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                  })}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.1em] text-[#888888] mb-1">Views</p>
                <p className="text-[13px] font-medium text-[#2A3510]">{car.views_count.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3">
            <AlertCircle className="text-blue-600 shrink-0" size={18} />
            <p className="font-[family-name:var(--font-body)] text-[12px] text-blue-800 leading-relaxed">
              Updating the title or year might change the public URL (slug) of this listing.
            </p>
          </div>
        </aside>
      </div>

      {/* Custom Confirmation Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-[#E0DDD8] animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                modal.variant === 'danger' ? 'bg-red-50 text-red-600' : 
                modal.variant === 'success' ? 'bg-green-50 text-green-600' : 
                'bg-[#F6F5F1] text-[#3A4A20]'
              }`}>
                {modal.variant === 'danger' ? <X size={32} /> : 
                 modal.variant === 'success' ? <Check size={32} /> : 
                 <AlertCircle size={32} />}
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-[22px] font-semibold text-[#2A3510] mb-3">
                {modal.title}
              </h3>
              <p className="font-[family-name:var(--font-body)] text-[14px] text-[#888888] leading-relaxed">
                {modal.message}
              </p>
            </div>
            <div className="p-4 bg-[#F6F5F1] flex gap-3">
              <button
                onClick={() => setModal({ ...modal, isOpen: false })}
                className="flex-1 px-6 py-3 rounded-xl bg-white border border-[#E0DDD8] text-[#888888] font-bold text-[12px] uppercase tracking-wider hover:bg-white/50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              {modal.onConfirm && (
                <button
                  disabled={isSaving}
                  onClick={async () => {
                    // Execute the action (e.g., executeSave)
                    // The function itself will handle showing alerts or closing the modal
                    await modal.onConfirm?.();
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-[12px] uppercase tracking-wider text-white transition-all cursor-pointer border-none shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                    modal.variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#3A4A20] hover:bg-[#2A3510]'
                  }`}
                >
                  {isSaving && <Loader2 size={14} className="animate-spin" />}
                  {isSaving ? "Processing..." : modal.confirmLabel}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {uploadingImages && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
            <Loader2 size={32} className="animate-spin text-[#3A4A20]" />
            <p className="font-[family-name:var(--font-body)] text-[14px] font-medium text-[#2A3510]">
              Uploading and processing new images...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

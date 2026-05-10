"use client";

import { useState } from "react";
import { X, CheckCircle } from "lucide-react";

import { createClient } from "@/lib/client";
import { Loader2 } from "lucide-react";

type Props = { carId: string; carTitle: string };

export default function EnquireButton({ carId, carTitle }: Props) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  function validate() {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Valid email required";
    if (!/^\+?[\d\s\-()]{7,15}$/.test(form.phone))
      e.phone = "Valid phone required";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("inquiries").insert({
        car_id: carId,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
        status: "new",
      });

      if (error) {
        console.error("Error submitting enquiry:", error);
        alert("Failed to send enquiry. Please try again.");
        return;
      }

      // WhatsApp Integration
      const whatsappNumber = "971561498485";
      const messageText = `*New Car Enquiry*\n\n` +
        `*Vehicle:* ${carTitle}\n` +
        `*Name:* ${form.name.trim()}\n` +
        `*Phone:* ${form.phone.trim()}\n` +
        `*Email:* ${form.email.trim()}\n` +
        `*Message:* ${form.message.trim() || "Interested in this car."}`;
      
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`;
      window.open(whatsappUrl, "_blank");

      setSent(true);
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => {
      setSent(false);
      setForm({ name: "", email: "", phone: "", message: "" });
      setErrors({});
    }, 300);
  }

  return (
    <>
      {/* Desktop - inline in the right panel */}
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:block w-full py-4 rounded-full bg-[#3A4A20] text-white font-[family-name:var(--font-body)] text-[12px] font-semibold tracking-[0.1em] uppercase hover:bg-[#2A3510] active:scale-[0.98] transition-all duration-150 cursor-pointer border-none"
      >
        Enquire About This Car
      </button>

      {/* Mobile - fixed bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 py-3 bg-gradient-to-t from-white/5 to-transparent backdrop-blur-[2px]">
        <button
          onClick={() => setOpen(true)}
          className="w-full py-4 rounded-full bg-[#3A4A20] text-white font-[family-name:var(--font-body)] text-[12px] font-semibold tracking-[0.1em] uppercase hover:bg-[#2A3510] active:scale-[0.98] transition-all duration-150 cursor-pointer border-none"
        >
          Enquire About This Car
        </button>
      </div>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-[6px] z-[200]"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-[440px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.2)] animate-in fade-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-[#F0EDE8]">
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-[26px] font-semibold text-[#2A3510] uppercase tracking-[-0.02em] leading-tight">
                    Enquire
                  </h2>
                  <p className="font-[family-name:var(--font-body)] text-[15px] text-[#555555] mt-1 line-clamp-1">
                    {carTitle}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F6F5F1] transition-colors cursor-pointer bg-transparent border-none -mr-1 -mt-1"
                >
                  <X size={16} strokeWidth={1.8} className="text-[#888888]" />
                </button>
              </div>

              {/* Body */}
              {sent ? (
                <div className="px-6 py-10 flex flex-col items-center gap-3 text-center">
                  <CheckCircle
                    size={40}
                    className="text-[#3A4A20]"
                    strokeWidth={1.5}
                  />
                  <h3 className="font-[family-name:var(--font-display)] text-[17px] font-semibold text-[#2A3510] uppercase">
                    Enquiry Sent
                  </h3>
                  <p className="font-[family-name:var(--font-body)] text-[13px] text-[#888888] max-w-[260px]">
                    We&apos;ll get back to you shortly about this vehicle.
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-4 px-6 py-2.5 rounded-full bg-[#3A4A20] text-white font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-[0.1em] uppercase hover:bg-[#2A3510] transition-colors cursor-pointer border-none"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="px-6 pt-5 pb-6 flex flex-col gap-4"
                >
                  <FloatField
                    label="Full Name"
                    type="text"
                    value={form.name}
                    error={errors.name}
                    onChange={(v) => {
                      setForm((f) => ({ ...f, name: v }));
                      setErrors((e) => ({ ...e, name: undefined }));
                    }}
                  />
                  <FloatField
                    label="Email Address"
                    type="email"
                    value={form.email}
                    error={errors.email}
                    onChange={(v) => {
                      setForm((f) => ({ ...f, email: v }));
                      setErrors((e) => ({ ...e, email: undefined }));
                    }}
                  />
                  <FloatField
                    label="Phone Number"
                    type="tel"
                    value={form.phone}
                    error={errors.phone}
                    onChange={(v) => {
                      setForm((f) => ({ ...f, phone: v }));
                      setErrors((e) => ({ ...e, phone: undefined }));
                    }}
                  />
                  <FloatTextarea
                    label="Message"
                    value={form.message}
                    onChange={(v) => setForm((f) => ({ ...f, message: v }))}
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-full bg-[#3A4A20] text-white font-[family-name:var(--font-body)] text-[12px] font-semibold tracking-[0.1em] uppercase hover:bg-[#2A3510] active:scale-[0.98] transition-all duration-150 cursor-pointer border-none disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    {loading ? "Sending..." : "Send Enquiry"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

// ─── Floating label input ─────────────────────────────────────────────────────

function FloatField({
  label,
  type,
  value,
  error,
  onChange,
}: {
  label: string;
  type: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="flex flex-col gap-1">
      <div className="relative pt-5">
        <label
          className={`absolute left-0 pointer-events-none font-[family-name:var(--font-body)] transition-all duration-500 ${
            active
              ? "top-0 text-[10px] font-semibold tracking-[0.12em] uppercase text-[#3A4A20]"
              : "bottom-2 text-[16px] text-[#3A4A20]"
          }`}
        >
          {label}
        </label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full pb-2 bg-transparent font-[family-name:var(--font-body)] text-[14px] text-[#2A3510] focus:outline-none border-b transition-colors duration-200 ${
            error
              ? "border-red-400"
              : focused
                ? "border-[#3A4A20]"
                : "border-[#D8D4CE]"
          }`}
        />
      </div>
      {error && (
        <span className="font-[family-name:var(--font-body)] text-[11px] text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}

// ─── Floating label textarea ──────────────────────────────────────────────────

function FloatTextarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
    onChange(e.target.value);
  }

  return (
    <div className="relative pt-5">
      <label
        className={`absolute left-0 pointer-events-none font-[family-name:var(--font-body)] transition-all duration-500 ${
          active
            ? "top-0 text-[10px] font-semibold tracking-[0.12em] uppercase text-[#3A4A20]"
            : "bottom-2 text-[16px] text-[#3A4A20]"
        }`}
      >
        {label}
      </label>
      <textarea
        rows={1}
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full pb-2 bg-transparent font-[family-name:var(--font-body)] text-[14px] text-[#2A3510] focus:outline-none border-b resize-none overflow-hidden transition-colors duration-500 ${
          focused ? "border-[#3A4A20]" : "border-[#D8D4CE]"
        }`}
      />
    </div>
  );
}

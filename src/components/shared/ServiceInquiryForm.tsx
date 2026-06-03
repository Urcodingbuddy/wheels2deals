"use client";

import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { createClient } from "@/lib/client";
import { UAEFlag } from "@/components/shared/UAEFlag";
import { validateUAEPhone, standardizeUAEPhone } from "@/lib/validation";

interface Props {
  serviceName: string;
}

export function ServiceInquiryForm({ serviceName }: Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function validate() {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!validateUAEPhone(form.phone)) e.phone = "Valid UAE phone required";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("inquiries").insert({
        car_id: null,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: standardizeUAEPhone(form.phone),
        message: `Service Enquiry: ${serviceName}`,
        status: "new",
      });

      if (error) {
        console.error("Enquiry error:", error);
        alert("Failed to send. Please try again.");
        return;
      }

      setSent(true);
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center text-center py-10 gap-3">
        <CheckCircle size={40} className="text-[#3A4A20]" strokeWidth={1.5} />
        <h3 className="font-[family-name:var(--font-display)] text-[17px] font-semibold text-[#2A3510] uppercase">
          Enquiry Sent
        </h3>
        <p className="font-[family-name:var(--font-body)] text-[13px] text-[#888888] max-w-[260px]">
          We&apos;ll get back to you shortly to confirm your booking.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="px-6 pt-5 pb-6 flex flex-col gap-4">
      <FloatField
        label="Full Name"
        type="text"
        value={form.name}
        error={errors.name}
        onChange={(v) => { setForm(f => ({ ...f, name: v })); setErrors(e => ({ ...e, name: undefined })); }}
      />
      <FloatField
        label="Email Address"
        type="email"
        value={form.email}
        error={errors.email}
        onChange={(v) => { setForm(f => ({ ...f, email: v })); setErrors(e => ({ ...e, email: undefined })); }}
      />
      <FloatField
        label="Phone Number"
        type="tel"
        value={form.phone}
        error={errors.phone}
        onChange={(v) => {
          setForm(f => ({ ...f, phone: v }));
          const cleaned = v.replace(/[\s\-()]/g, "");
          if (!v.trim()) {
            setErrors(e => ({ ...e, phone: "Phone is required" }));
          } else if (cleaned.length >= 7 && !validateUAEPhone(v)) {
            setErrors(e => ({ ...e, phone: "Valid UAE phone required" }));
          } else {
            setErrors(e => ({ ...e, phone: undefined }));
          }
        }}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-full bg-[#3A4A20] text-white font-[family-name:var(--font-body)] text-[12px] font-semibold tracking-[0.1em] uppercase hover:bg-[#2A3510] active:scale-[0.98] transition-all duration-150 cursor-pointer border-none disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? "Sending..." : "Send Enquiry"}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#2A3510]/50 font-medium">
        <FaWhatsapp className="w-3.5 h-3.5 text-green-600" />
        We&apos;ll also follow up on WhatsApp.
      </div>
    </form>
  );
}

function FloatField({
  label, type, value, error, onChange,
}: {
  label: string; type: string; value: string; error?: string; onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  const isPhone = type === "tel";

  return (
    <div className="flex flex-col gap-1">
      <div className="relative pt-5">
        <label className={`absolute pointer-events-none font-[family-name:var(--font-body)] transition-all duration-500 ${
          active
            ? "top-0 left-0 text-[10px] font-semibold tracking-[0.12em] uppercase text-[#3A4A20]"
            : isPhone
              ? "bottom-2 left-[94px] text-[16px] text-[#3A4A20]"
              : "bottom-2 left-0 text-[16px] text-[#3A4A20]"
        }`}>
          {label}
        </label>
        <div
          className="flex items-center gap-2 border-b transition-colors duration-200 w-full"
          style={{ borderColor: error ? "#F87171" : focused ? "#3A4A20" : "#D8D4CE" }}
        >
          {isPhone && (
            <div className="flex items-center gap-1.5 shrink-0 bg-[#F6F5F1] px-2.5 py-1.5 rounded border border-[#EBE8E2] text-[#555555] mb-1">
              <UAEFlag className="w-5.5 h-3" />
              <span className="text-[14px] font-bold tracking-wider">+971</span>
            </div>
          )}
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full pb-2 bg-transparent font-[family-name:var(--font-body)] text-[16px] text-[#2A3510] focus:outline-none border-none"
          />
        </div>
      </div>
      {error && <span className="font-[family-name:var(--font-body)] text-[11px] text-red-500">{error}</span>}
    </div>
  );
}

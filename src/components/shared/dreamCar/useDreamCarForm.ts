"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/client";
import { validateUAEPhone, standardizeUAEPhone } from "@/lib/validation";

// ── Types & option constants (shared business logic) ──────────────────────────

export type FormFields =
  | "fullName" | "phone" | "brand" | "model"
  | "budget" | "yearRange" | "timeline" | "notes";

export const BUDGET_OPTIONS = [
  "Under 30,000", "30,000 - 60,000", "60,000 - 100,000",
  "100,000 - 200,000", "200,000 - 400,000", "Above 400,000",
];

export const YEAR_RANGE_OPTIONS = [
  "Any year", "2024-2026", "2021-2023", "2018-2020", "2015-2017", "Older than 2015",
];

export const TIMELINE_OPTIONS = [
  "Within 24 hours", "This week", "Within a month", "Just exploring",
];

const emptyForm: Record<FormFields, string> = {
  fullName: "", phone: "+971 ", brand: "", model: "",
  budget: "", yearRange: "", timeline: "", notes: "",
};

/**
 * Holds the entire Find-My-Dream-Car form state machine: progressive phase
 * unlocking, UAE phone validation and the Supabase `dream_car_requests` insert.
 * Presentation lives in the consumer (sidebar / chatbot) — only logic here.
 */
export function useDreamCarForm({ autoResetMs = 4000 }: { autoResetMs?: number | null } = {}) {
  const [form, setForm] = useState(emptyForm);
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [brandFromList, setBrandFromList] = useState(false);

  const update = (field: FormFields) => (v: string) => {
    setForm(prev => ({ ...prev, [field]: v }));
    if (field === "phone" && phoneError) setPhoneError(null);
  };

  // Clear model when brand changes
  const prevBrandRef = useRef(form.brand);
  useEffect(() => {
    if (prevBrandRef.current !== form.brand) {
      setForm(prev => ({ ...prev, model: "" }));
      prevBrandRef.current = form.brand;
    }
  }, [form.brand]);

  // Phase 1 → 2 once name + valid phone + brand are present
  useEffect(() => {
    if (phase === 1 && form.fullName.trim() && form.phone.trim() && form.brand.trim()) {
      if (validateUAEPhone(form.phone)) {
        setPhase(2);
        setPhoneError(null);
      } else if (form.phone.replace(/[\s\-()]/g, "").length >= 7) {
        setPhoneError("Valid UAE phone required");
      }
    }
  }, [form.fullName, form.phone, form.brand, phase]);

  // Phase 2 → 3 once model + budget are present
  useEffect(() => {
    if (phase === 2 && form.model.trim() && form.budget.trim()) setPhase(3);
  }, [form.model, form.budget, phase]);

  const reset = () => {
    setSubmitted(false);
    setPhase(1);
    setForm(emptyForm);
    setBrandFromList(false);
    setPhoneError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!validateUAEPhone(form.phone)) {
      setPhoneError("Valid UAE phone required");
      return;
    }
    setPhoneError(null);

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("dream_car_requests").insert({
        full_name:  form.fullName.trim(),
        phone:      standardizeUAEPhone(form.phone),
        brand:      form.brand.trim(),
        model:      form.model.trim() || null,
        budget:     form.budget.trim() || null,
        year_range: form.yearRange.trim() || null,
        timeline:   form.timeline.trim() || null,
        notes:      form.notes.trim() || null,
        status:     "new",
      });
      if (error) {
        console.error("dream_car_requests insert error:", error);
        alert("Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
      if (autoResetMs != null) window.setTimeout(reset, autoResetMs);
    } finally {
      setLoading(false);
    }
  };

  return {
    form, phase, phoneError, submitted, loading, brandFromList,
    update, setBrandFromList, handleSubmit, reset,
  };
}

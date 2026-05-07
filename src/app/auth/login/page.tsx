"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F5F1] flex items-center justify-center px-4">
      <div className="w-full max-w-[380px] bg-white rounded-xl border border-[#E0DDD8] shadow-sm p-8">
        <div className="mb-8">
          <p className="font-[family-name:var(--font-body)] text-[10px] tracking-[0.25em] uppercase text-[#888888] mb-1">
            Wheels2Deals
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-[24px] font-semibold uppercase tracking-[-0.02em] text-[#2A3510]">
            Admin Access
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-[0.12em] uppercase text-[#888888]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E0DDD8] bg-[#F6F5F1] font-[family-name:var(--font-body)] text-[13px] text-[#2A3510] placeholder:text-[#BBBBBB] focus:outline-none focus:ring-2 focus:ring-[#3A4A20]/30 focus:border-[#3A4A20] transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-[0.12em] uppercase text-[#888888]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E0DDD8] bg-[#F6F5F1] font-[family-name:var(--font-body)] text-[13px] text-[#2A3510] placeholder:text-[#BBBBBB] focus:outline-none focus:ring-2 focus:ring-[#3A4A20]/30 focus:border-[#3A4A20] transition-all"
            />
          </div>

          {error && (
            <p className="font-[family-name:var(--font-body)] text-[12px] text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[#3A4A20] text-white font-[family-name:var(--font-body)] text-[12px] font-semibold tracking-[0.08em] uppercase transition-all hover:bg-[#2A3510] disabled:opacity-60 disabled:cursor-not-allowed mt-2 cursor-pointer"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

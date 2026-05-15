"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, Plus, Inbox, LogOut, BarChart2, SearchCheck, Car, ListOrdered } from "lucide-react";
import { createClient } from "@/lib/client";

const NAV = [
  { href: "/admin",                label: "Dashboard", icon: LayoutGrid,   exact: true  },
  { href: "/admin/inquiries",      label: "Inquiries", icon: Inbox,        exact: false },
  { href: "/admin/cars",           label: "Vehicles",  icon: Car,          exact: false },
  { href: "/admin/ordering",       label: "Ordering",  icon: ListOrdered,  exact: false },
  { href: "/admin/cars/new",       label: "Add Car",   icon: Plus,         exact: false },
  { href: "/admin/search-queries", label: "Searches",  icon: SearchCheck,  exact: false },
  { href: "/admin/analytics",      label: "Analytics", icon: BarChart2,    exact: false },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <aside className="w-[220px] shrink-0 bg-[#2A3510] flex flex-col min-h-screen sticky top-0 h-screen">
      {/* Brand */}
      <div className="px-6 pt-7 pb-6 border-b border-white/10">
        <p className="font-[family-name:var(--font-body)] text-[9px] tracking-[0.3em] uppercase text-white/40 mb-0.5">
          Wheels2Deals
        </p>
        <p className="font-[family-name:var(--font-display)] text-[17px] font-semibold uppercase tracking-[-0.01em] text-white">
          Admin Panel
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                active
                  ? "bg-white/15 text-white"
                  : "text-white/55 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon size={16} strokeWidth={1.8} />
              <span className="font-[family-name:var(--font-body)] text-[12.5px] font-medium">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 pb-6 pt-4 border-t border-white/10">
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer bg-transparent border-none"
        >
          <LogOut size={16} strokeWidth={1.8} />
          <span className="font-[family-name:var(--font-body)] text-[12.5px] font-medium">
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}

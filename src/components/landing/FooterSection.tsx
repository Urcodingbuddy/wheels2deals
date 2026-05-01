import Link from "next/link";

export function FooterSection() {
  return (
    <footer className="flex items-center justify-between p-10 border-t border-white/10 max-w-[1160px] mx-auto">
      <img
        src="/logo.svg"
        alt="wheels2deals"
        className="h-5 brightness-0 invert opacity-60"
      />
      <p className="font-[family-name:var(--font-body)] text-[11px] text-[#888888] tracking-[0.08em]">
        © 2026 wheels2deals. UAE, India.
      </p>
      <div className="flex gap-6">
        {["Privacy", "Terms"].map((item) => (
          <Link
            key={item}
            href={`/${item.toLowerCase()}`}
            className="font-[family-name:var(--font-body)] text-[11px] text-[#888888] tracking-[0.08em] no-underline hover:text-white transition-colors"
          >
            {item}
          </Link>
        ))}
      </div>
    </footer>
  );
}

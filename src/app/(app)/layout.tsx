import { AppNav } from "@/components/app/AppNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <AppNav />
      <main>{children}</main>
    </div>
  );
}

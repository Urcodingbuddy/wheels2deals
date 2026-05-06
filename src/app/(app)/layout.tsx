import { AppNav } from "@/components/app/AppNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#DCE1BA] text-[#2A3510]">
      <AppNav />
      <main>{children}</main>
    </div>
  );
}

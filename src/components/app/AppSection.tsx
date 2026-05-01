import { cn } from "@/lib/utils";

interface AppSectionProps {
  children: React.ReactNode;
  className?: string;
  /**
   * "tight"  → py-8  (used for sub-sections, filters, toolbars)
   * "normal" → py-12 md:py-16 (default page sections)
   * "loose"  → py-16 md:py-24 (hero-type sections)
   */
  spacing?: "tight" | "normal" | "loose";
  as?: "section" | "div" | "article";
}

export function AppSection({
  children,
  className,
  spacing = "normal",
  as: Tag = "section",
}: AppSectionProps) {
  return (
    <Tag
      className={cn(
        "w-full max-w-[1280px] mx-auto px-6",
        spacing === "tight" && "py-8",
        spacing === "normal" && "py-12 md:py-16",
        spacing === "loose" && "py-16 md:py-24",
        className
      )}
    >
      {children}
    </Tag>
  );
}

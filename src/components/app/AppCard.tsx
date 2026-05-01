"use client";

import { cn } from "@/lib/utils";

interface AppCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  /** "default" = subtle fill | "outlined" = border only | "elevated" = stronger fill */
  variant?: "default" | "outlined" | "elevated";
  as?: "div" | "article" | "li";
}

export function AppCard({
  children,
  className,
  onClick,
  variant = "default",
  as: Tag = "div",
}: AppCardProps) {
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "rounded-2xl transition-all duration-200",
        /* variant fills */
        variant === "default" && "bg-white/[0.03] border border-white/[0.08]",
        variant === "outlined" && "bg-transparent border border-white/[0.12]",
        variant === "elevated" && "bg-white/[0.06] border border-white/[0.1]",
        /* padding */
        "p-5 md:p-6",
        /* interactive state */
        onClick &&
          "cursor-pointer hover:bg-white/[0.07] hover:border-white/[0.16] active:scale-[0.99]",
        className
      )}
    >
      {children}
    </Tag>
  );
}

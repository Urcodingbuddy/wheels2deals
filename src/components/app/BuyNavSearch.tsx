"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Suggestion = {
  label: string;
  type: "brand" | "model" | "title";
};

export function BuyNavSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const searchValue = searchParams.get("q") ?? "";

  if (pathname !== "/buy") {
    return null;
  }

  return (
    <SearchForm
      key={searchValue}
      initialValue={searchValue}
      isPending={isPending}
      onSubmitSearch={(nextValue) => {
        const params = new URLSearchParams(searchParams.toString());
        const trimmed = nextValue.trim();

        if (trimmed) {
          params.set("q", trimmed);
        } else {
          params.delete("q");
        }

        startTransition(() => {
          router.push(
            `/buy${params.toString() ? `?${params.toString()}` : ""}`,
            {
              scroll: false,
            },
          );
        });
      }}
    />
  );
}

function SearchForm({
  initialValue,
  isPending,
  onSubmitSearch,
}: {
  initialValue: string;
  isPending: boolean;
  onSubmitSearch: (value: string) => void;
}) {
  const [value, setValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    const trimmed = value.trim();

    if (!trimmed) {
      return () => controller.abort();
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/buy/search-suggestions?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          setSuggestions([]);
          return;
        }

        const data = (await response.json()) as { suggestions?: Suggestion[] };
        setSuggestions(data.suggestions ?? []);
        setOpen(true);
        setActiveIndex(-1);
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions([]);
        }
      }
    }, 180);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [value]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const chooseSuggestion = (label: string) => {
    setValue(label);
    setOpen(false);
    onSubmitSearch(label);
  };

  return (
    <form
      ref={rootRef}
      className="relative flex-1 min-w-0 max-w-[560px]"
      onSubmit={(event) => {
        event.preventDefault();
        setOpen(false);
        onSubmitSearch(value);
      }}
      role="search"
    >
      <div className="group relative flex h-11 items-center rounded-full border border-white/20 bg-[#2A3510] text-white shadow-lg shadow-[#2A3510]/10 transition-all duration-300 focus-within:shadow-[#C9A84C]/20">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onFocus={() => {
            if (value.trim() && suggestions.length > 0) setOpen(true);
          }}
          onKeyDown={(event) => {
            if (!open || suggestions.length === 0) {
              return;
            }

            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActiveIndex((index) =>
                index < suggestions.length - 1 ? index + 1 : 0,
              );
            }

            if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex((index) =>
                index > 0 ? index - 1 : suggestions.length - 1,
              );
            }

            if (event.key === "Enter" && activeIndex >= 0) {
              event.preventDefault();
              chooseSuggestion(suggestions[activeIndex].label);
            }

            if (event.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder="Search by brand, model, or title"
          className="h-full w-full rounded-full bg-transparent pl-5 pr-[88px] font-[family-name:var(--font-body)] text-[12px] text-white outline-none placeholder:text-white/55 sm:text-[13px]"
          aria-label="Search cars"
          aria-controls="buy-nav-search-suggestions"
          aria-autocomplete="list"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              setValue("");
              setSuggestions([]);
              setOpen(false);
              onSubmitSearch("");
            }}
            className="absolute right-[56px] inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-1 top-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2A3510] transition-transform duration-300 hover:scale-[1.04]"
          aria-label="Submit search"
        >
          <Search size={16} className={isPending ? "animate-pulse" : ""} />
        </button>
      </div>

      {open && value.trim() && suggestions.length > 0 && (
        <div
          id="buy-nav-search-suggestions"
          className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 overflow-hidden rounded-[24px] border border-[#DCCFB6] bg-[#FFFDF8] p-2 shadow-[0_22px_50px_rgba(42,53,16,0.18)]"
          role="listbox"
        >
          {suggestions.map((suggestion, index) => {
            const active = index === activeIndex;

            return (
              <button
                key={`${suggestion.type}-${suggestion.label}`}
                type="button"
                role="option"
                aria-selected={active}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => chooseSuggestion(suggestion.label)}
                className={`flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left transition-colors ${
                  active
                    ? "bg-[#EFF2E1] text-[#2A3510]"
                    : "text-[#4F4A42] hover:bg-[#F6F1E6]"
                }`}
              >
                <span className="font-[family-name:var(--font-body)] text-[12px] font-medium">
                  {suggestion.label}
                </span>
                <span className="font-[family-name:var(--font-body)] text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8A846F]">
                  {suggestion.type}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </form>
  );
}

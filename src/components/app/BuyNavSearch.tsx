"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const RECENT_KEY = "w2d_recent_searches";
const MAX_RECENT = 6;

function getRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function addRecent(q: string) {
  const prev = getRecent().filter((r) => r.toLowerCase() !== q.toLowerCase());
  localStorage.setItem(RECENT_KEY, JSON.stringify([q, ...prev].slice(0, MAX_RECENT)));
}

function removeRecent(q: string) {
  const next = getRecent().filter((r) => r !== q);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

type Suggestion = { label: string; type: "brand" | "model" | "title" };

export function BuyNavSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const searchValue = searchParams.get("q") ?? "";

  if (!pathname.startsWith("/buy")) return null;

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
          params.delete("brand");
        } else {
          params.delete("q");
        }
        startTransition(() => {
          router.push(`/buy${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
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
  const [trending, setTrending] = useState<string[]>([]);
  const [matchingTrending, setMatchingTrending] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const skipSuggestionsRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    setRecent(getRecent());
    // Pre-fetch trending so it's ready when user focuses
    fetch("/api/buy/search-suggestions")
      .then((r) => r.json())
      .then(({ trending: t }: { trending: string[] }) => setTrending(t ?? []))
      .catch(() => {});
  }, []);

  const cancelSuggestions = () => {
    skipSuggestionsRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setOpen(false);
    setSuggestions([]);
    setMatchingTrending([]);
    setIsFetching(false);
  };

  // Debounced suggestions fetch
  useEffect(() => {
    const trimmed = value.trim();
    if (!trimmed || skipSuggestionsRef.current) {
      if (skipSuggestionsRef.current) skipSuggestionsRef.current = false;
      setSuggestions([]);
      setMatchingTrending([]);
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsFetching(true);
    if (document.activeElement === inputRef.current) setOpen(true);

    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/buy/search-suggestions?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (!res.ok) { setIsFetching(false); return; }
        const data = await res.json();
        setSuggestions(data.suggestions ?? []);
        setMatchingTrending(data.matchingTrending ?? []);
        setActiveIndex(-1);
      } catch {
        if (!controller.signal.aborted) setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) setIsFetching(false);
      }
    }, 180);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      controller.abort();
    };
  }, [value]);

  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const submitSearch = (q: string) => {
    const trimmed = q.trim();
    if (trimmed) addRecent(trimmed);
    setRecent(getRecent());
    cancelSuggestions();
    inputRef.current?.blur();
    onSubmitSearch(q);
  };

  const chooseSuggestion = (label: string) => {
    setValue(label);
    submitSearch(label);
  };

  // Record search as legit (called from car card click in BuyClient via custom event)
  const handleVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice search is not supported in this browser.");
      return;
    }
    setIsListening(true);
    setTranscript("");
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.onend = () => setTimeout(() => setIsListening(false), 800);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      if (event.results[0].isFinal) {
        skipSuggestionsRef.current = true;
        setValue(result);
        submitSearch(result);
      }
    };
    recognition.start();
  };

  // All items for keyboard nav: matchingTrending rows + suggestion rows
  const allItems: { label: string; section: "trending" | "suggestion" }[] = [
    ...matchingTrending.map((t) => ({ label: t, section: "trending" as const })),
    ...suggestions.map((s) => ({ label: s.label, section: "suggestion" as const })),
  ];

  const showDropdown = open && mounted;
  const isEmpty = !value.trim();

  const voiceModal =
    isListening && mounted
      ? createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
            <div className="fixed inset-0 bg-[#0D1204]/95 backdrop-blur-xl" onClick={() => setIsListening(false)} />
            <div className="relative w-full max-w-lg overflow-hidden rounded-[40px] bg-[#1A2208] p-8 md:p-12 text-center shadow-[0_32px_80px_rgba(0,0,0,0.6)] border border-white/5 animate-in zoom-in-95 duration-300">
              <button onClick={() => setIsListening(false)} className="absolute right-6 top-6 md:right-8 md:top-8 text-white/40 hover:text-white transition-colors">
                <X size={24} />
              </button>
              <div className="mb-8 md:mb-10 text-left">
                <h2 className="font-[family-name:var(--font-display)] text-[24px] md:text-[28px] font-bold text-white tracking-tight leading-tight">
                  {transcript ? transcript : "Listening..."}
                </h2>
                <p className="mt-2 font-[family-name:var(--font-body)] text-[14px] md:text-[15px] text-[#C9A84C] font-medium animate-pulse">
                  Try saying "Toyota SUV" or "BMW 2024"
                </p>
              </div>
              <div className="relative flex justify-center py-8 md:py-12">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-28 w-28 md:h-32 md:w-32 rounded-full bg-[#C9A84C]/20 animate-ping" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-40 w-40 md:h-44 md:w-44 rounded-full bg-[#C9A84C]/10 animate-pulse" />
                </div>
                <div className="relative z-10 flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-[#C9A84C] text-white shadow-[0_0_40px_rgba(201,168,76,0.4)]">
                  <svg viewBox="0 0 24 24" width="36" height="36" className="md:w-[40px] md:h-[40px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </div>
              </div>
              <div className="mt-8 md:mt-12 flex justify-center gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" style={{ animation: `bounce 1s infinite ${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div className="flex items-center gap-2 md:gap-3 w-full max-w-[640px]">
        <form
          ref={rootRef}
          className="relative flex-1 min-w-0"
          onSubmit={(e) => {
            e.preventDefault();
            submitSearch(value);
          }}
          role="search"
        >
          <div className="group relative flex h-10 md:h-11 items-center rounded-full border border-[#2A3510]/30 bg-white shadow-[0_2px_12px_rgba(42,53,16,0.08)] transition-all duration-300 focus-within:border-[#C9A84C] focus-within:shadow-[0_4px_20px_rgba(201,168,76,0.15)]">
            <div className="flex-1 flex items-center min-w-0 h-full">
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => {
                  setOpen(true);
                  setRecent(getRecent());
                }}
                onKeyDown={(e) => {
                  if (!open) return;
                  const items = isEmpty ? [] : allItems;
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActiveIndex((i) => (i < items.length - 1 ? i + 1 : 0));
                  }
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActiveIndex((i) => (i > 0 ? i - 1 : items.length - 1));
                  }
                  if (e.key === "Enter" && activeIndex >= 0 && items[activeIndex]) {
                    e.preventDefault();
                    chooseSuggestion(items[activeIndex].label);
                  }
                  if (e.key === "Escape") setOpen(false);
                }}
                placeholder="Search cars..."
                className="h-full w-full rounded-l-full bg-transparent pl-4 md:pl-5 pr-9 md:pr-10 font-[family-name:var(--font-body)] text-[12px] md:text-[13px] text-[#2A3510] font-medium outline-none placeholder:text-[#2A3510]/30"
                aria-label="Search cars"
              />
              {value && (
                <button
                  type="button"
                  onClick={() => { setValue(""); setSuggestions([]); setOpen(true); onSubmitSearch(""); }}
                  className="absolute right-[50px] md:right-[62px] top-1/2 -translate-y-1/2 flex items-center justify-center h-8 w-8 rounded-full text-[#8A846F] hover:bg-[#2A3510]/5 hover:text-[#2A3510] transition-all"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="flex h-full w-[46px] md:w-[56px] items-center justify-center rounded-r-full border-l border-[#2A3510]/10 bg-[#F1F3E1] text-[#2A3510] transition-colors hover:bg-[#E2E6C6] hover:text-[#3A4A20]"
              aria-label="Submit search"
            >
              <Search className={`w-4 h-4 md:w-[18px] md:h-[18px] ${isPending ? "animate-pulse" : ""}`} strokeWidth={2.5} />
            </button>
          </div>

          {/* ── Dropdown ── */}
          {showDropdown && (
            <div
              className="absolute left-0 right-0 top-[calc(100%+8px)] md:top-[calc(100%+10px)] z-50 overflow-hidden rounded-[20px] md:rounded-[24px] border border-[#DCCFB6] bg-white shadow-[0_22px_50px_rgba(42,53,16,0.18)]"
              role="listbox"
            >
              {/* Empty input: show Recent + Trending */}
              {isEmpty ? (
                <div className="p-2">
                  {recent.length > 0 && (
                    <div className="mb-1">
                      <div className="flex items-center justify-between px-3 pt-2 pb-1">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#2A3510]/40">
                          <Clock className="w-3 h-3" /> Recent
                        </span>
                        <button
                          type="button"
                          onClick={() => { localStorage.removeItem(RECENT_KEY); setRecent([]); }}
                          className="text-[10px] text-[#2A3510]/30 hover:text-red-400 transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                      {recent.map((r) => (
                        <div key={r} className="flex items-center group/row rounded-xl hover:bg-[#F6F5F1] transition-colors">
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => { setValue(r); chooseSuggestion(r); }}
                            className="flex-1 text-left px-3 py-2 text-[12px] font-medium text-[#4F4A42]"
                          >
                            {r}
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => { removeRecent(r); setRecent(getRecent()); }}
                            className="opacity-0 group-hover/row:opacity-100 pr-3 text-[#2A3510]/20 hover:text-red-400 transition-all"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {trending.length > 0 && (
                    <div className={recent.length > 0 ? "border-t border-[#F1F0EB] pt-1 mt-1" : ""}>
                      <div className="flex items-center gap-1.5 px-3 pt-2 pb-1">
                        <TrendingUp className="w-3 h-3 text-[#C9A84C]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#2A3510]/40">Trending</span>
                      </div>
                      {trending.slice(0, 6).map((t, i) => (
                        <button
                          key={t}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => { setValue(t); chooseSuggestion(t); }}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-[#F6F5F1] transition-colors"
                        >
                          <span className="text-[12px] font-medium text-[#4F4A42]">{t}</span>
                          <span className="text-[9px] font-bold text-[#C9A84C] bg-[#C9A84C]/10 px-1.5 py-0.5 rounded-full">#{i + 1}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {recent.length === 0 && trending.length === 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 px-3 pt-2 pb-1">
                        <Search className="w-3 h-3 text-[#2A3510]/30" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#2A3510]/40">Popular</span>
                      </div>
                      {["Toyota Land Cruiser", "BMW 7 Series", "Mercedes GLE", "Nissan Patrol", "Porsche Cayenne", "Range Rover"].map((q) => (
                        <button
                          key={q}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => { setValue(q); chooseSuggestion(q); }}
                          className="flex w-full items-center rounded-xl px-3 py-2 text-left hover:bg-[#F6F5F1] transition-colors"
                        >
                          <span className="text-[12px] font-medium text-[#4F4A42]">{q}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Typing: show matching trending + car suggestions */
                <div className="p-1.5 md:p-2">
                  {isFetching && suggestions.length === 0 && matchingTrending.length === 0 && (
                    <div className="px-1 py-1 space-y-1">
                      {[72, 52, 88, 60, 44].map((w) => (
                        <div key={w} className="flex items-center justify-between px-2.5 py-2.5">
                          <div className="h-3 rounded-full bg-[#F1F0EB] animate-pulse" style={{ width: `${w}%` }} />
                          <div className="h-2.5 w-8 rounded-full bg-[#F1F0EB] animate-pulse" />
                        </div>
                      ))}
                    </div>
                  )}
                  {!isFetching && suggestions.length === 0 && matchingTrending.length === 0 && (
                    <p className="px-4 py-5 text-center text-[12px] text-[#2A3510]/30">No results found</p>
                  )}
                  {matchingTrending.length > 0 && (
                    <>
                      {matchingTrending.map((t, i) => {
                        const idx = i;
                        const active = idx === activeIndex;
                        return (
                          <button
                            key={`mt-${t}`}
                            type="button"
                            role="option"
                            aria-selected={active}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => { setValue(t); chooseSuggestion(t); }}
                            className={`flex w-full items-center gap-2 rounded-xl md:rounded-2xl px-2.5 md:px-3 py-2 md:py-2.5 text-left transition-colors ${active ? "bg-[#F1F3E1]" : "hover:bg-[#F6F5F1]"}`}
                          >
                            <TrendingUp className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                            <span className="text-[11px] md:text-[12px] font-medium text-[#4F4A42]">{t}</span>
                          </button>
                        );
                      })}
                      {suggestions.length > 0 && <div className="my-1 border-t border-[#F1F0EB]" />}
                    </>
                  )}
                  {suggestions.map((s, i) => {
                    const idx = matchingTrending.length + i;
                    const active = idx === activeIndex;
                    return (
                      <button
                        key={`${s.type}-${s.label}`}
                        type="button"
                        role="option"
                        aria-selected={active}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => { setValue(s.label); chooseSuggestion(s.label); }}
                        className={`flex w-full items-center justify-between rounded-xl md:rounded-2xl px-2.5 md:px-3 py-2 md:py-2.5 text-left transition-colors ${active ? "bg-[#F1F3E1] text-[#2A3510]" : "text-[#4F4A42] hover:bg-[#F6F5F1]"}`}
                      >
                        <span className="text-[11px] md:text-[12px] font-medium">{s.label}</span>
                        <span className="text-[8px] md:text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8A846F]">{s.type}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </form>

        {/* Voice Search */}
        <button
          type="button"
          onClick={handleVoiceSearch}
          className="group relative flex h-10 w-10 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-full bg-[#F1F3E1] text-[#2A3510] border border-[#2A3510]/10 transition-all duration-300 hover:bg-[#E2E6C6] hover:scale-105 active:scale-95 shadow-sm"
          aria-label="Voice search"
        >
          <svg viewBox="0 0 24 24" width="17" height="17" className="md:w-[19px] md:h-[19px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </button>
      </div>
      {voiceModal}
    </>
  );
}

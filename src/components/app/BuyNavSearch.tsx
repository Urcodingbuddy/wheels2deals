"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
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

  if (!pathname.startsWith("/buy")) {
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
          // Clear brand filter on search to prevent conflicts (e.g. Nissan + Toyota)
          params.delete("brand");
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
  }, []);

  const cancelSuggestions = () => {
    skipSuggestionsRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setOpen(false);
    setSuggestions([]);
  };

  // Voice Search Implementation
  const handleVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice search is not supported in this browser.");
      return;
    }

    // Set UI state immediately for instant feedback
    setIsListening(true);
    setTranscript("");

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      // recognition actually started
    };
    
    recognition.onend = () => {
      // Small delay to allow user to see the final transcript
      setTimeout(() => setIsListening(false), 800);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      
      if (event.results[0].isFinal) {
        skipSuggestionsRef.current = true;
        setValue(result);
        cancelSuggestions();
        inputRef.current?.blur();
        onSubmitSearch(result);
      }
    };

    recognition.start();
  };

  useEffect(() => {
    const trimmed = value.trim();

    if (!trimmed || skipSuggestionsRef.current) {
      if (skipSuggestionsRef.current) {
        // Only skip once per search finalized
        skipSuggestionsRef.current = false;
      }
      setSuggestions([]);
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (abortControllerRef.current) abortControllerRef.current.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    timeoutRef.current = setTimeout(async () => {
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
        
        // Only open if the input is still focused
        if (document.activeElement === inputRef.current) {
          setOpen(true);
        }
        
        setActiveIndex(-1);
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions([]);
        }
      }
    }, 180);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      controller.abort();
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
    cancelSuggestions();
    inputRef.current?.blur();
    onSubmitSearch(label);
  };

  const voiceModal = isListening && mounted ? createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
      <div className="fixed inset-0 bg-[#0D1204]/95 backdrop-blur-xl" onClick={() => setIsListening(false)} />
      
      <div className="relative w-full max-w-lg overflow-hidden rounded-[40px] bg-[#1A2208] p-8 md:p-12 text-center shadow-[0_32px_80px_rgba(0,0,0,0.6)] border border-white/5 animate-in zoom-in-95 duration-300">
        <button 
          onClick={() => setIsListening(false)}
          className="absolute right-6 top-6 md:right-8 md:top-8 text-white/40 hover:text-white transition-colors"
        >
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
            <svg 
              viewBox="0 0 24 24" 
              width="36" 
              height="36" 
              className="md:w-[40px] md:h-[40px]"
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </div>
        </div>
        
        <div className="mt-8 md:mt-12 flex justify-center gap-2">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i} 
              className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" 
              style={{ animation: `bounce 1s infinite ${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <div className="flex items-center gap-2 md:gap-3 w-full max-w-[640px]">
        <form
          ref={rootRef}
          className="relative flex-1 min-w-0"
          onSubmit={(event) => {
            event.preventDefault();
            cancelSuggestions();
            inputRef.current?.blur();
            onSubmitSearch(value);
          }}
          role="search"
        >
          <div className="group relative flex h-10 md:h-11 items-center rounded-full border border-[#2A3510]/30 bg-white shadow-[0_2px_12px_rgba(42,53,16,0.08)] transition-all duration-300 focus-within:border-[#C9A84C] focus-within:shadow-[0_4px_20_rgba(201,168,76,0.15)]">
            <div className="flex-1 flex items-center min-w-0 h-full">
              <input
                ref={inputRef}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                onFocus={() => {
                  if (value.trim() && suggestions.length > 0) setOpen(true);
                }}
                onKeyDown={(event) => {
                  if (!open || suggestions.length === 0) return;
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setActiveIndex((index) => index < suggestions.length - 1 ? index + 1 : 0);
                  }
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setActiveIndex((index) => index > 0 ? index - 1 : suggestions.length - 1);
                  }
                  if (event.key === "Enter" && activeIndex >= 0) {
                    event.preventDefault();
                    chooseSuggestion(suggestions[activeIndex].label);
                  }
                  if (event.key === "Escape") setOpen(false);
                }}
                placeholder="Search cars..."
                className="h-full w-full rounded-l-full bg-transparent pl-4 md:pl-5 pr-9 md:pr-10 font-[family-name:var(--font-body)] text-[12px] md:text-[13px] text-[#2A3510] font-medium outline-none placeholder:text-[#2A3510]/30"
                aria-label="Search cars"
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

          {open && value.trim() && suggestions.length > 0 && (
            <div
              id="buy-nav-search-suggestions"
              className="absolute left-0 right-0 top-[calc(100%+8px)] md:top-[calc(100%+10px)] z-50 overflow-hidden rounded-[20px] md:rounded-[24px] border border-[#DCCFB6] bg-white p-1.5 md:p-2 shadow-[0_22px_50px_rgba(42,53,16,0.18)]"
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
                    className={`flex w-full items-center justify-between rounded-xl md:rounded-2xl px-2.5 md:px-3 py-2 md:py-2.5 text-left transition-colors ${
                      active ? "bg-[#F1F3E1] text-[#2A3510]" : "text-[#4F4A42] hover:bg-[#F6F5F1]"
                    }`}
                  >
                    <span className="font-[family-name:var(--font-body)] text-[11px] md:text-[12px] font-medium">{suggestion.label}</span>
                    <span className="font-[family-name:var(--font-body)] text-[8px] md:text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8A846F]">{suggestion.type}</span>
                  </button>
                );
              })}
            </div>
          )}
        </form>

        {/* Voice Search Button */}
        <button
          type="button"
          onClick={handleVoiceSearch}
          className="group relative flex h-10 w-10 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-full bg-[#F1F3E1] text-[#2A3510] border border-[#2A3510]/10 transition-all duration-300 hover:bg-[#E2E6C6] hover:scale-105 active:scale-95 shadow-sm"
          aria-label="Voice search"
        >
          <svg 
            viewBox="0 0 24 24" 
            width="17" 
            height="17" 
            className="md:w-[19px] md:h-[19px]"
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
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

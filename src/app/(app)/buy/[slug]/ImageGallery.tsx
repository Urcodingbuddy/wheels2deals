"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";

export default function ImageGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  
  // Zoom & Pan state
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastTap, setLastTap] = useState(0);
  const [initialDistance, setInitialDistance] = useState<number | null>(null);
  const [initialScale, setInitialScale] = useState(1);
  const zoomIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const lastDownPos = useRef({ x: 0, y: 0 });

  const prev = useCallback(() => setActive((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setActive((i) => (i + 1) % images.length), [images.length]);

  const resetZoom = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const stopZooming = useCallback(() => {
    if (zoomIntervalRef.current) {
      clearInterval(zoomIntervalRef.current);
      zoomIntervalRef.current = null;
    }
  }, []);

  const startZooming = useCallback((direction: 'in' | 'out') => {
    stopZooming();
    setShowUI(true);
    
    const step = direction === 'in' ? 0.05 : -0.05;
    
    // Initial step
    setScale(prev => Math.min(Math.max(1, prev + (direction === 'in' ? 0.2 : -0.2)), 4));
    
    zoomIntervalRef.current = setInterval(() => {
      setScale(prev => {
        const next = prev + step;
        if (next >= 4 || next <= 1) {
          stopZooming();
          return Math.min(Math.max(1, next), 4);
        }
        return next;
      });
    }, 50);
  }, [stopZooming]);

  // Sync thumbnail scroll
  useEffect(() => {
    if (thumbnailsRef.current) {
      const activeThumb = thumbnailsRef.current.children[active] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [active]);

  useEffect(() => {
    resetZoom();
    return () => stopZooming();
  }, [active, isFullscreen, resetZoom, stopZooming]);

  // Auto-hide UI logic when interacting
  useEffect(() => {
    if (!isFullscreen || !showUI) return;
    
    const timer = setTimeout(() => {
      setShowUI(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [scale, offset, isFullscreen, showUI]);

  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY;
    const zoomSpeed = 0.15;
    
    setScale((prev) => {
      const nextScale = delta < 0 ? prev + zoomSpeed : prev - zoomSpeed;
      const clamped = Math.min(Math.max(1, nextScale), 4);
      if (clamped !== prev) setShowUI(true);
      return clamped;
    });
  };

  // Touch handlers for Pinch and Pan
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      setShowUI(true);
      const distance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      setInitialDistance(distance);
      setInitialScale(scale);
    } else if (e.touches.length === 1) {
      // Store pos for tap detection
      lastDownPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });

      if (scale > 1) {
        setIsDragging(true);
        setDragStart({ x: e.touches[0].clientX - offset.x, y: e.touches[0].clientY - offset.y });
      } else {
        setTouchStart(e.targetTouches[0].clientX);
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialDistance !== null) {
      setShowUI(true);
      const currentDistance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      const newScale = (currentDistance / initialDistance) * initialScale;
      setScale(Math.min(Math.max(1, newScale), 4));
    } else if (e.touches.length === 1 && scale > 1 && isDragging) {
      setShowUI(true);
      setOffset({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setInitialDistance(null);
    setIsDragging(false);

    if (scale > 1) return;

    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) { setShowUI(true); next(); }
    if (diff < -50) { setShowUI(true); prev(); }
    setTouchStart(null);
  };

  // Click to toggle UI and double tap to zoom
  const handleImageClick = (e: React.MouseEvent) => {
    // Detect if this was a drag or a static click/tap
    const x = e.clientX || (e as any).pageX;
    const y = e.clientY || (e as any).pageY;
    
    const dist = Math.hypot(x - lastDownPos.current.x, y - lastDownPos.current.y);
    
    // Higher threshold for mobile (20px)
    if (dist > 20) return;

    const now = Date.now();
    if (now - lastTap < 300) {
      if (scale > 1) resetZoom();
      else setScale(2.5);
      setShowUI(true);
    } else {
      setShowUI((prev) => !prev);
    }
    setLastTap(now);
  };

  // Desktop Panning
  const handleMouseDown = (e: React.MouseEvent) => {
    lastDownPos.current = { x: e.clientX, y: e.clientY };
    setDragStart({ x: e.clientX, y: e.clientY });
    
    if (scale > 1) {
      setIsDragging(true);
      // For panning, we need to factor in the current offset
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (scale > 1 && isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
      setShowUI(true);
    } else if (!isDragging) {
      // Only show on move if it's a mouse (not touch) and we aren't panning
      // This prevents conflicts on mobile where touchmove fires before click
      if ((e as any).movementX !== 0 || (e as any).movementY !== 0) {
        // Only trigger on desktop/mouse move
        if (window.matchMedia("(pointer: fine)").matches) {
          setShowUI(true);
        }
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isFullscreen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
      if (e.key === "ArrowLeft" && scale === 1) { setShowUI(true); prev(); }
      if (e.key === "ArrowRight" && scale === 1) { setShowUI(true); next(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isFullscreen, prev, next, scale]);

  // Prevent scroll and trigger native fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.body.style.overflow = "hidden";
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {
          // Fallback if browser blocks automatic fullscreen
        });
      }
    } else {
      document.body.style.overflow = "unset";
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isFullscreen]);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] rounded-2xl bg-[#F3F1EC] border border-[#E8E4DE] flex items-center justify-center">
        <span className="font-[family-name:var(--font-body)] text-[13px] text-[#BBBBBB]">
          No images available
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Main image */}
        <div 
          className="relative aspect-[2/1] rounded-2xl overflow-hidden bg-[#F3F1EC] group cursor-zoom-in"
          onClick={() => setIsFullscreen(true)}
        >
          <img
            src={images[active]}
            alt={`${title} - photo ${active + 1}`}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
              <Maximize2 size={24} />
            </div>
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white shadow-xl border-none cursor-pointer scale-90 group-hover:scale-100"
              >
                <ChevronLeft size={20} className="text-[#2A3510]" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white shadow-xl border-none cursor-pointer scale-90 group-hover:scale-100"
              >
                <ChevronRight size={20} className="text-[#2A3510]" />
              </button>

              <span className="absolute bottom-4 right-4 font-[family-name:var(--font-body)] text-[11px] md:text-[12px] font-bold text-white bg-[#3A4A20]/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg">
                {active + 1} / {images.length}
              </span>
            </>
          )}
        </div>

        {/* Inline Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 md:gap-3 overflow-x-auto no-scrollbar pb-1 snap-x snap-mandatory">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`relative w-[70px] md:w-[88px] h-[50px] md:h-[64px] rounded-lg md:rounded-xl overflow-hidden shrink-0 transition-all duration-200 border-2 cursor-pointer bg-transparent p-0 snap-start ${
                  active === i
                    ? "border-[#3A4A20] shadow-md ring-2 ring-[#3A4A20]/10"
                    : "border-transparent opacity-50 hover:opacity-100 hover:border-[#D1CDC7]"
                }`}
              >
                <img
                  src={img}
                  alt={`View ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Fullscreen Overlay ────────────────────────────────────────────────── */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-[1000] bg-black animate-in fade-in duration-300 overflow-hidden select-none"
          onClick={handleImageClick}
          onMouseMove={handleMouseMove}
        >
          {/* Main Stage - Full Screen */}
          <div 
            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out will-change-transform"
              style={{ 
                transform: `scale(${scale}) translate(${offset.x / scale}px, ${offset.y / scale}px)`,
              }}
            >
              <img
                src={images[active]}
                alt={title}
                className="max-w-full max-h-full object-contain pointer-events-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
              />
            </div>
          </div>

          {/* Floating Header Overlay */}
          <div 
            className={`absolute top-0 left-0 right-0 z-30 transition-all duration-500 ${showUI ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-b from-black/80 via-black/40 to-transparent p-5 md:p-8 flex items-center justify-between gap-4">
              
              {/* Left Side: Title */}
              <div className={`flex-1 min-w-0 transition-all duration-500 drop-shadow-lg ${scale === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'}`}>
                <h2 className="font-[family-name:var(--font-display)] text-[15px] md:text-[18px] font-semibold tracking-tight text-white leading-tight truncate">
                  {title}
                </h2>
                <div className="flex items-center gap-2 mt-1.5 md:mt-2">
                  <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-[#3A4A20] animate-pulse" />
                  <p className="font-[family-name:var(--font-body)] text-[8px] md:text-[10px] text-white/70 uppercase tracking-[0.25em] font-bold">
                    Slide {active + 1} of {images.length}
                  </p>
                </div>
              </div>

              {/* Right Side: Controls Group */}
              <div className="flex items-center gap-3 shrink-0">
                {/* Desktop Zoom Controls Pill (Hidden on Mobile) */}
                <div className={`hidden md:flex transition-all duration-500 ${scale === 1 ? 'opacity-0 translate-x-10 pointer-events-none' : 'opacity-100 translate-x-0'}`}>
                  <div className="flex items-center p-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
                    <button
                      onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); startZooming('out'); }}
                      onMouseUp={(e) => { e.stopPropagation(); stopZooming(); }}
                      onMouseLeave={(e) => { e.stopPropagation(); stopZooming(); }}
                      onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); startZooming('out'); }}
                      onTouchEnd={(e) => { e.stopPropagation(); stopZooming(); }}
                      className="w-9 h-9 rounded-full hover:bg-white/10 transition-all flex items-center justify-center text-white cursor-pointer select-none touch-none"
                      title="Zoom Out"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                    
                    <div className="flex items-center justify-center min-w-[60px] h-9 select-none">
                      <span className="font-[family-name:var(--font-body)] text-[13px] font-bold tracking-tight text-white/90">
                        {Math.round(scale * 100)}%
                      </span>
                    </div>

                    <button
                      onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); startZooming('in'); }}
                      onMouseUp={(e) => { e.stopPropagation(); stopZooming(); }}
                      onMouseLeave={(e) => { e.stopPropagation(); stopZooming(); }}
                      onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); startZooming('in'); }}
                      onTouchEnd={(e) => { e.stopPropagation(); stopZooming(); }}
                      className="w-9 h-9 rounded-full hover:bg-white/10 transition-all flex items-center justify-center text-white cursor-pointer select-none touch-none"
                      title="Zoom In"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
                  className={`w-10 md:w-12 h-10 md:h-12 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center text-white border border-white/10 cursor-pointer backdrop-blur-xl shadow-2xl shrink-0 select-none ${scale === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Zoom Controls Pill (Thumb-friendly at Bottom Right) */}
          <div className={`absolute bottom-10 right-6 z-40 flex md:hidden transition-all duration-500 ${scale > 1 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
            <div className="flex items-center p-1 rounded-full bg-black/60 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] select-none">
              <button
                onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); startZooming('out'); }}
                onMouseUp={(e) => { e.stopPropagation(); stopZooming(); }}
                onMouseLeave={(e) => { e.stopPropagation(); stopZooming(); }}
                onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); startZooming('out'); }}
                onTouchEnd={(e) => { e.stopPropagation(); stopZooming(); }}
                className="w-11 h-11 rounded-full active:bg-white/20 transition-all flex items-center justify-center text-white select-none touch-none"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
              
              <div className="flex items-center justify-center min-w-[64px] h-11 select-none">
                <span className="font-[family-name:var(--font-body)] text-[14px] font-bold tracking-tight text-white">
                  {Math.round(scale * 100)}%
                </span>
              </div>

              <button
                onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); startZooming('in'); }}
                onMouseUp={(e) => { e.stopPropagation(); stopZooming(); }}
                onMouseLeave={(e) => { e.stopPropagation(); stopZooming(); }}
                onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); startZooming('in'); }}
                onTouchEnd={(e) => { e.stopPropagation(); stopZooming(); }}
                className="w-11 h-11 rounded-full active:bg-white/20 transition-all flex items-center justify-center text-white select-none touch-none"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
          </div>

          {/* Navigation Arrows - Hidden on Mobile, shown on Desktop */}
          <div className={`hidden md:block transition-all duration-500 ${showUI && scale === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/20 hover:bg-black/40 transition-all flex items-center justify-center text-white border border-white/5 cursor-pointer backdrop-blur-md hover:scale-110 active:scale-95 z-40"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/20 hover:bg-black/40 transition-all flex items-center justify-center text-white border border-white/5 cursor-pointer backdrop-blur-md hover:scale-110 active:scale-95 z-40"
            >
              <ChevronRight size={32} />
            </button>
          </div>

          {/* Footer Thumbnails Overlay */}
          <div 
            className={`absolute bottom-0 left-0 right-0 z-30 transition-all duration-500 ${showUI && scale === 1 ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-16 md:pt-24 pb-4 md:pb-8 px-4 md:px-8">
              <div 
                ref={thumbnailsRef}
                className="max-w-4xl mx-auto flex gap-3 md:gap-4 no-scrollbar items-center justify-start md:justify-center h-20 md:h-24 overflow-x-auto snap-x snap-mandatory py-4"
              >
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setActive(i); }}
                    className={`relative w-[80px] md:w-[110px] h-[50px] md:h-[70px] rounded-sm overflow-hidden shrink-0 transition-all duration-300 border-2 cursor-pointer bg-transparent p-0 snap-center ${
                      active === i
                        ? "border-white ring-4 ring-white/10 scale-110 z-10 mx-2 shadow-2xl"
                        : "border-white/10 opacity-30 hover:opacity-100 hover:border-white/30"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumb ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

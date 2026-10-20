import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Info,
  Eye,
} from 'lucide-react';

interface ImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
  caption?: string;
  observationTip?: string;
  topicTitle?: string;
}

export const ImageZoomModal: React.FC<ImageZoomModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  imageAlt,
  caption,
  observationTip,
  topicTitle,
}) => {
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset zoom & pan when opening
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, imageSrc]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.4, 3.5));
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const next = Math.max(prev - 0.4, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleDoubleTap = () => {
    if (scale > 1.2) {
      handleReset();
    } else {
      setScale(2);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top Bar Controls */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-900/90 border-b border-slate-800 text-white shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-white leading-tight">
              {topicTitle || 'Quan Sát Hình Ảnh Thực Tế'}
            </h3>
            <p className="text-xs text-slate-400 hidden sm:block">
              {caption || imageAlt}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-slate-800/90 rounded-xl p-1 border border-slate-700/80">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={scale <= 1}
              className="p-1.5 sm:p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Thu nhỏ (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-mono font-bold text-emerald-400 min-w-[3.5rem] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={scale >= 3.5}
              className="p-1.5 sm:p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Phóng to (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 sm:p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors ml-1"
              title="Về cỡ ban đầu (100%)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Fullscreen button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/80 transition-colors hidden sm:inline-flex"
            title="Toàn màn hình"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 sm:p-2.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white border border-rose-500/30 transition-colors"
            title="Đóng (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Image Stage Viewport */}
      <div
        className="flex-1 relative overflow-hidden flex items-center justify-center p-4 cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleTap}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          draggable={false}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            maxWidth: '92%',
            maxHeight: '82vh',
            objectFit: 'contain',
          }}
          className="rounded-2xl shadow-2xl select-none pointer-events-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
        />

        {/* Helper Hint Floating Badge */}
        {scale === 1 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-xs font-semibold text-slate-300 pointer-events-none flex items-center gap-2">
            <span>🔍 Nhấp đúp chuột hoặc lăn chuột để phóng to chi tiết</span>
          </div>
        )}
      </div>

      {/* Bottom Educational Observation Card */}
      {observationTip && (
        <div className="shrink-0 bg-slate-900/95 border-t border-slate-800 px-4 sm:px-8 py-3.5 text-white">
          <div className="max-w-4xl mx-auto flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-4 h-4" />
            </div>
            <div className="text-xs sm:text-sm leading-relaxed">
              <span className="font-extrabold text-amber-300 block sm:inline mr-2">
                Gợi ý quan sát khoa học:
              </span>
              <span className="text-slate-200 font-medium">{observationTip}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

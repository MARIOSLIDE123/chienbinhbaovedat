import React, { useState, useRef, useEffect } from 'react';
import { CaptainEarth } from '../mascot/CaptainEarth';
import { HOUSEHOLD_WASTE_ITEMS, WASTE_CATEGORIES, WasteItem } from '../../data/journeyData';
import { soundEffects } from '../../utils/soundEffects';
import {
  RotateCcw,
  Sparkles,
  Award,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Info,
  Check,
  HandMetal,
  Move,
} from 'lucide-react';

interface Stage4WasteSortingProps {
  onCompleteStage: (result: { total: number; correctFirstTime: number; accuracyPct: number }) => void;
  onFinishJourney: () => void;
}

export const Stage4WasteSorting: React.FC<Stage4WasteSortingProps> = ({
  onCompleteStage,
  onFinishJourney,
}) => {
  // State: items remaining to sort, sorted assignments, items that were failed at least once
  const [itemsToClassify, setItemsToClassify] = useState<WasteItem[]>([...HOUSEHOLD_WASTE_ITEMS]);
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [classifiedBins, setClassifiedBins] = useState<Record<string, WasteItem[]>>({
    recyclable: [],
    food_waste: [],
    other_waste: [],
  });
  const [retriedItemIds, setRetriedItemIds] = useState<Set<string>>(new Set());
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'retry' | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // Drag and Drop (Touch + Pointer + Mouse unified)
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragPos, setDragPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredBinId, setHoveredBinId] = useState<string | null>(null);

  // References to the 3 bin elements for bounding box collision detection
  const binRefs = useRef<Record<string, HTMLDivElement | null>>({
    recyclable: null,
    food_waste: null,
    other_waste: null,
  });

  // Current item being sorted
  const currentItem = itemsToClassify[activeItemIndex];

  // Helper to detect which bin the coordinates (x, y) hover over
  const detectHoveredBin = (clientX: number, clientY: number): string | null => {
    for (const [catId, el] of Object.entries(binRefs.current)) {
      if (el) {
        const rect = el.getBoundingClientRect();
        if (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        ) {
          return catId;
        }
      }
    }
    return null;
  };

  // Start Pointer Drag (works seamlessly on Touch screens and Mouse)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!currentItem || isGameOver) return;
    
    // Prevent default scroll/text selection during drag
    e.preventDefault();
    setIsDragging(true);
    setDragPos({ x: e.clientX, y: e.clientY });
    setHoveredBinId(detectHoveredBin(e.clientX, e.clientY));
  };

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      setDragPos({ x: e.clientX, y: e.clientY });
      const targetBin = detectHoveredBin(e.clientX, e.clientY);
      setHoveredBinId(targetBin);
    };

    const handlePointerUp = (e: PointerEvent) => {
      const targetBin = detectHoveredBin(e.clientX, e.clientY);
      if (targetBin && currentItem) {
        processSorting(currentItem, targetBin);
      }
      setIsDragging(false);
      setHoveredBinId(null);
    };

    const handlePointerCancel = () => {
      setIsDragging(false);
      setHoveredBinId(null);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerCancel);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerCancel);
    };
  }, [isDragging, currentItem]);

  // HTML5 native drag fallback for desktop browsers
  const handleNativeDragStart = (e: React.DragEvent, item: WasteItem) => {
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleNativeDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleNativeDrop = (e: React.DragEvent, targetCategoryId: string) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    const item = itemsToClassify.find((it) => it.id === itemId);
    if (item) {
      processSorting(item, targetCategoryId);
    }
  };

  // Direct Click/Tap on Bin fallback
  const handleBinSelect = (targetCategoryId: string) => {
    if (!currentItem || isDragging) return;
    processSorting(currentItem, targetCategoryId);
  };

  // Processing placement logic
  const processSorting = (item: WasteItem, targetCategoryId: string) => {
    const isCorrect = item.category === targetCategoryId;

    if (isCorrect) {
      soundEffects.playCorrect();
      setFeedbackType('success');
      setFeedbackMessage(`✓ Chính xác! ${item.name} đã được bỏ vào đúng thùng. ${item.explanation}`);

      // Add to bin
      setClassifiedBins((prev) => ({
        ...prev,
        [targetCategoryId]: [...prev[targetCategoryId], item],
      }));

      // Next item
      const nextIdx = activeItemIndex + 1;
      if (nextIdx >= itemsToClassify.length) {
        // All sorted!
        setIsGameOver(true);
        const correctFirstTime = itemsToClassify.length - retriedItemIds.size;
        const accuracyPct = Math.round((correctFirstTime / itemsToClassify.length) * 100);
        onCompleteStage({
          total: itemsToClassify.length,
          correctFirstTime,
          accuracyPct,
        });
      } else {
        setActiveItemIndex(nextIdx);
        setShowHint(false);
      }
    } else {
      soundEffects.playIncorrect();
      setFeedbackType('retry');
      setFeedbackMessage(`✕ Chưa đúng rồi bạn ơi! ${item.name} không thuộc nhóm này. Hãy bấm "Gợi ý" để xem trợ giúp của Đội trưởng nhé!`);
      setRetriedItemIds((prev) => new Set(prev).add(item.id));
    }
  };

  const handleResetGame = () => {
    setItemsToClassify([...HOUSEHOLD_WASTE_ITEMS]);
    setActiveItemIndex(0);
    setClassifiedBins({
      recyclable: [],
      food_waste: [],
      other_waste: [],
    });
    setRetriedItemIds(new Set());
    setFeedbackMessage(null);
    setFeedbackType(null);
    setShowHint(false);
    setIsGameOver(false);
    setIsDragging(false);
    setHoveredBinId(null);
  };

  const correctFirstCount = itemsToClassify.length - retriedItemIds.size;
  const accuracyRate = Math.round((correctFirstCount / itemsToClassify.length) * 100);

  return (
    <div className="w-full space-y-3 pb-6">
      {/* 1. Mascot Banner with Bouncing Captain Earth */}
      <div className="bg-gradient-to-r from-emerald-50 via-amber-50 to-orange-50 border-2 border-emerald-300 rounded-3xl p-3 sm:p-4 shadow-xs">
        <CaptainEarth
          mood={isGameOver ? 'winner' : feedbackType === 'retry' ? 'encouraging' : 'greeting'}
          message="Mỗi ngày gia đình chúng ta tạo ra nhiều loại rác khác nhau. Nếu biết phân loại đúng cách, chúng ta có thể góp phần bảo vệ môi trường. Các bạn hãy kéo thả những loại rác này vào đúng 3 thùng nhé!"
          size="sm"
          isJumping={true}
        />
      </div>

      {/* 2. Main Interactive Workspace */}
      <div className="bg-white border-2 border-emerald-200 rounded-3xl p-3 sm:p-5 shadow-xs space-y-3">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#22B573] block">
              CHẶNG 4: HOẠT ĐỘNG THỰC HÀNH GIA ĐÌNH XANH
            </span>
            <h2 className="text-sm sm:text-lg font-black text-[#20352B]">
              Phân Loại Rác Gia Đình Vào 3 Nhóm Chuẩn (Kéo Thả)
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Chạm và kéo món đồ thả vào 1 trong 3 thùng rác bên dưới (hoặc chạm vào thùng để chọn).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetGame}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Chơi lại</span>
            </button>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-black">
              Tiến độ: {activeItemIndex}/{itemsToClassify.length}
            </span>
          </div>
        </div>

        {/* ================================================================= */}
        {/* GAME PLAY AREA (IF NOT FINISHED)                                  */}
        {/* ================================================================= */}
        {!isGameOver ? (
          <div className="space-y-3">
            {/* Current Item Card to Drag */}
            {currentItem && (
              <div className="p-3 sm:p-4 bg-gradient-to-r from-amber-50/80 via-white to-emerald-50/80 border-2 border-dashed border-amber-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Draggable Active Item Component */}
                <div
                  onPointerDown={handlePointerDown}
                  draggable
                  onDragStart={(e) => handleNativeDragStart(e, currentItem)}
                  className={`flex items-center gap-3 p-3 bg-white rounded-2xl shadow-md border-2 border-amber-300 cursor-grab active:cursor-grabbing select-none transition-transform touch-none ${
                    isDragging ? 'opacity-40 scale-95' : 'hover:scale-105 hover:shadow-lg'
                  }`}
                  style={{ touchAction: 'none' }}
                >
                  <span className="text-3xl sm:text-4xl p-2 bg-amber-50 rounded-xl border border-amber-200 shadow-2xs">
                    {currentItem.icon}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wide text-amber-700 block">
                        Kéo món đồ này ({activeItemIndex + 1}/{itemsToClassify.length}):
                      </span>
                      <span className="inline-flex items-center text-[9px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded-full">
                        <Move className="w-2.5 h-2.5 mr-0.5" /> Chạm & Kéo
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-[#20352B]">
                      {currentItem.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowHint(!showHint)}
                    className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                    <span>{showHint ? 'Ẩn gợi ý' : '💡 Xem Gợi Ý'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Hint Box */}
            {showHint && currentItem && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium animate-in fade-in duration-150">
                <strong>Gợi ý từ Đội trưởng: </strong>
                {currentItem.hint}
              </div>
            )}

            {/* Instant Feedback Strip */}
            {feedbackMessage && (
              <div
                className={`p-2.5 rounded-2xl text-xs font-semibold leading-relaxed animate-in fade-in duration-150 flex items-start gap-2 ${
                  feedbackType === 'success'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                    : 'bg-rose-50 text-rose-900 border border-rose-300'
                }`}
              >
                <span className="text-base shrink-0">
                  {feedbackType === 'success' ? '🌟' : '💡'}
                </span>
                <div>{feedbackMessage}</div>
              </div>
            )}

            {/* 3 MANDATORY BINS (Responsive Layout for Mobile & Desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3.5 pt-1">
              {WASTE_CATEGORIES.map((cat) => {
                const itemsInThisBin = classifiedBins[cat.id] || [];
                const isHovered = hoveredBinId === cat.id;

                return (
                  <div
                    key={cat.id}
                    ref={(el) => {
                      binRefs.current[cat.id] = el;
                    }}
                    onDragOver={handleNativeDragOver}
                    onDrop={(e) => handleNativeDrop(e, cat.id)}
                    onClick={() => handleBinSelect(cat.id)}
                    className={`p-3 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between select-none ${
                      isHovered
                        ? 'border-emerald-500 ring-4 ring-emerald-300 scale-[1.02] shadow-xl bg-emerald-50/50'
                        : `${cat.borderColor} ${cat.bgColor} hover:shadow-md`
                    } min-h-[140px] sm:min-h-[200px]`}
                  >
                    <div>
                      {/* Bin Header */}
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-2xl sm:text-3xl p-1 bg-white rounded-xl shadow-2xs border border-slate-200">
                          {cat.icon}
                        </span>
                        <div className="flex items-center gap-1">
                          {isHovered && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-white animate-bounce">
                              🎯 Thả vào đây!
                            </span>
                          )}
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${cat.tagBg}`}>
                            Đã chứa: {itemsInThisBin.length}
                          </span>
                        </div>
                      </div>

                      {/* Full Mandatory Name */}
                      <h4 className="text-xs sm:text-sm font-black text-[#20352B] leading-tight">
                        {cat.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5 hidden sm:block">
                        {cat.description}
                      </p>
                    </div>

                    {/* Basket Drop Zone */}
                    <div
                      className={`p-2 bg-white/90 border-2 border-dashed rounded-xl mt-2 flex flex-wrap items-center gap-1.5 justify-center transition-colors ${
                        isHovered
                          ? 'border-emerald-500 bg-emerald-100/60 ring-2 ring-emerald-400'
                          : 'border-slate-300'
                      } min-h-[50px] sm:min-h-[65px]`}
                    >
                      {itemsInThisBin.length === 0 ? (
                        <span className="text-[10px] sm:text-[11px] text-slate-400 font-bold text-center">
                          {isHovered ? '👉 Thả tay để bỏ rác vào đây' : 'Kéo thả hoặc chạm vào thùng này'}
                        </span>
                      ) : (
                        itemsInThisBin.map((it) => (
                          <span
                            key={it.id}
                            title={it.name}
                            className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 shadow-2xs"
                          >
                            <span>{it.icon}</span>
                            <span className="truncate max-w-[80px] sm:max-w-[90px]">{it.name}</span>
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Special Note Box on Hazardous Waste */}
            <div className="p-2.5 bg-rose-50/70 border border-rose-200 rounded-2xl flex items-start gap-2 text-xs text-rose-950 font-medium">
              <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong>LƯU Ý ĐẶC BIỆT TỪ ĐỘI TRƯỞNG ĐẤT XANH: </strong>
                Pin cũ, bóng đèn huỳnh quang và chai hóa chất <strong>KHÔNG</strong> vứt chung vào 3 nhóm trên, mà phải gửi đến điểm xử lý <em>Chất thải nguy hại riêng</em>!
              </div>
            </div>
          </div>
        ) : (
          /* ================================================================= */
          /* GAME OVER / RESULTS CARD                                          */
          /* ================================================================= */
          <div className="bg-gradient-to-b from-emerald-50/50 to-white border-2 border-emerald-300 rounded-3xl p-5 sm:p-7 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 flex items-center justify-center text-3xl shadow-inner animate-bounce">
              🏡
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-[#22B573] block">
                HOÀN THÀNH XUẤT SẮC
              </span>
              <h3 className="text-lg sm:text-2xl font-black text-[#20352B]">
                Chúc Mừng Em Nhận Huy Hiệu GIA ĐÌNH XANH!
              </h3>
              <p className="text-xs text-slate-600 max-w-lg mx-auto font-medium">
                Xuất sắc! Em đã hoàn thành nhiệm vụ kéo thả và phân loại toàn bộ 12 món rác sinh hoạt. Hãy cùng gia đình duy trì thói quen phân loại rác mỗi ngày nhé!
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto">
              <div className="p-2.5 bg-white border border-emerald-200 rounded-2xl shadow-2xs">
                <span className="block text-lg font-black text-emerald-600">{itemsToClassify.length}</span>
                <span className="text-[10px] font-bold text-slate-500">Tổng món rác</span>
              </div>
              <div className="p-2.5 bg-white border border-blue-200 rounded-2xl shadow-2xs">
                <span className="block text-lg font-black text-blue-600">{correctFirstCount}</span>
                <span className="text-[10px] font-bold text-slate-500">Đúng ngay lần 1</span>
              </div>
              <div className="p-2.5 bg-white border border-amber-200 rounded-2xl shadow-2xs">
                <span className="block text-lg font-black text-amber-600">{accuracyRate}%</span>
                <span className="text-[10px] font-bold text-slate-500">Độ chuẩn xác</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetGame}
                className="w-full sm:w-auto px-4 py-2 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi luyện tập lại</span>
              </button>

              <button
                type="button"
                onClick={onFinishJourney}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#22B573] hover:bg-[#1caa68] text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
              >
                <span>HOÀN THÀNH HÀNH TRÌNH → TỔNG KẾT CHIẾN CÔNG</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* FLOATING DRAG GHOST (Follows finger/mouse smoothly during drag)     */}
      {/* =================================================================== */}
      {isDragging && currentItem && (
        <div
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 scale-110 shadow-2xl rotate-2 transition-transform"
          style={{
            left: `${dragPos.x}px`,
            top: `${dragPos.y}px`,
          }}
        >
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-[#22B573] ring-4 ring-emerald-300/60 shadow-2xl">
            <span className="text-3xl p-1 bg-amber-50 rounded-xl border border-amber-200">
              {currentItem.icon}
            </span>
            <div>
              <span className="text-[9px] font-black uppercase text-emerald-600 tracking-wider block">
                Đang kéo thả:
              </span>
              <span className="text-xs font-black text-slate-800 block">
                {currentItem.name}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

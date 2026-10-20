import React, { useState } from 'react';
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
  const [selectedItemForTouch, setSelectedItemForTouch] = useState<WasteItem | null>(HOUSEHOLD_WASTE_ITEMS[0]);
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

  // Current item being sorted
  const currentItem = itemsToClassify[activeItemIndex];

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, item: WasteItem) => {
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetCategoryId: string) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    const item = itemsToClassify.find((it) => it.id === itemId);
    if (item) {
      processSorting(item, targetCategoryId);
    }
  };

  // Touch / Click handler
  const handleBinSelect = (targetCategoryId: string) => {
    const itemToPlace = selectedItemForTouch || currentItem;
    if (!itemToPlace) return;
    processSorting(itemToPlace, targetCategoryId);
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
        setSelectedItemForTouch(itemsToClassify[nextIdx]);
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
    setSelectedItemForTouch(HOUSEHOLD_WASTE_ITEMS[0]);
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
  };

  const correctFirstCount = itemsToClassify.length - retriedItemIds.size;
  const accuracyRate = Math.round((correctFirstCount / itemsToClassify.length) * 100);

  return (
    <div className="w-full space-y-4 pb-8">
      {/* 1. Mascot Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-amber-50 to-orange-50 border-2 border-emerald-300 rounded-3xl p-4 sm:p-5 shadow-xs">
        <CaptainEarth
          mood={isGameOver ? 'winner' : feedbackType === 'retry' ? 'encouraging' : 'greeting'}
          message="Mỗi ngày gia đình chúng ta tạo ra nhiều loại rác khác nhau. Nếu biết phân loại đúng cách, chúng ta có thể góp phần bảo vệ môi trường. Các bạn hãy giúp mình sắp xếp những loại rác này nhé!"
          size="sm"
        />
      </div>

      {/* 2. Cozy Family Kitchen Cartoon Scene */}
      <div className="bg-white border-2 border-emerald-200 rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#22B573] block">
              CHẶNG 4: HOẠT ĐỘNG THỰC HÀNH GIA ĐÌNH XANH
            </span>
            <h2 className="text-base sm:text-xl font-black text-[#20352B]">
              Cùng Gia Đình Phân Loại Rác Vào 3 Nhóm Chuẩn
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Kéo thả trên máy tính hoặc bấm chọn món đồ rồi chạm thùng rác tương ứng trên điện thoại!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetGame}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Chơi lại</span>
            </button>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-black">
              Đã phân loại: {activeItemIndex}/{itemsToClassify.length}
            </span>
          </div>
        </div>

        {/* ================================================================= */}
        {/* GAME PLAY AREA (IF NOT FINISHED)                                  */}
        {/* ================================================================= */}
        {!isGameOver ? (
          <div className="space-y-4">
            {/* Current Item Card to Classify */}
            {currentItem && (
              <div className="p-4 bg-gradient-to-r from-amber-50/70 via-white to-emerald-50/70 border-2 border-dashed border-amber-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, currentItem)}
                  className="flex items-center gap-3.5 cursor-grab active:cursor-grabbing p-2.5 bg-white rounded-2xl shadow-sm border border-slate-200 hover:scale-105 transition-transform"
                >
                  <span className="text-3xl sm:text-4xl p-2 bg-slate-50 rounded-xl border border-slate-100 shadow-2xs">
                    {currentItem.icon}
                  </span>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-amber-700 block">
                      Món đồ cần phân loại ({activeItemIndex + 1}/{itemsToClassify.length}):
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-[#20352B]">
                      {currentItem.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowHint(!showHint)}
                    className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                    <span>{showHint ? 'Ẩn gợi ý' : '💡 Xem Gợi Ý'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Hint Box */}
            {showHint && currentItem && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium animate-in fade-in duration-150">
                <strong>Gợi ý từ Đội trưởng: </strong>
                {currentItem.hint}
              </div>
            )}

            {/* Instant Feedback Strip */}
            {feedbackMessage && (
              <div
                className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed animate-in fade-in duration-150 flex items-start gap-2 ${
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

            {/* 3 MANDATORY BINS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
              {WASTE_CATEGORIES.map((cat) => {
                const itemsInThisBin = classifiedBins[cat.id] || [];

                return (
                  <div
                    key={cat.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, cat.id)}
                    onClick={() => handleBinSelect(cat.id)}
                    className={`p-4 rounded-2xl border-2 ${cat.borderColor} ${cat.bgColor} flex flex-col justify-between space-y-3 cursor-pointer transition-all hover:scale-[1.01] hover:shadow-md min-h-[220px]`}
                  >
                    <div>
                      {/* Bin Header */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-3xl p-1 bg-white rounded-xl shadow-2xs border border-slate-200">
                          {cat.icon}
                        </span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${cat.tagBg}`}>
                          Đã chứa: {itemsInThisBin.length} món
                        </span>
                      </div>

                      {/* Full Mandatory Name */}
                      <h4 className="text-xs sm:text-sm font-black text-[#20352B] leading-tight">
                        {cat.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">
                        {cat.description}
                      </p>
                    </div>

                    {/* Basket Drop Zone */}
                    <div className="p-2.5 bg-white/90 border-2 border-dashed border-slate-300 rounded-xl min-h-[70px] flex flex-wrap items-center gap-1.5 justify-center">
                      {itemsInThisBin.length === 0 ? (
                        <span className="text-[11px] text-slate-400 font-bold text-center">
                          Chạm vào đây hoặc kéo thả món đồ vào thùng này
                        </span>
                      ) : (
                        itemsInThisBin.map((it) => (
                          <span
                            key={it.id}
                            title={it.name}
                            className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-100 border border-slate-200"
                          >
                            <span>{it.icon}</span>
                            <span className="truncate max-w-[90px]">{it.name}</span>
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Special Note Box on Hazardous Waste */}
            <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-950 font-medium">
              <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong>LƯU Ý ĐẶC BIỆT TỪ ĐỘI TRƯỞNG ĐẤT XANH: </strong>
                Pin cũ, bóng đèn huỳnh quang và vỏ chai hóa chất độc hại <strong>KHÔNG</strong> được vứt chung vào 3 nhóm rác thông thường trên, mà phải được thu gom vào điểm xử lý <em>Chất thải nguy hại riêng biệt</em> để không đầu độc đất mẹ!
              </div>
            </div>
          </div>
        ) : (
          /* ================================================================= */
          /* GAME OVER / RESULTS CARD                                          */
          /* ================================================================= */
          <div className="bg-gradient-to-b from-emerald-50/50 to-white border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 text-center space-y-5">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 flex items-center justify-center text-4xl shadow-inner animate-bounce">
              🏡
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-[#22B573] block">
                HOÀN THÀNH XUẤT SẮC
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#20352B]">
                Chúc Mừng Em Nhận Huy Hiệu GIA ĐÌNH XANH!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto font-medium">
                Xuất sắc! Em đã hoàn thành nhiệm vụ phân loại toàn bộ 12 món rác sinh hoạt. Hãy cùng gia đình duy trì thói quen phân loại rác mỗi ngày nhé!
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto">
              <div className="p-3 bg-white border border-emerald-200 rounded-2xl shadow-2xs">
                <span className="block text-xl font-black text-emerald-600">{itemsToClassify.length}</span>
                <span className="text-[10px] font-bold text-slate-500">Tổng món rác</span>
              </div>
              <div className="p-3 bg-white border border-blue-200 rounded-2xl shadow-2xs">
                <span className="block text-xl font-black text-blue-600">{correctFirstCount}</span>
                <span className="text-[10px] font-bold text-slate-500">Đúng ngay lần đầu</span>
              </div>
              <div className="p-3 bg-white border border-amber-200 rounded-2xl shadow-2xs">
                <span className="block text-xl font-black text-amber-600">{accuracyRate}%</span>
                <span className="text-[10px] font-bold text-slate-500">Độ chuẩn xác</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetGame}
                className="w-full sm:w-auto px-5 py-2.5 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi luyện tập lại</span>
              </button>

              <button
                type="button"
                onClick={onFinishJourney}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#22B573] hover:bg-[#1caa68] text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
              >
                <span>HOÀN THÀNH HÀNH TRÌNH → TỔNG KẾT CHIẾN CÔNG</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { PRACTICE_ACTIVITIES, PracticeItem } from '../../data/practiceQuestions';
import { playCorrectSound, playIncorrectSound } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowUp,
  ArrowDown,
  HelpCircle,
} from 'lucide-react';

interface QuickPracticeProps {
  onUpdateScore: (correctCount: number) => void;
  onGoToSimulations: () => void;
}

export const QuickPractice: React.FC<QuickPracticeProps> = ({
  onUpdateScore,
  onGoToSimulations,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answersState, setAnswersState] = useState<Record<string, any>>({});
  const [submittedCurrent, setSubmittedCurrent] = useState(false);
  const [correctFlags, setCorrectFlags] = useState<Record<number, boolean>>({});

  const currentItem = PRACTICE_ACTIVITIES[currentIndex];
  const isFinished = currentIndex >= PRACTICE_ACTIVITIES.length;

  // Initialize state for current activity
  const currentAnswer = answersState[currentItem?.id];

  const handleSingleChoice = (optionId: string) => {
    if (submittedCurrent) return;
    setAnswersState((prev) => ({ ...prev, [currentItem.id]: optionId }));
  };

  const handleBucketSort = (itemId: string, bucketId: string) => {
    if (submittedCurrent) return;
    const currentAssignments = answersState[currentItem.id] || {};
    setAnswersState((prev) => ({
      ...prev,
      [currentItem.id]: {
        ...currentAssignments,
        [itemId]: bucketId,
      },
    }));
  };

  const handleMatching = (leftId: string, selectedRight: string) => {
    if (submittedCurrent) return;
    const currentMatches = answersState[currentItem.id] || {};
    setAnswersState((prev) => ({
      ...prev,
      [currentItem.id]: {
        ...currentMatches,
        [leftId]: selectedRight,
      },
    }));
  };

  const handleMultiSelect = (optionId: string) => {
    if (submittedCurrent) return;
    const currentSelected: string[] = answersState[currentItem.id] || [];
    const newSelected = currentSelected.includes(optionId)
      ? currentSelected.filter((id) => id !== optionId)
      : [...currentSelected, optionId];
    setAnswersState((prev) => ({ ...prev, [currentItem.id]: newSelected }));
  };

  const handleTrueFalse = (val: boolean) => {
    if (submittedCurrent) return;
    setAnswersState((prev) => ({ ...prev, [currentItem.id]: val }));
  };

  const handleOrderMove = (idx: number, direction: 'up' | 'down') => {
    if (submittedCurrent) return;
    const currentList: string[] =
      answersState[currentItem.id] || [...currentItem.data.initialShuffled];
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= currentList.length) return;
    const copy = [...currentList];
    const temp = copy[idx];
    copy[idx] = copy[newIdx];
    copy[newIdx] = temp;
    setAnswersState((prev) => ({ ...prev, [currentItem.id]: copy }));
  };

  const checkAnswer = () => {
    let isCorrect = false;
    if (currentItem.type === 'single-choice') {
      const selected = currentItem.data.options.find(
        (o: any) => o.id === currentAnswer
      );
      isCorrect = selected?.isCorrect === true;
    } else if (currentItem.type === 'bucket-sort') {
      const assignments = currentAnswer || {};
      isCorrect = currentItem.data.items.every(
        (item: any) => assignments[item.id] === item.targetBucket
      );
    } else if (currentItem.type === 'matching') {
      const matches = currentAnswer || {};
      isCorrect = currentItem.data.pairs.every(
        (pair: any) => matches[pair.id] === pair.right
      );
    } else if (currentItem.type === 'multi-select') {
      const selectedList: string[] = currentAnswer || [];
      const correctIds = currentItem.data.options
        .filter((o: any) => o.isCorrect)
        .map((o: any) => o.id);
      isCorrect =
        selectedList.length === correctIds.length &&
        correctIds.every((id: string) => selectedList.includes(id));
    } else if (currentItem.type === 'true-false') {
      isCorrect = currentAnswer === currentItem.data.correctAnswer;
    } else if (currentItem.type === 'ordering') {
      const list: string[] =
        currentAnswer || currentItem.data.initialShuffled;
      isCorrect =
        JSON.stringify(list) === JSON.stringify(currentItem.data.correctOrder);
    }

    setCorrectFlags((prev) => {
      const updated = { ...prev, [currentIndex]: isCorrect };
      const totalCorrect = Object.values(updated).filter(Boolean).length;
      onUpdateScore(totalCorrect);
      return updated;
    });

    setSubmittedCurrent(true);

    if (isCorrect) {
      playCorrectSound();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {
        // Confetti fallback
      }
    } else {
      playIncorrectSound();
    }
  };

  const handleNext = () => {
    setSubmittedCurrent(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setAnswersState({});
    setSubmittedCurrent(false);
    setCorrectFlags({});
    onUpdateScore(0);
  };

  const totalCompleted = Object.keys(correctFlags).length;
  const totalCorrect = Object.values(correctFlags).filter(Boolean).length;

  if (isFinished) {
    return (
      <div className="bg-white border-2 border-emerald-200 rounded-3xl p-8 max-w-xl mx-auto text-center space-y-6 shadow-md my-8">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 flex items-center justify-center text-4xl shadow-inner">
          🏆
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#20352B]">
            Chúc Mừng Em Đã Hoàn Thành Luyện Tập!
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Em đã xuất sắc trả lời đúng {totalCorrect}/{PRACTICE_ACTIVITIES.length} thử thách nhanh trí.
          </p>
        </div>

        <div className="p-4 bg-[#FFF9EA] border border-amber-200 rounded-2xl flex items-center justify-around">
          <div>
            <span className="block text-2xl font-black text-emerald-600">
              {Math.round((totalCorrect / PRACTICE_ACTIVITIES.length) * 100)}%
            </span>
            <span className="text-xs font-bold text-slate-500">Tỉ lệ chính xác</span>
          </div>
          <div className="h-8 w-px bg-amber-200" />
          <div>
            <span className="block text-2xl font-black text-amber-600">
              +{totalCorrect * 10}
            </span>
            <span className="text-xs font-bold text-slate-500">Điểm kinh nghiệm</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleRestart}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border-2 border-slate-200 font-bold text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Luyện tập lại</span>
          </button>
          <button
            type="button"
            onClick={onGoToSimulations}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#22B573] hover:bg-[#1caa68] font-black text-xs text-white flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
          >
            <span>Sang phần Thí nghiệm vui</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const isCurrentCorrect = correctFlags[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-2.5 pb-6">
      {/* Header bar */}
      <div className="bg-white border border-emerald-100 rounded-2xl p-2.5 sm:p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 bg-amber-50 text-amber-800 rounded-lg mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Thử tài nhanh trí · Thử thách {currentIndex + 1}/{PRACTICE_ACTIVITIES.length}</span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-[#20352B]">
            {currentItem.title}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {currentItem.instruction}
          </p>
        </div>

        {/* Progress pills */}
        <div className="flex items-center gap-1">
          {PRACTICE_ACTIVITIES.map((_, idx) => {
            const hasAnswered = idx in correctFlags;
            const ok = correctFlags[idx];
            return (
              <div
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'ring-2 ring-emerald-500 scale-125 bg-emerald-400'
                    : hasAnswered
                    ? ok
                      ? 'bg-emerald-500'
                      : 'bg-rose-400'
                    : 'bg-slate-200'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Interactive Card based on type */}
      <div className="bg-white border border-emerald-100 rounded-2xl p-3.5 sm:p-5 shadow-2xs space-y-3">
        {/* TYPE 1: Single choice */}
        {currentItem.type === 'single-choice' && (
          <div className="space-y-3">
            {currentItem.data.options.map((opt: any) => {
              const isSelected = currentAnswer === opt.id;
              let btnStyle = 'border-slate-200 bg-white hover:border-slate-300';
              if (submittedCurrent) {
                if (opt.isCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                } else if (isSelected) {
                  btnStyle = 'border-rose-300 bg-rose-50 text-rose-800';
                }
              } else if (isSelected) {
                btnStyle = 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200';
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={submittedCurrent}
                  onClick={() => handleSingleChoice(opt.id)}
                  className={`w-full p-4 rounded-2xl border-2 text-left text-sm font-semibold transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt.text}</span>
                  {submittedCurrent && opt.isCorrect && (
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                  )}
                  {submittedCurrent && isSelected && !opt.isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* TYPE 2: Bucket sort */}
        {currentItem.type === 'bucket-sort' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentItem.data.buckets.map((bucket: any) => {
                const assignedItems = currentItem.data.items.filter(
                  (it: any) => (currentAnswer || {})[it.id] === bucket.id
                );
                return (
                  <div
                    key={bucket.id}
                    className={`p-4 rounded-2xl border-2 ${bucket.color} min-h-[160px] flex flex-col`}
                  >
                    <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 mb-3 flex items-center justify-between">
                      <span>{bucket.label}</span>
                      <span className="text-[11px] font-bold px-2 py-0.5 bg-white rounded-md">
                        {assignedItems.length} mục
                      </span>
                    </h4>
                    <div className="space-y-2 flex-1">
                      {assignedItems.map((it: any) => (
                        <div
                          key={it.id}
                          className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-between shadow-2xs"
                        >
                          <span>{it.text}</span>
                          {!submittedCurrent && (
                            <button
                              type="button"
                              onClick={() => handleBucketSort(it.id, '')}
                              className="text-slate-400 hover:text-rose-500 text-xs font-bold px-1"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      {assignedItems.length === 0 && (
                        <p className="text-xs text-slate-400 text-center py-6 italic">
                          Chạm vào các ý bên dưới để đưa vào hộp này
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Unassigned items palette */}
            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Các nguyên nhân cần phân loại (Bấm để chuyển nhóm):
              </span>
              <div className="flex flex-wrap gap-2">
                {currentItem.data.items.map((it: any) => {
                  const currentBucket = (currentAnswer || {})[it.id];
                  return (
                    <div
                      key={it.id}
                      className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium flex items-center gap-2"
                    >
                      <span className="text-slate-800 font-semibold">{it.text}</span>
                      {!submittedCurrent && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleBucketSort(it.id, 'human')}
                            className={`px-2 py-1 rounded-md text-[10px] font-extrabold ${
                              currentBucket === 'human'
                                ? 'bg-orange-500 text-white'
                                : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            Người
                          </button>
                          <button
                            type="button"
                            onClick={() => handleBucketSort(it.id, 'nature')}
                            className={`px-2 py-1 rounded-md text-[10px] font-extrabold ${
                              currentBucket === 'nature'
                                ? 'bg-blue-500 text-white'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            Tự nhiên
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TYPE 3: Matching */}
        {currentItem.type === 'matching' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 font-medium italic">
              Chọn hiện tượng thích hợp cho từng tác hại:
            </p>
            {currentItem.data.pairs.map((pair: any) => {
              const selectedValue = (currentAnswer || {})[pair.id];
              return (
                <div
                  key={pair.id}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 flex-1">
                    • {pair.left}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={submittedCurrent}
                      onClick={() => handleMatching(pair.id, 'Ô nhiễm đất')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        selectedValue === 'Ô nhiễm đất'
                          ? 'bg-orange-500 text-white border-orange-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      Ô nhiễm đất
                    </button>
                    <button
                      type="button"
                      disabled={submittedCurrent}
                      onClick={() => handleMatching(pair.id, 'Xói mòn đất')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        selectedValue === 'Xói mòn đất'
                          ? 'bg-blue-500 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      Xói mòn đất
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TYPE 4: Multi-select */}
        {currentItem.type === 'multi-select' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentItem.data.options.map((opt: any) => {
              const isSelected = (currentAnswer || []).includes(opt.id);
              let style = isSelected
                ? 'border-[#22B573] bg-emerald-50/80 ring-2 ring-emerald-200'
                : 'border-slate-200 bg-white hover:border-slate-300';
              if (submittedCurrent) {
                if (opt.isCorrect) {
                  style = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                } else if (isSelected && !opt.isCorrect) {
                  style = 'border-rose-300 bg-rose-50 text-rose-800';
                }
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={submittedCurrent}
                  onClick={() => handleMultiSelect(opt.id)}
                  className={`p-4 rounded-2xl border-2 text-left text-xs sm:text-sm font-semibold transition-all flex items-start gap-3 ${style}`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-[#22B573] text-white'
                        : 'border-2 border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                  </div>
                  <span>{opt.text}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* TYPE 5: True / False */}
        {currentItem.type === 'true-false' && (
          <div className="space-y-6">
            <div className="p-6 bg-amber-50/70 border border-amber-200 rounded-2xl text-center">
              <span className="text-xs font-black uppercase text-amber-800 tracking-wider block mb-2">
                Nhận định cần đánh giá:
              </span>
              <p className="text-base sm:text-lg font-bold text-[#20352B] leading-relaxed">
                "{currentItem.data.statement}"
              </p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                disabled={submittedCurrent}
                onClick={() => handleTrueFalse(true)}
                className={`w-36 py-3.5 rounded-2xl border-2 text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
                  currentAnswer === true
                    ? 'border-emerald-500 bg-emerald-500 text-white shadow-md'
                    : 'border-slate-300 bg-white text-slate-800 hover:border-slate-400'
                }`}
              >
                <span>👍 ĐÚNG</span>
              </button>
              <button
                type="button"
                disabled={submittedCurrent}
                onClick={() => handleTrueFalse(false)}
                className={`w-36 py-3.5 rounded-2xl border-2 text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
                  currentAnswer === false
                    ? 'border-rose-500 bg-rose-500 text-white shadow-md'
                    : 'border-slate-300 bg-white text-slate-800 hover:border-slate-400'
                }`}
              >
                <span>👎 SAI</span>
              </button>
            </div>
          </div>
        )}

        {/* TYPE 6: Ordering */}
        {currentItem.type === 'ordering' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 font-medium italic">
              Sử dụng nút mũi tên Lên / Xuống để sắp xếp đúng thứ tự:
            </p>
            {(currentAnswer || currentItem.data.initialShuffled).map(
              (step: string, idx: number, arr: string[]) => (
                <div
                  key={step}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">
                      {step}
                    </span>
                  </div>

                  {!submittedCurrent && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleOrderMove(idx, 'up')}
                        className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === arr.length - 1}
                        onClick={() => handleOrderMove(idx, 'down')}
                        className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        )}

        {/* Feedback area */}
        {submittedCurrent && (
          <div
            className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 ${
              isCurrentCorrect
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-amber-50 text-amber-900 border-amber-300'
            }`}
          >
            {isCurrentCorrect ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <strong className="block text-sm font-extrabold mb-1">
                {isCurrentCorrect
                  ? 'Chính xác! Bạn thật xuất sắc!'
                  : 'Chưa chính xác rồi! Chúng mình cùng đọc giải thích nhé:'}
              </strong>
              <p className="font-medium leading-relaxed">{currentItem.explanation}</p>
            </div>
          </div>
        )}

        {/* Action button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400">
            Điểm: {totalCorrect}/{totalCompleted} câu đúng
          </span>

          {!submittedCurrent ? (
            <button
              type="button"
              onClick={checkAnswer}
              className="px-6 py-2.5 bg-[#22B573] hover:bg-[#1caa68] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
            >
              Kiểm tra câu trả lời
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-[#45B8F5] hover:bg-[#34a5e0] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span>{currentIndex < PRACTICE_ACTIVITIES.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

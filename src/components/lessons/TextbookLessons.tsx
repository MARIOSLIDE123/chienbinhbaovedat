import React, { useState } from 'react';
import { LESSON_TOPICS } from '../../data/learningContent';
import { ImageZoomModal } from '../common/ImageZoomModal';
import { playCorrectSound, playIncorrectSound } from '../../utils/soundEffects';
import {
  CheckCircle,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Award,
  ZoomIn,
  Eye,
} from 'lucide-react';

import imgPollution from '../../assets/images/lesson-1-soil-pollution.png';
import imgErosion from '../../assets/images/lesson-2-soil-erosion.jpg';
import imgProtection from '../../assets/images/lesson-3-soil-protection.jpg';

const LESSON_IMAGE_MAP: Record<string, string> = {
  'soil-pollution': imgPollution,
  'soil-erosion': imgErosion,
  'soil-protection': imgProtection,
};

interface TextbookLessonsProps {
  completedLessons: string[];
  onCompleteLesson: (lessonId: string) => void;
  onGoToArena: () => void;
}

export const TextbookLessons: React.FC<TextbookLessonsProps> = ({
  completedLessons,
  onCompleteLesson,
  onGoToArena,
}) => {
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [quickAnswer, setQuickAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const topic = LESSON_TOPICS[selectedTopicIndex];
  const isCompleted = completedLessons.includes(topic.id);
  const currentImageSrc = LESSON_IMAGE_MAP[topic.id] || topic.image.src;

  const handleSelectTopic = (index: number) => {
    setSelectedTopicIndex(index);
    setQuickAnswer(null);
    setShowExplanation(false);
  };

  const handleQuickAnswer = (index: number) => {
    setQuickAnswer(index);
    setShowExplanation(true);
    if (index === topic.quickCheck.correctIndex) {
      playCorrectSound();
    } else {
      playIncorrectSound();
    }
  };

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* Top Topic Switcher Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {LESSON_TOPICS.map((item, idx) => {
          const active = selectedTopicIndex === idx;
          const done = completedLessons.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectTopic(idx)}
              className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                active
                  ? 'border-[#22B573] bg-[#FFF9EA] shadow-md scale-[1.01]'
                  : 'border-slate-200 bg-white hover:border-emerald-300'
              }`}
            >
              <div>
                <span className="text-xs sm:text-sm font-black text-[#22B573] uppercase tracking-wider block mb-1">
                  {item.badge}
                </span>
                <h3 className="text-base sm:text-lg font-black text-[#20352B]">
                  {item.title.split(': ')[1]}
                </h3>
              </div>
              {done ? (
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <CheckCircle className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center shrink-0 text-sm font-bold text-slate-400">
                  {idx + 1}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Lesson Viewport */}
      <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs space-y-7">
        {/* Header of topic */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg mb-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Khoa học Lớp 5 · Bài 2</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#20352B] tracking-tight">
              {topic.title}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-medium mt-1.5 leading-relaxed">
              {topic.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            {/* "Em đã hiểu bài" button */}
            <button
              type="button"
              onClick={() => onCompleteLesson(topic.id)}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm sm:text-base font-extrabold transition-all shadow-xs ${
                isCompleted
                  ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300'
                  : 'bg-[#22B573] hover:bg-[#1caa68] text-white hover:shadow-md'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              <span>{isCompleted ? '✓ Em đã hiểu bài' : 'Đánh dấu Em đã hiểu'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* REAL-WORLD OBSERVATION PHOTO WITH ZOOM (BÀI HỌC 1, 2, 3) */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 border-2 border-emerald-100/80 rounded-2xl p-4 sm:p-6 shadow-xs">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* Interactive Image Container with Zoom Trigger */}
            <div
              onClick={() => setIsZoomOpen(true)}
              className="relative group w-full lg:w-1/2 aspect-video overflow-hidden rounded-2xl bg-slate-900 cursor-pointer shadow-md border-2 border-slate-200 transition-all hover:shadow-xl hover:border-emerald-400"
            >
              <img
                src={currentImageSrc}
                alt={topic.image.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-colors flex flex-col justify-between p-3.5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600/90 backdrop-blur-xs text-white text-xs font-black uppercase tracking-wider shadow-sm">
                    <Eye className="w-3.5 h-3.5" />
                    {topic.badge} · Ảnh quan sát
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-emerald-300 text-xs font-bold">
                    <ZoomIn className="w-3.5 h-3.5" />
                    Bấm để phóng to
                  </span>
                </div>

                <div className="text-white text-xs sm:text-sm font-bold drop-shadow-md">
                  {topic.image.caption}
                </div>
              </div>
            </div>

            {/* Observation Description & Guide */}
            <div className="w-full lg:w-1/2 space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="text-lg sm:text-xl font-black text-[#20352B]">
                  {topic.image.caption}
                </h4>
              </div>

              <div className="bg-white/95 p-4 rounded-xl border border-emerald-200 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 text-xs sm:text-sm font-black uppercase tracking-wide">
                  <span>🔬</span>
                  <span>Góc nhìn quan sát khoa học dành cho học sinh:</span>
                </div>
                <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
                  {topic.image.observationTip}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsZoomOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-sm font-black shadow-sm hover:shadow-md transition-all"
              >
                <ZoomIn className="w-4 h-4" />
                <span>Phóng to toàn màn hình để quan sát chi tiết</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Groups of Visual Illustrations for Theme 1 */}
        {topic.id === 'soil-pollution' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 bg-orange-50/70 border border-orange-200/80 rounded-2xl text-center">
              <div className="w-14 h-14 mx-auto mb-2 rounded-xl bg-orange-100 text-3xl flex items-center justify-center">
                🗑️
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-orange-950">1. Bãi rác tự phát</h4>
              <p className="text-xs sm:text-sm text-orange-800/85 mt-1">Túi nilon, pin cũ chôn lấp sai quy định</p>
            </div>
            <div className="p-4 bg-red-50/70 border border-red-200/80 rounded-2xl text-center">
              <div className="w-14 h-14 mx-auto mb-2 rounded-xl bg-red-100 text-3xl flex items-center justify-center">
                🌋
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-red-950">2. Núi lửa phun trào</h4>
              <p className="text-xs sm:text-sm text-red-800/85 mt-1">Nguyên nhân tự nhiên: tro bụi và khoáng độc hại</p>
            </div>
            <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-center">
              <div className="w-14 h-14 mx-auto mb-2 rounded-xl bg-blue-100 text-3xl flex items-center justify-center">
                🏭
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-blue-950">3. Nước thải ngấm đất</h4>
              <p className="text-xs sm:text-sm text-blue-800/85 mt-1">Nước thải nhà máy chưa qua xử lí thấm sâu</p>
            </div>
            <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-center">
              <div className="w-14 h-14 mx-auto mb-2 rounded-xl bg-emerald-100 text-3xl flex items-center justify-center">
                🧪
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-emerald-950">4. Phun thuốc trừ sâu</h4>
              <p className="text-xs sm:text-sm text-emerald-800/85 mt-1">Lạm dụng hóa chất bảo vệ thực vật trên ruộng</p>
            </div>
          </div>
        )}

        {/* Mechanism explanation for Theme 2 (Soil Erosion: Roots hold soil, Canopy softens raindrops, Grass traps runoff) */}
        {topic.id === 'soil-erosion' && (
          <div className="p-5 bg-gradient-to-r from-blue-50 via-emerald-50 to-amber-50 border border-blue-200 rounded-2xl">
            <h4 className="text-base sm:text-lg font-black text-[#20352B] mb-3 flex items-center gap-2">
              <span className="text-xl">🌿</span>
              <span>Vì sao rừng cây giữ được đất chống xói mòn?</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-sm font-semibold text-slate-700">
              <div className="p-4 bg-white/95 rounded-xl border border-blue-100 shadow-2xs">
                <span className="text-[#45B8F5] font-black block text-base mb-1.5">1. Tán cây xòe rộng</span>
                Làm giảm tốc độ và lực rơi trực tiếp của từng hạt mưa giông xuống mặt đất.
              </div>
              <div className="p-4 bg-white/95 rounded-xl border border-emerald-100 shadow-2xs">
                <span className="text-[#22B573] font-black block text-base mb-1.5">2. Bộ rễ chằng chịt</span>
                Đan cài như chiếc lưới thép vô hình bện chặt và cố định các hạt đất lại với nhau.
              </div>
              <div className="p-4 bg-white/95 rounded-xl border border-amber-100 shadow-2xs">
                <span className="text-[#FF944D] font-black block text-base mb-1.5">3. Thảm cỏ & mùn</span>
                Ngăn dòng chảy siết, giữ lại nước mưa thấm từ từ vào lòng đất nuôi dưỡng mạch ngầm.
              </div>
            </div>
          </div>
        )}

        {/* Section Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {topic.sections.map((sec, sIdx) => {
            const isFull = sec.type === 'concept';
            return (
              <div
                key={sIdx}
                className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                  isFull ? 'md:col-span-2 bg-[#FFFDF7] border-amber-200 shadow-2xs' : 'bg-white border-slate-200'
                }`}
              >
                <h4 className="text-base sm:text-lg font-black text-[#20352B] mb-2.5 flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22B573]" />
                  <span>{sec.heading}</span>
                </h4>
                {sec.subheading && (
                  <p className="text-xs sm:text-sm font-bold text-slate-500 mb-3 italic">
                    {sec.subheading}
                  </p>
                )}
                <ul className="space-y-2.5">
                  {sec.items.map((it, iIdx) => (
                    <li key={iIdx} className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed flex items-start gap-2.5">
                      <span className="text-emerald-500 font-black shrink-0 mt-0.5">•</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Real-life Scenario: "Tình huống thực tế" */}
        <div className="p-5 sm:p-6 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3.5">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">💡</span>
            <h4 className="text-base sm:text-lg font-black text-[#20352B]">
              {topic.realSituation.title}
            </h4>
          </div>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
            <strong>Bối cảnh:</strong> {topic.realSituation.scenario}
          </p>
          <div className="p-4 bg-white rounded-xl border border-amber-200/80 text-sm sm:text-base text-slate-800 space-y-1.5">
            <span className="font-bold text-amber-800 block">
              Câu hỏi: {topic.realSituation.question}
            </span>
            <span className="text-emerald-800 font-medium block">
              <strong>Gợi ý cách xử lí thông minh:</strong> {topic.realSituation.solution}
            </span>
          </div>
        </div>

        {/* Quick Check Question with Sound Effects */}
        <div className="p-6 sm:p-7 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              <h4 className="text-base sm:text-lg font-black text-[#20352B]">
                Kiểm Tra Nhanh Khắc Sâu Bài Học
              </h4>
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-500">Chọn 1 đáp án đúng</span>
          </div>

          <p className="text-base sm:text-lg font-bold text-slate-800">
            {topic.quickCheck.question}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topic.quickCheck.options.map((opt, optIdx) => {
              const isSelected = quickAnswer === optIdx;
              const isCorrect = optIdx === topic.quickCheck.correctIndex;
              let style = 'border-slate-200 bg-white hover:border-emerald-300';
              if (showExplanation) {
                if (isCorrect) {
                  style = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold shadow-2xs';
                } else if (isSelected) {
                  style = 'border-rose-300 bg-rose-50 text-rose-800';
                }
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleQuickAnswer(optIdx)}
                  className={`p-3.5 sm:p-4 rounded-xl border-2 text-left text-sm sm:text-base font-semibold transition-all ${style}`}
                >
                  <span className="font-extrabold mr-2">
                    {String.fromCharCode(65 + optIdx)}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div
              className={`p-4 rounded-xl text-sm sm:text-base flex items-start gap-3 ${
                quickAnswer === topic.quickCheck.correctIndex
                  ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-300'
                  : 'bg-amber-50 text-amber-800 border-2 border-amber-300'
              }`}
            >
              {quickAnswer === topic.quickCheck.correctIndex ? (
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <strong className="block mb-1 text-base sm:text-lg">
                  {quickAnswer === topic.quickCheck.correctIndex
                    ? '🎉 Chính xác! Bạn thật thông minh!'
                    : '💡 Chưa chính xác rồi, cùng xem lời giải thích nhé:'}
                </strong>
                <span className="font-medium leading-relaxed">{topic.quickCheck.explanation}</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation bottom buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-slate-100">
          <button
            type="button"
            disabled={selectedTopicIndex === 0}
            onClick={() => handleSelectTopic(selectedTopicIndex - 1)}
            className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none rounded-xl text-sm font-bold text-slate-700 flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Chủ đề trước</span>
          </button>

          {selectedTopicIndex < LESSON_TOPICS.length - 1 ? (
            <button
              type="button"
              onClick={() => handleSelectTopic(selectedTopicIndex + 1)}
              className="w-full sm:w-auto px-6 py-3 bg-[#22B573] hover:bg-[#1caa68] rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span>Tiếp tục: Chủ đề {selectedTopicIndex + 2}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onGoToArena}
              className="w-full sm:w-auto px-7 py-3 bg-rose-500 hover:bg-rose-600 rounded-xl text-sm sm:text-base font-black text-white flex items-center justify-center gap-2 transition-colors shadow-md shadow-rose-500/20"
            >
              <span>Vào Đấu Trường Trí Tuệ (20 câu)</span>
              <Award className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Image Zoom Modal Component */}
      <ImageZoomModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        imageSrc={currentImageSrc}
        imageAlt={topic.image.alt}
        caption={topic.image.caption}
        observationTip={topic.image.observationTip}
        topicTitle={topic.title}
      />
    </div>
  );
};

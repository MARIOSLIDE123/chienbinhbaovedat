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
  Camera,
  Search,
  Shield,
  Lightbulb,
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

type SubTabKey = 'overview' | 'causes' | 'effects' | 'solutions' | 'quiz';

export const TextbookLessons: React.FC<TextbookLessonsProps> = ({
  completedLessons,
  onCompleteLesson,
  onGoToArena,
}) => {
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [currentSubTab, setCurrentSubTab] = useState<SubTabKey>('overview');
  const [quickAnswer, setQuickAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const topic = LESSON_TOPICS[selectedTopicIndex];
  const isCompleted = completedLessons.includes(topic.id);
  const currentImageSrc = LESSON_IMAGE_MAP[topic.id] || topic.image.src;

  const handleSelectTopic = (index: number) => {
    setSelectedTopicIndex(index);
    setCurrentSubTab('overview');
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

  // Group sections by subtab
  const conceptSections = topic.sections.filter((s) => s.type === 'concept');
  const causesSections = topic.sections.filter((s) => s.type === 'causes');
  const effectsSections = topic.sections.filter((s) => s.type === 'effects');
  const solutionsSections = topic.sections.filter((s) => s.type === 'solutions');

  const subTabs = [
    { key: 'overview', label: '1. Khái niệm & Ảnh thực tế', icon: Camera },
    { key: 'causes', label: '2. Nguyên nhân', icon: Search },
    { key: 'effects', label: '3. Tác hại', icon: AlertCircle },
    { key: 'solutions', label: '4. Biện pháp', icon: Shield },
    { key: 'quiz', label: '5. Tình huống & Kiểm tra', icon: Lightbulb },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-3 pb-6">
      {/* 1. Top 3 Topics Switcher (Compact horizontal tabs) */}
      <div className="grid grid-cols-3 gap-2">
        {LESSON_TOPICS.map((item, idx) => {
          const active = selectedTopicIndex === idx;
          const done = completedLessons.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectTopic(idx)}
              className={`p-2 sm:p-2.5 rounded-xl border-2 text-left transition-all flex items-center justify-between gap-1.5 ${
                active
                  ? 'border-[#22B573] bg-[#FFF9EA] shadow-2xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="min-w-0">
                <span className="text-[10px] font-black text-[#22B573] uppercase tracking-wider block leading-tight">
                  {item.badge}
                </span>
                <h3 className="text-xs sm:text-sm font-black text-[#20352B] truncate">
                  {item.title.split(': ')[1]}
                </h3>
              </div>
              {done ? (
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center shrink-0 text-[10px] font-bold text-slate-400">
                  {idx + 1}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 2. Main Lesson Card */}
      <div className="bg-white border border-emerald-100 rounded-2xl p-3 sm:p-5 shadow-2xs space-y-3">
        {/* Header of topic: Title & "Em đã hiểu bài" button */}
        <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#22B573] uppercase">{topic.badge}</span>
              <span className="text-slate-300">·</span>
              <h2 className="text-sm sm:text-base font-black text-[#20352B]">
                {topic.title}
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium line-clamp-1">
              {topic.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onCompleteLesson(topic.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-[#22B573] hover:bg-[#1caa68] text-white shadow-2xs'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{isCompleted ? '✓ Đã hiểu bài' : 'Đánh dấu đã hiểu'}</span>
          </button>
        </div>

        {/* 3. Sub-tabs Navigation (One screen - One mission) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-slate-100">
          {subTabs.map((st) => {
            const isActive = currentSubTab === st.key;
            const Icon = st.icon;
            return (
              <button
                key={st.key}
                type="button"
                onClick={() => setCurrentSubTab(st.key as SubTabKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{st.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW & REAL-WORLD PHOTO WITH ZOOM MODAL        */}
        {/* ========================================================= */}
        {currentSubTab === 'overview' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {/* Concept text box */}
            {conceptSections.map((sec, idx) => (
              <div key={idx} className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                <span className="font-black text-amber-900 block">{sec.heading}</span>
                <p className="leading-relaxed font-medium">{sec.items.join(' ')}</p>
              </div>
            ))}

            {/* Photo & Zoom trigger */}
            <div className="bg-gradient-to-br from-slate-50 to-emerald-50/40 border border-emerald-100 rounded-xl p-3 flex flex-col sm:flex-row items-center gap-3.5">
              <div
                onClick={() => setIsZoomOpen(true)}
                className="relative group w-full sm:w-1/2 aspect-video overflow-hidden rounded-xl bg-slate-900 cursor-pointer shadow-xs border border-slate-200 shrink-0"
              >
                <img
                  src={currentImageSrc}
                  alt={topic.image.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-xs text-white text-xs font-bold shadow-md">
                    <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Phóng to quan sát</span>
                  </span>
                </div>
              </div>

              <div className="w-full sm:w-1/2 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#20352B]">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  <span>{topic.image.caption}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium bg-white/90 p-2.5 rounded-lg border border-emerald-100">
                  <strong className="text-emerald-800">Gợi ý quan sát: </strong>
                  {topic.image.observationTip}
                </p>
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Mở kính lúp soi chi tiết ảnh</span>
                </button>
              </div>
            </div>

            {/* Illustrations row */}
            {topic.id === 'soil-pollution' && (
              <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                <div className="p-2 bg-orange-50 border border-orange-200 rounded-xl">
                  <span className="text-lg block">🗑️</span>
                  <span className="text-[11px] font-bold text-orange-950 block">Rác thải</span>
                </div>
                <div className="p-2 bg-red-50 border border-red-200 rounded-xl">
                  <span className="text-lg block">🌋</span>
                  <span className="text-[11px] font-bold text-red-950 block">Núi lửa</span>
                </div>
                <div className="p-2 bg-blue-50 border border-blue-200 rounded-xl">
                  <span className="text-lg block">🏭</span>
                  <span className="text-[11px] font-bold text-blue-950 block">Nước thải</span>
                </div>
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="text-lg block">🧪</span>
                  <span className="text-[11px] font-bold text-emerald-950 block">Thuốc BVTV</span>
                </div>
              </div>
            )}
            {topic.id === 'soil-erosion' && (
              <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs">
                <span className="font-black text-blue-950 block mb-1">🌿 Sức mạnh giữ đất của rừng:</span>
                <div className="grid grid-cols-3 gap-2 text-[11px] font-medium text-slate-700">
                  <div className="p-1.5 bg-white rounded-lg">1. Tán cây cản bớt lực giọt mưa</div>
                  <div className="p-1.5 bg-white rounded-lg">2. Rễ cây bện chặt cố định đất</div>
                  <div className="p-1.5 bg-white rounded-lg">3. Thảm cỏ ngăn dòng chảy xiết</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: NGUYÊN NHÂN                                        */}
        {/* ========================================================= */}
        {currentSubTab === 'causes' && (
          <div className="space-y-2.5 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {causesSections.map((sec, idx) => (
                <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-2xs">
                  <h4 className="text-xs sm:text-sm font-black text-[#20352B] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    <span>{sec.heading}</span>
                  </h4>
                  {sec.subheading && (
                    <p className="text-[11px] font-bold text-slate-500 italic">{sec.subheading}</p>
                  )}
                  <ul className="space-y-1">
                    {sec.items.map((it, iIdx) => (
                      <li key={iIdx} className="text-xs text-slate-700 font-medium leading-relaxed flex items-start gap-1.5">
                        <span className="text-orange-500 font-bold shrink-0">•</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: TÁC HẠI                                            */}
        {/* ========================================================= */}
        {currentSubTab === 'effects' && (
          <div className="space-y-2.5 animate-in fade-in duration-150">
            {effectsSections.map((sec, idx) => (
              <div key={idx} className="p-3 bg-rose-50/40 border border-rose-200 rounded-xl space-y-1.5">
                <h4 className="text-xs sm:text-sm font-black text-rose-950 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>{sec.heading}</span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sec.items.map((it, iIdx) => (
                    <li key={iIdx} className="text-xs text-slate-800 font-medium p-2 bg-white rounded-lg border border-rose-100 flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold shrink-0">•</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: BIỆN PHÁP                                          */}
        {/* ========================================================= */}
        {currentSubTab === 'solutions' && (
          <div className="space-y-2.5 animate-in fade-in duration-150">
            {solutionsSections.map((sec, idx) => (
              <div key={idx} className="p-3 bg-emerald-50/40 border border-emerald-200 rounded-xl space-y-1.5">
                <h4 className="text-xs sm:text-sm font-black text-emerald-950 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{sec.heading}</span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sec.items.map((it, iIdx) => (
                    <li key={iIdx} className="text-xs text-slate-800 font-medium p-2 bg-white rounded-lg border border-emerald-100 flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold shrink-0">✓</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: TÌNH HUỐNG THỰC TẾ & KIỂM TRA NHANH                */}
        {/* ========================================================= */}
        {currentSubTab === 'quiz' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {/* Real situation box */}
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-black text-amber-950">
                <span>💡</span>
                <span>{topic.realSituation.title}</span>
              </div>
              <p className="text-slate-700 font-medium leading-relaxed">
                <strong>Bối cảnh:</strong> {topic.realSituation.scenario}
              </p>
              <div className="p-2 bg-white rounded-lg border border-amber-200/80 text-emerald-900 font-medium">
                <strong>Gợi ý cách xử lí thông minh:</strong> {topic.realSituation.solution}
              </div>
            </div>

            {/* Quick check question */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#20352B] flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                  Kiểm tra nhanh khắc sâu bài học:
                </span>
                <span className="text-[10px] text-slate-400 font-bold">Chọn 1 đáp án</span>
              </div>

              <p className="text-xs sm:text-sm font-bold text-slate-800">
                {topic.quickCheck.question}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {topic.quickCheck.options.map((opt, optIdx) => {
                  const isSelected = quickAnswer === optIdx;
                  const isCorrect = optIdx === topic.quickCheck.correctIndex;
                  let style = 'border-slate-200 bg-white hover:border-slate-300';
                  if (showExplanation) {
                    if (isCorrect) {
                      style = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                    } else if (isSelected) {
                      style = 'border-rose-300 bg-rose-50 text-rose-800';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleQuickAnswer(optIdx)}
                      className={`p-2 rounded-lg border text-left text-xs font-medium transition-all ${style}`}
                    >
                      <span className="font-bold mr-1">{String.fromCharCode(65 + optIdx)}.</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div
                  className={`p-2 rounded-lg text-xs flex items-start gap-1.5 ${
                    quickAnswer === topic.quickCheck.correctIndex
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-amber-50 text-amber-900 border border-amber-200'
                  }`}
                >
                  {quickAnswer === topic.quickCheck.correctIndex ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <p className="leading-snug">
                    <strong>{quickAnswer === topic.quickCheck.correctIndex ? 'Chính xác! ' : 'Chưa đúng rồi! '}</strong>
                    {topic.quickCheck.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. Bottom Navigation Strip */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            type="button"
            disabled={selectedTopicIndex === 0}
            onClick={() => handleSelectTopic(selectedTopicIndex - 1)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Chủ đề trước</span>
          </button>

          {selectedTopicIndex < LESSON_TOPICS.length - 1 ? (
            <button
              type="button"
              onClick={() => handleSelectTopic(selectedTopicIndex + 1)}
              className="px-4 py-1.5 bg-[#22B573] hover:bg-[#1caa68] rounded-xl text-xs font-bold text-white flex items-center gap-1 transition-colors shadow-2xs"
            >
              <span>Chủ đề {selectedTopicIndex + 2}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onGoToArena}
              className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 rounded-xl text-xs font-black text-white flex items-center gap-1 shadow-xs transition-colors"
            >
              <span>Vào Đấu Trường (20 câu)</span>
              <Award className="w-3.5 h-3.5" />
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

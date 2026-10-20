import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

export interface CaptainEarthProps {
  mood?: 'greeting' | 'cheer' | 'thinking' | 'encouraging' | 'winner' | 'teaching';
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSpeechBubble?: boolean;
  className?: string;
}

export const CaptainEarth: React.FC<CaptainEarthProps> = ({
  mood = 'greeting',
  message,
  size = 'md',
  showSpeechBubble = true,
  className = '',
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const defaultMessages: Record<string, string> = {
    greeting: 'Xin chào chiến binh nhí! Mình là Đội trưởng Đất Xanh. Hãy cùng nhau bảo vệ mái nhà Trái Đất nhé!',
    cheer: 'Tuyệt vời lắm bạn ơi! Đúng chuẩn Chiến Binh Bảo Vệ Đất xuất sắc!',
    thinking: 'Hãy suy nghĩ thật kỹ nhé! Tán cây và rễ cây giữ đất như thế nào nhỉ?',
    encouraging: 'Đừng lo lắng nhé! Thất bại là mẹ thành công, chúng mình cùng thử lại nào!',
    winner: 'Hoan hô! Bạn đã xuất sắc giành được Huy hiệu Chiến Binh Tối Cao!',
    teaching: 'Đất là cái nôi của sự sống! Cùng nhau khám phá bí mật của lòng đất nào!',
  };

  const currentMessage = message || defaultMessages[mood] || defaultMessages.greeting;

  const speakMessage = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentMessage);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.95; // slightly gentle pace for kids
      utterance.pitch = 1.1; // friendly voice
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-44 h-44',
    xl: 'w-56 h-56',
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center gap-4 ${className}`}>
      {/* Cartoon Mascot SVG */}
      <div className={`relative shrink-0 select-none ${sizeClasses[size]}`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-md transition-transform duration-300 hover:scale-105"
        >
          {/* Subtle Ambient Glow */}
          <circle cx="100" cy="108" r="74" fill="#22B573" opacity="0.15" />
          
          {/* Globe Body: Ocean Blue */}
          <circle cx="100" cy="108" r="68" fill="#45B8F5" stroke="#1A8BBF" strokeWidth="4" />

          {/* Green Continents on Globe */}
          <path
            d="M52 85 C60 70, 75 72, 85 80 C95 88, 105 82, 115 88 C125 94, 120 115, 110 125 C100 135, 80 138, 70 130 C60 122, 45 100, 52 85 Z"
            fill="#22B573"
            stroke="#168051"
            strokeWidth="2"
          />
          <path
            d="M125 75 C135 70, 150 78, 155 90 C160 102, 148 112, 140 110 C132 108, 130 95, 125 75 Z"
            fill="#22B573"
            stroke="#168051"
            strokeWidth="2"
          />
          <path
            d="M80 145 C95 140, 115 142, 125 152 C120 162, 100 168, 85 162 C75 158, 72 148, 80 145 Z"
            fill="#22B573"
            stroke="#168051"
            strokeWidth="2"
          />

          {/* Rosy Cheeks */}
          <ellipse cx="68" cy="118" rx="8" ry="5" fill="#FF944D" opacity="0.6" />
          <ellipse cx="132" cy="118" rx="8" ry="5" fill="#FF944D" opacity="0.6" />

          {/* Sparkling Big Eyes */}
          {/* Left Eye */}
          <ellipse cx="78" cy="104" rx="7" ry="10" fill="#20352B" />
          <circle cx="76" cy="100" r="3" fill="#FFFFFF" />
          <circle cx="80" cy="107" r="1.5" fill="#FFFFFF" />

          {/* Right Eye (winks on cheer, normal otherwise) */}
          {mood === 'cheer' || mood === 'winner' ? (
            <path
              d="M115 106 Q122 96 129 106"
              fill="none"
              stroke="#20352B"
              strokeWidth="4"
              strokeLinecap="round"
            />
          ) : (
            <>
              <ellipse cx="122" cy="104" rx="7" ry="10" fill="#20352B" />
              <circle cx="120" cy="100" r="3" fill="#FFFFFF" />
              <circle cx="124" cy="107" r="1.5" fill="#FFFFFF" />
            </>
          )}

          {/* Cheerful Smiling Mouth */}
          {mood === 'cheer' || mood === 'winner' ? (
            <path
              d="M86 118 Q100 138 114 118 Z"
              fill="#E11D48"
              stroke="#20352B"
              strokeWidth="3"
            />
          ) : mood === 'thinking' ? (
            <ellipse cx="100" cy="122" rx="6" ry="6" fill="#20352B" />
          ) : (
            <path
              d="M88 118 Q100 132 112 118"
              fill="none"
              stroke="#20352B"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}

          {/* Captain Explorer Hat */}
          <path
            d="M60 56 Q100 40 140 56 Q150 62 135 68 Q100 60 65 68 Q50 62 60 56 Z"
            fill="#FFD447"
            stroke="#D4A72C"
            strokeWidth="3"
          />
          <path
            d="M72 54 C74 32, 126 32, 128 54 Z"
            fill="#FFD447"
            stroke="#D4A72C"
            strokeWidth="3"
          />
          {/* Hat Emblem: Green Leaf Badge */}
          <circle cx="100" cy="48" r="9" fill="#22B573" stroke="#FFFFFF" strokeWidth="2" />
          <path
            d="M100 42 C104 45, 105 50, 100 54 C95 50, 96 45, 100 42 Z"
            fill="#FFFFFF"
          />

          {/* Left Hand: Waving Joyfully */}
          <g className="animate-pulse">
            <path
              d="M34 112 Q20 95 24 82 Q32 82 38 95"
              fill="#FFFFFF"
              stroke="#20352B"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {/* White Explorer Glove Finger details */}
            <circle cx="25" cy="85" r="5" fill="#FFFFFF" stroke="#20352B" strokeWidth="2" />
          </g>

          {/* Right Hand: Holding Fresh Plant Sprout */}
          <g>
            <path
              d="M166 112 Q178 100 172 88 Q164 90 160 102"
              fill="#FFFFFF"
              stroke="#20352B"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {/* Plant Sprout Stem */}
            <path
              d="M172 88 Q174 72 176 60"
              fill="none"
              stroke="#15803D"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Left Leaf */}
            <path
              d="M176 68 Q162 64 166 56 Q174 58 176 68 Z"
              fill="#22B573"
              stroke="#15803D"
              strokeWidth="1.5"
            />
            {/* Right Leaf */}
            <path
              d="M176 62 Q188 56 186 48 Q178 52 176 62 Z"
              fill="#4ADE80"
              stroke="#15803D"
              strokeWidth="1.5"
            />
          </g>

          {/* Sturdy Little Boots */}
          <ellipse cx="78" cy="180" rx="14" ry="8" fill="#854D0E" stroke="#533009" strokeWidth="2.5" />
          <ellipse cx="122" cy="180" rx="14" ry="8" fill="#854D0E" stroke="#533009" strokeWidth="2.5" />
        </svg>

        {/* Small floating badge */}
        {(mood === 'winner' || mood === 'cheer') && (
          <div className="absolute -top-1 -right-1 bg-yellow-400 text-amber-900 rounded-full p-1.5 shadow-md animate-bounce">
            <Sparkles className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Comic Speech Bubble */}
      {showSpeechBubble && (
        <div className="relative bg-white border-2 border-[#22B573]/30 rounded-2xl p-4 shadow-sm max-w-lg text-[#20352B]">
          {/* Arrow pointing to mascot */}
          <div className="hidden sm:block absolute -left-2.5 top-6 w-5 h-5 bg-white border-l-2 border-b-2 border-[#22B573]/30 rotate-45" />

          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm text-[#22B573] tracking-wide uppercase">
                  Đội trưởng Đất Xanh
                </span>
                <span className="text-xs text-slate-400">· Hướng dẫn viên</span>
              </div>
              <p className="text-base text-slate-700 leading-relaxed font-medium">
                {currentMessage}
              </p>
            </div>

            {/* Read-Aloud Voice Button */}
            {'speechSynthesis' in window && (
              <button
                type="button"
                onClick={speakMessage}
                title={isSpeaking ? 'Dừng đọc' : 'Đội trưởng đọc to cho em nghe'}
                className={`shrink-0 p-2 rounded-xl transition-all ${
                  isSpeaking
                    ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-400'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

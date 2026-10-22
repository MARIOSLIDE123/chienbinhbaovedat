import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

export interface CaptainEarthProps {
  mood?: 'greeting' | 'cheer' | 'thinking' | 'encouraging' | 'winner' | 'teaching';
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSpeechBubble?: boolean;
  className?: string;
  isJumping?: boolean;
}

export const CaptainEarth: React.FC<CaptainEarthProps> = ({
  mood = 'greeting',
  message,
  size = 'md',
  showSpeechBubble = true,
  className = '',
  isJumping = true,
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
      {/* Cartoon Mascot Animated Wrapper */}
      <div className={`relative shrink-0 select-none flex flex-col items-center justify-center ${sizeClasses[size]}`}>
        {/* Animated Jumping Container */}
        <div className={`w-full h-full relative ${isJumping ? 'animate-mascot-jump' : ''}`}>
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-lg transition-transform duration-300 hover:scale-105"
          >
            {/* Subtle Ambient Glow */}
            <circle cx="100" cy="108" r="74" fill="#22B573" opacity="0.18" />

            {/* SUPERHERO WARRIOR CAPE (Behind body) */}
            <g className="origin-top">
              {/* Left Cape Wing */}
              <path
                d="M50 96 C30 128, 28 165, 42 182 C56 182, 68 174, 76 166 C62 144, 54 118, 50 96 Z"
                fill="#047857"
                stroke="#F59E0B"
                strokeWidth="2.5"
              />
              {/* Right Cape Wing */}
              <path
                d="M150 96 C170 128, 172 165, 158 182 C144 182, 132 174, 124 166 C138 144, 146 118, 150 96 Z"
                fill="#047857"
                stroke="#F59E0B"
                strokeWidth="2.5"
              />
              {/* Cape Inner Lining Highlight */}
              <path
                d="M44 175 C52 176, 62 170, 70 164"
                stroke="#FDE047"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M156 175 C148 176, 138 170, 130 164"
                stroke="#FDE047"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </g>

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
            <ellipse cx="68" cy="116" rx="8" ry="5" fill="#FF944D" opacity="0.6" />
            <ellipse cx="132" cy="116" rx="8" ry="5" fill="#FF944D" opacity="0.6" />

            {/* Sparkling Big Eyes */}
            {/* Left Eye */}
            <ellipse cx="78" cy="103" rx="7" ry="10" fill="#20352B" />
            <circle cx="76" cy="99" r="3" fill="#FFFFFF" />
            <circle cx="80" cy="106" r="1.5" fill="#FFFFFF" />

            {/* Right Eye (winks on cheer, normal otherwise) */}
            {mood === 'cheer' || mood === 'winner' ? (
              <path
                d="M115 105 Q122 95 129 105"
                fill="none"
                stroke="#20352B"
                strokeWidth="4"
                strokeLinecap="round"
              />
            ) : (
              <>
                <ellipse cx="122" cy="103" rx="7" ry="10" fill="#20352B" />
                <circle cx="120" cy="99" r="3" fill="#FFFFFF" />
                <circle cx="124" cy="106" r="1.5" fill="#FFFFFF" />
              </>
            )}

            {/* Cheerful Smiling Mouth */}
            {mood === 'cheer' || mood === 'winner' ? (
              <path
                d="M86 117 Q100 136 114 117 Z"
                fill="#E11D48"
                stroke="#20352B"
                strokeWidth="3"
              />
            ) : mood === 'thinking' ? (
              <ellipse cx="100" cy="120" rx="6" ry="6" fill="#20352B" />
            ) : (
              <path
                d="M88 117 Q100 130 112 117"
                fill="none"
                stroke="#20352B"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            )}

            {/* ========================================================= */}
            {/* WARRIOR ARMOR SUIT (BỘ ÁO GIÁP CHIẾN BINH BẢO VỆ ĐẤT)     */}
            {/* ========================================================= */}

            {/* Left Shoulder Pauldron (Giáp vai trái bọc vàng) */}
            <g>
              <path
                d="M48 86 C32 84, 26 100, 36 112 C46 114, 54 106, 56 94 Z"
                fill="#059669"
                stroke="#F59E0B"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Pauldron Layer Trim */}
              <path
                d="M34 94 C38 102, 44 106, 52 104"
                stroke="#FDE047"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="44" cy="98" r="2.5" fill="#FDE047" />
            </g>

            {/* Right Shoulder Pauldron (Giáp vai phải bọc vàng) */}
            <g>
              <path
                d="M152 86 C168 84, 174 100, 164 112 C154 114, 146 106, 144 94 Z"
                fill="#059669"
                stroke="#F59E0B"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Pauldron Layer Trim */}
              <path
                d="M166 94 C162 102, 156 106, 148 104"
                stroke="#FDE047"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="156" cy="98" r="2.5" fill="#FDE047" />
            </g>

            {/* Armored Chestplate / Cuirass (Giáp ngực Hiệp Sĩ Xanh) */}
            <g>
              {/* Outer Golden Rimmed Armor Plate */}
              <path
                d="M65 130 C76 125, 124 125, 135 130 C144 148, 138 171, 122 173 C100 176, 78 174, 64 171 C56 148, 60 135, 65 130 Z"
                fill="#047857"
                stroke="#F59E0B"
                strokeWidth="3.2"
                strokeLinejoin="round"
              />
              {/* Inner Armored Segment */}
              <path
                d="M72 135 C82 130, 118 130, 128 135 C134 150, 128 166, 116 168 C100 170, 84 169, 72 166 C66 150, 68 138, 72 135 Z"
                fill="#065F46"
                stroke="#10B981"
                strokeWidth="1.5"
              />
              {/* Armor Collar / Gorget Plate */}
              <path
                d="M78 128 C90 133, 110 133, 122 128 L119 135 C109 139, 91 139, 81 135 Z"
                fill="#F59E0B"
                stroke="#B45309"
                strokeWidth="1"
              />

              {/* Glowing High-Tech Earth Warrior Energy Core (Lõi Năng Lượng Đất Mẹ) */}
              <circle cx="100" cy="151" r="14" fill="#064E3B" stroke="#F59E0B" strokeWidth="2.5" />
              <circle cx="100" cy="151" r="10" fill="#10B981" />
              <circle cx="100" cy="151" r="6" fill="#FDE047" className="animate-pulse" />
              {/* Eco Crystal Star Emblem */}
              <path
                d="M100 144 L102 149 L107 151 L102 153 L100 158 L98 153 L93 151 L98 149 Z"
                fill="#FFFFFF"
              />
              
              {/* Segmented Abdominal Armor Plates */}
              <path
                d="M82 163 C94 165, 106 165, 118 163"
                stroke="#F59E0B"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>

            {/* Captain Explorer & Warrior Helmet Crest */}
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
            {/* Golden Warrior Crest Feather / Spire */}
            <path
              d="M96 32 L100 20 L104 32 Z"
              fill="#F59E0B"
              stroke="#B45309"
              strokeWidth="1.5"
            />
            {/* Hat Emblem: Green Leaf Hero Badge */}
            <circle cx="100" cy="48" r="9" fill="#22B573" stroke="#FFFFFF" strokeWidth="2" />
            <path
              d="M100 42 C104 45, 105 50, 100 54 C95 50, 96 45, 100 42 Z"
              fill="#FFFFFF"
            />

            {/* Left Hand: Armored Bracer & Waving Hand */}
            <g className="animate-pulse">
              <path
                d="M34 112 Q20 95 24 82 Q32 82 38 95"
                fill="#FFFFFF"
                stroke="#20352B"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              {/* Armored Golden Gauntlet Band */}
              <rect
                x="24"
                y="92"
                width="14"
                height="5"
                rx="2"
                fill="#F59E0B"
                stroke="#B45309"
                strokeWidth="1"
                transform="rotate(-25 31 94)"
              />
              <circle cx="25" cy="85" r="5" fill="#FFFFFF" stroke="#20352B" strokeWidth="2" />
            </g>

            {/* Right Hand: Armored Bracer & Holding Fresh Plant Sprout */}
            <g>
              <path
                d="M166 112 Q178 100 172 88 Q164 90 160 102"
                fill="#FFFFFF"
                stroke="#20352B"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              {/* Armored Golden Gauntlet Band */}
              <rect
                x="162"
                y="94"
                width="14"
                height="5"
                rx="2"
                fill="#F59E0B"
                stroke="#B45309"
                strokeWidth="1"
                transform="rotate(25 169 96)"
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

            {/* Armored Warrior Boots (Ủng giáp hiệp sĩ bọc vàng) */}
            <g>
              {/* Left Boot */}
              <path
                d="M66 176 C66 172, 90 172, 90 176 L92 185 C92 188, 64 188, 64 185 Z"
                fill="#047857"
                stroke="#064E3B"
                strokeWidth="2"
              />
              {/* Left Boot Gold Plate */}
              <ellipse cx="78" cy="184" rx="13" ry="5" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
              <rect x="73" y="174" width="10" height="4" rx="2" fill="#FDE047" />

              {/* Right Boot */}
              <path
                d="M110 176 C110 172, 134 172, 134 176 L136 185 C136 188, 108 188, 108 185 Z"
                fill="#047857"
                stroke="#064E3B"
                strokeWidth="2"
              />
              {/* Right Boot Gold Plate */}
              <ellipse cx="122" cy="184" rx="13" ry="5" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
              <rect x="117" y="174" width="10" height="4" rx="2" fill="#FDE047" />
            </g>
          </svg>

          {/* Small floating badge */}
          {(mood === 'winner' || mood === 'cheer') && (
            <div className="absolute -top-1 -right-1 bg-yellow-400 text-amber-900 rounded-full p-1.5 shadow-md animate-bounce">
              <Sparkles className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Dynamic Ground Shadow that scales as Captain Earth jumps */}
        {isJumping && (
          <div className="w-16 h-2.5 bg-emerald-950/25 rounded-full blur-[2px] mt-1 animate-mascot-shadow" />
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
                  Đội trưởng Đất Xanh ⚡ Chiến Binh
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

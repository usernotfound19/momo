import React, { useState } from 'react';
import { Volume2, VolumeX, Heart } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { UserPersonalization } from '../types';

interface HeaderProps {
  personalization: UserPersonalization;
}

export const Header: React.FC<HeaderProps> = ({
  personalization,
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.getIsMuted());

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FFFDF9]/90 border-b border-[#F5E6E3] transition-all">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Romantic Monogram */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#FFEAE8] border border-[#F4BBB5] flex items-center justify-center text-[#991b1b] shadow-xs">
            <Heart className="w-4 h-4 fill-[#e11d48] text-[#e11d48]" />
          </div>
          <div>
            <div className="font-serif-elegant font-bold text-base sm:text-lg text-[#2d2424] tracking-wide flex items-center gap-1.5 leading-tight">
              <span>{personalization.herName}</span>
              <span className="text-[#be123c] font-script-romantic text-lg sm:text-xl font-normal">&amp;</span>
              <span>{personalization.hisName}</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#8C7A78] leading-none mt-0.5">
              Forever from my heart
            </p>
          </div>
        </div>

        {/* Right Action button: Soothing Music Toggle only */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleSound}
            aria-label="Toggle soothing music"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              !isMuted
                ? 'bg-[#FFE4E6] text-[#be123c] border border-[#FDA4AF] shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border border-stone-200'
            }`}
          >
            {!isMuted ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#be123c] animate-pulse" />
                <span className="text-xs font-semibold">Music: On 🎵</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-stone-500" />
                <span className="text-xs">Music: Off</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

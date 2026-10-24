import React, { useState } from 'react';
import { Volume2, VolumeX, Heart, Settings } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { UserPersonalization } from '../types';

interface HeaderProps {
  personalization: UserPersonalization;
  isAdmin: boolean;
  onOpenCustomizer: () => void;
  onToggleAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  personalization,
  isAdmin,
  onOpenCustomizer,
  onToggleAdmin,
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
          <div
            onClick={onToggleAdmin}
            title={isAdmin ? 'Admin Mode active (Click to toggle)' : 'Forever in my heart'}
            className="w-9 h-9 rounded-full bg-[#FFEAE8] border border-[#F4BBB5] flex items-center justify-center text-[#991b1b] shadow-xs cursor-pointer hover:scale-105 transition-transform"
          >
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

        {/* Right Action buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Chime Ambient Player */}
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

          {/* Edit Details: ONLY visible in Admin Mode for Kawshik */}
          {isAdmin && (
            <button
              onClick={() => {
                soundManager.playGentleChime(523.25, 0.4);
                onOpenCustomizer();
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#991b1b] hover:bg-[#7f1d1d] text-white shadow-sm transition-all cursor-pointer ring-2 ring-rose-300"
              title="Only you can see this"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

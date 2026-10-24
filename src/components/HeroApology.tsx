import React from 'react';
import { Heart, Sparkles, ArrowDown, Mail } from 'lucide-react';
import { UserPersonalization } from '../types';
import { soundManager } from '../utils/audio';

interface HeroApologyProps {
  personalization: UserPersonalization;
  onScrollToBouquet: () => void;
  onScrollToLetter: () => void;
  onScrollToDecision: () => void;
}

export const HeroApology: React.FC<HeroApologyProps> = ({
  personalization,
  onScrollToBouquet,
  onScrollToLetter,
  onScrollToDecision,
}) => {
  return (
    <section className="relative pt-10 pb-16 sm:py-20 md:py-24 px-4 overflow-hidden">
      {/* Decorative radial ambient backdrops */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[320px] bg-gradient-to-b from-[#FCE7E7]/60 via-[#FFF1F2]/30 to-transparent blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center">
        {/* Soft tag badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0F2] border border-[#FBCFE8] text-[#9f1239] text-xs sm:text-sm font-medium mb-6 shadow-xs animate-float">
          <Sparkles className="w-3.5 h-3.5 text-[#e11d48]" />
          <span>For Dearest {personalization.herName}, from my deepest heart</span>
          <span className="text-[#e11d48]">♥</span>
        </div>

        {/* Main headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif-elegant font-bold text-[#2d2020] leading-[1.2] tracking-tight mb-5">
          I am truly, deeply <span className="italic font-normal text-[#991b1b]">sorry</span>, <br />
          and I want to make things right with you
        </h1>

        {/* Narrative text */}
        <p className="text-sm sm:text-base md:text-lg text-[#5c4947] max-w-xl mx-auto leading-relaxed font-normal mb-8 px-2">
          I let foolish anger speak instead of love and brought up breaking up—words I deeply regret.
          Anger is fleeting, but my love for you is forever. Losing you would break my entire world.
        </p>

        {/* Note Card */}
        <div className="relative max-w-xl mx-auto mb-8 p-5 sm:p-7 rounded-3xl glass-card shadow-xl shadow-rose-900/5 text-left border border-[#F3D5D2]">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#FFEAE8] border border-[#F5B5AF] flex-shrink-0 flex items-center justify-center text-[#991b1b] shadow-inner">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-[#be123c]" />
            </div>
            <div className="space-y-1.5 flex-1 min-w-0">
              <span className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-[#be123c] block">
                My Sincere Confession
              </span>
              <p className="text-xs sm:text-sm md:text-base text-[#443331] italic font-serif-elegant leading-relaxed break-words">
                "{personalization.personalCustomNote}"
              </p>
              <div className="pt-2 flex items-center justify-between text-xs text-[#8c7471]">
                <span className="font-medium">— {personalization.hisName}</span>
                <span className="text-[11px] bg-[#FFF0F2] px-2.5 py-0.5 rounded-full border border-[#FED7AA]">
                  {personalization.specialDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button Navigation Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-3.5">
          <button
            onClick={() => {
              soundManager.playGentleChime(587.33);
              onScrollToBouquet();
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-gradient-to-r from-[#be123c] to-[#9f1239] hover:from-[#9f1239] hover:to-[#881337] text-white font-medium text-sm sm:text-base shadow-lg shadow-rose-900/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>💐</span>
            <span>See Your Bouquets</span>
            <ArrowDown className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              soundManager.playGentleChime(523.25);
              onScrollToLetter();
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-[#FFF5F5] text-[#422d2b] border border-[#E9CFCB] font-medium text-sm sm:text-base shadow-xs hover:border-[#D9A6A0] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>💌</span>
            <span>Read Apology Letter</span>
          </button>

          <button
            onClick={() => {
              soundManager.playGentleChime(659.25);
              onScrollToDecision();
            }}
            className="w-full sm:w-auto px-5 py-3.5 rounded-full bg-[#FFF0F3] hover:bg-[#FFE2E8] text-[#be123c] border border-[#FECDD3] font-medium text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-[#be123c]" />
            <span>Do You Forgive Me?</span>
          </button>
        </div>
      </div>
    </section>
  );
};

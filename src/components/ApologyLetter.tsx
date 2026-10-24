import React, { useState } from 'react';
import { MailOpen, Copy, Check, Heart } from 'lucide-react';
import { UserPersonalization } from '../types';
import { soundManager } from '../utils/audio';

interface ApologyLetterProps {
  personalization: UserPersonalization;
}

export const ApologyLetter: React.FC<ApologyLetterProps> = ({
  personalization,
}) => {
  const [copied, setCopied] = useState(false);

  const letterTextEn = `Dearest ${personalization.herName},

I know a simple "I'm sorry" cannot instantly erase the hurt of reckless words or heal the ache in your heart. But today, with all stubborn ego set aside, I am standing before you to ask for your forgiveness.

What I said in that heated moment of anger—and bringing up the thought of breaking up—was the most foolish mistake of my life. I let frustration cloud my judgment and hurt the one person who means everything to me. The truth is, my world has no warmth, color, or peace without you.

The thought of losing you shook me to my core. I learned that what we have is infinitely more precious than any foolish argument.

Here are my three solemn promises to you:
1. I will never, under any circumstance, make impulsive breakup threats again.
2. Whenever disagreements arise, I will pause, breathe, look into your eyes, and remember you are my home—never my opponent.
3. I will cherish, respect, and listen to you with the gentleness and emotional maturity you truly deserve.

Take all the time you need. Be upset with me, hold me accountable—just please don’t let a moment of foolish anger tear apart what we have spent so long creating.

Forever yours,
${personalization.hisName}`;

  const handleCopy = () => {
    soundManager.playGentleChime(659.25, 0.4);
    navigator.clipboard.writeText(letterTextEn);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section id="letter" className="py-14 sm:py-20 md:py-24 px-4 bg-[#FFF8F7]/60">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFE4E6] text-[#be123c] text-xs font-semibold uppercase tracking-wider mb-3">
            <MailOpen className="w-3.5 h-3.5" />
            <span>Unsealed From The Heart</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif-elegant font-bold text-[#2d2424] mb-3">
            A Letter of Sincere Apology
          </h2>
          <p className="text-xs sm:text-sm text-[#735c59]">
            Written with utmost sincerity, choosing you over pride.
          </p>
        </div>

        {/* Envelope Paper Card */}
        <div className="relative bg-[#FFFDF8] rounded-3xl p-6 sm:p-10 md:p-12 border border-[#E8D4D0] shadow-2xl shadow-rose-950/8 transition-all">
          {/* Decorative Corner accents */}
          <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-[#D9A6A0]/60 rounded-tl-xs pointer-events-none" />
          <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-[#D9A6A0]/60 rounded-tr-xs pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-[#D9A6A0]/60 rounded-bl-xs pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-[#D9A6A0]/60 rounded-br-xs pointer-events-none" />

          {/* Letter Header */}
          <div className="border-b border-[#F2DDD9] pb-5 mb-5 flex items-center justify-between gap-4">
            <div>
              <span className="font-script-romantic text-2xl sm:text-4xl text-[#991b1b] block">
                Dearest {personalization.herName}
              </span>
              <span className="text-[11px] sm:text-xs text-[#8c7471] block mt-0.5">
                {personalization.specialDate}
              </span>
            </div>

            {/* Wax seal emblem */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full wax-seal flex items-center justify-center text-white font-serif-elegant font-bold text-lg shadow-md border border-red-300/40 shrink-0">
              <Heart className="w-5 h-5 fill-white text-white" />
            </div>
          </div>

          {/* Body Content */}
          <div className="font-serif-elegant text-sm sm:text-base md:text-lg text-[#3d2f2d] leading-relaxed whitespace-pre-line space-y-4">
            {letterTextEn}
          </div>

          {/* Action Footer */}
          <div className="mt-8 pt-5 border-t border-[#F2DDD9] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] sm:text-xs text-[#8c7471] italic text-center sm:text-left">
              You can copy this letter to keep or share anytime
            </span>

            <button
              onClick={handleCopy}
              className="w-full sm:w-auto px-4 py-2 rounded-full bg-[#FFF0F2] hover:bg-[#FFE0E4] border border-[#FBCFE8] text-[#9f1239] text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Letter</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

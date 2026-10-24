/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FallingPetals } from './components/FallingPetals';
import { Header } from './components/Header';
import { HeroApology } from './components/HeroApology';
import { BouquetShowcase } from './components/BouquetShowcase';
import { ApologyLetter } from './components/ApologyLetter';
import { ReasonsAndMemories } from './components/ReasonsAndMemories';
import { LoveCoupons } from './components/LoveCoupons';
import { ForgiveMeSection } from './components/ForgiveMeSection';
import { INITIAL_PERSONALIZATION } from './data/mockData';
import { UserPersonalization } from './types';
import { Heart, Share2, Check } from 'lucide-react';
import { soundManager } from './utils/audio';

export default function App() {
  const [personalization, setPersonalization] = useState<UserPersonalization>(() => {
    try {
      const saved = localStorage.getItem('apology_personalization');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PERSONALIZATION;
  });

  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('apology_personalization', JSON.stringify(personalization));
    } catch {
      // fallback
    }
  }, [personalization]);

  // Audio start listener on first interaction (ensures mobile browser audio unlocks)
  useEffect(() => {
    const handleFirstGesture = () => {
      soundManager.startAmbientChimes();
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };

    window.addEventListener('click', handleFirstGesture);
    window.addEventListener('touchstart', handleFirstGesture);

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShareLink = () => {
    soundManager.playGentleChime(523.25, 0.3);
    const cleanUrl = window.location.origin + window.location.pathname;

    if (navigator.share) {
      navigator.share({
        title: `A message for ${personalization.herName}`,
        text: `Dearest ${personalization.herName}, please open this letter from ${personalization.hisName}... 🌸`,
        url: cleanUrl,
      }).catch(() => {
        // user cancelled
      });
    } else {
      navigator.clipboard.writeText(cleanUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2D2424] relative selection:bg-[#FFE4E6] selection:text-[#991b1b]">
      {/* Falling romantic petals canvas background */}
      <FallingPetals active={true} />

      {/* Navigation Header */}
      <Header
        personalization={personalization}
      />

      <main>
        {/* 1. Hero with heartfelt apology & wax seal note */}
        <HeroApology
          personalization={personalization}
          onScrollToBouquet={() => handleScrollTo('bouquets')}
          onScrollToLetter={() => handleScrollTo('letter')}
        />

        {/* 2. Curated & Custom Bouquet Showcase */}
        <BouquetShowcase
          personalization={personalization}
          onBouquetChosen={() => {}}
        />

        {/* 3. Sincere Unsealed Apology Letter */}
        <ApologyLetter
          personalization={personalization}
        />

        {/* 4. Memories & Reasons Why She is Irreplaceable */}
        <ReasonsAndMemories
          personalization={personalization}
        />

        {/* 5. Love & Apology Coupons */}
        <LoveCoupons
          personalization={personalization}
        />

        {/* 6. The Grand Finale: "Do you forgive me now?" with dodging No and Happy Happy Happy Cat */}
        <ForgiveMeSection
          personalization={personalization}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#F2DDD9] bg-[#FFF8F7] py-12 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="w-10 h-10 mx-auto rounded-full bg-[#FFE4E6] border border-[#FDA4AF] flex items-center justify-center text-[#be123c]">
            <Heart className="w-5 h-5 fill-[#be123c] text-[#be123c]" />
          </div>

          <p className="font-serif-elegant font-bold text-lg sm:text-xl text-[#2d2424]">
            Forever and always, {personalization.herName}
          </p>

          <p className="text-xs sm:text-sm text-[#735c59] max-w-md mx-auto italic font-serif-elegant leading-relaxed">
            "True love isn't about being flawless—it's about learning from mistakes, shedding silly ego, and choosing to cherish each other every single day."
          </p>

          {/* Clean footer action: only Share link, NO lock icon or edit options */}
          <div className="pt-2 flex items-center justify-center">
            <button
              onClick={handleShareLink}
              className="px-5 py-2.5 rounded-full bg-white hover:bg-[#FFF5F5] border border-[#E8D4D0] text-xs sm:text-sm font-semibold text-[#5c4947] flex items-center gap-2 cursor-pointer shadow-xs hover:border-[#DDA59E] transition-all"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-[#be123c]" />
                  <span>Share Website Link</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] sm:text-xs text-[#a89390] pt-2">
            Crafted with genuine love &bull; A heartfelt apology from {personalization.hisName}
          </p>
        </div>
      </footer>
    </div>
  );
}

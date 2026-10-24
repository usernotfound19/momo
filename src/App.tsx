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
import { CustomizerModal } from './components/CustomizerModal';
import { INITIAL_PERSONALIZATION } from './data/mockData';
import { UserPersonalization } from './types';
import { Heart, Share2, Check, Lock, ShieldCheck, Eye, Settings } from 'lucide-react';
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

  // Admin Mode detection: Activated if URL has ?admin=true or previously authenticated by Kawshik
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true' || params.get('edit') === 'true') {
        return true;
      }
      const savedAdmin = localStorage.getItem('is_admin_mode');
      if (savedAdmin === 'true') return true;
    } catch {
      // fallback
    }
    return false;
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('apology_personalization', JSON.stringify(personalization));
    } catch {
      // fallback
    }
  }, [personalization]);

  useEffect(() => {
    try {
      localStorage.setItem('is_admin_mode', isAdmin ? 'true' : 'false');
    } catch {
      // fallback
    }
  }, [isAdmin]);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShareLink = () => {
    soundManager.playGentleChime(523.25, 0.3);
    // Strip admin params so girlfriend always gets the pure, clean view!
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

  const toggleAdmin = () => {
    setIsAdmin((prev) => !prev);
    soundManager.playGentleChime(587.33, 0.3);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2D2424] relative selection:bg-[#FFE4E6] selection:text-[#991b1b]">
      {/* Falling romantic petals canvas background */}
      <FallingPetals active={true} />

      {/* Admin Floating Control Pill (ONLY visible when Kawshik is logged in as Admin) */}
      {isAdmin && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-[#1c1917]/90 text-white backdrop-blur-md px-4 py-2 rounded-full shadow-2xl border border-stone-700 flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Admin Active</span>
          </span>
          <span className="text-stone-400 hidden sm:inline">|</span>
          <span className="text-stone-300 hidden sm:inline">Girlfriend won't see edit tools</span>
          <button
            onClick={() => setIsCustomizerOpen(true)}
            className="px-2.5 py-1 rounded-full bg-[#be123c] hover:bg-[#9f1239] text-white font-medium cursor-pointer flex items-center gap-1"
          >
            <Settings className="w-3 h-3" />
            <span>Edit Details</span>
          </button>
          <button
            onClick={() => setIsAdmin(false)}
            className="px-2.5 py-1 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer flex items-center gap-1"
            title="Preview what she sees"
          >
            <Eye className="w-3 h-3" />
            <span>Girlfriend View</span>
          </button>
        </div>
      )}

      {/* Navigation Header */}
      <Header
        personalization={personalization}
        isAdmin={isAdmin}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onScrollToDecision={() => handleScrollTo('decision')}
        onToggleAdmin={toggleAdmin}
      />

      <main>
        {/* Hero with heartfelt apology & wax seal */}
        <HeroApology
          personalization={personalization}
          onScrollToBouquet={() => handleScrollTo('bouquets')}
          onScrollToLetter={() => handleScrollTo('letter')}
          onScrollToDecision={() => handleScrollTo('decision')}
        />

        {/* Curated & Custom Bouquet Showcase */}
        <BouquetShowcase
          personalization={personalization}
          onBouquetChosen={() => {}}
        />

        {/* Sincere Unsealed Apology Letter */}
        <ApologyLetter
          personalization={personalization}
        />

        {/* Memories & Reasons Why She is Irreplaceable */}
        <ReasonsAndMemories
          personalization={personalization}
          isAdmin={isAdmin}
        />

        {/* Love & Apology Coupons */}
        <LoveCoupons
          personalization={personalization}
        />

        {/* The Playful & Sincere Decision: "Do you forgive me now?" with dodging No and Happy Cat */}
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

          <div className="pt-3 flex items-center justify-center gap-3">
            <button
              onClick={handleShareLink}
              className="px-4 py-2 rounded-full bg-white hover:bg-[#FFF5F5] border border-[#E8D4D0] text-xs font-semibold text-[#5c4947] flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#be123c]" />
                  <span>Share Website Link</span>
                </>
              )}
            </button>

            {/* Secret discreet Admin Trigger for Kawshik in footer */}
            {!isAdmin ? (
              <button
                onClick={() => {
                  setIsAdmin(true);
                  soundManager.playGentleChime(659.25, 0.3);
                }}
                className="text-[11px] text-stone-400 hover:text-stone-600 p-2 rounded-full cursor-pointer flex items-center gap-1 opacity-40 hover:opacity-100 transition-opacity"
                title="Admin Unlock"
              >
                <Lock className="w-3 h-3" />
              </button>
            ) : (
              <button
                onClick={() => setIsCustomizerOpen(true)}
                className="px-3.5 py-2 rounded-full bg-[#FFE4E6] text-[#9f1239] text-xs font-semibold hover:bg-[#FED7AA] cursor-pointer"
              >
                Edit Names / Note
              </button>
            )}
          </div>

          <p className="text-[10px] sm:text-[11px] text-[#a89390] pt-2">
            Crafted with genuine love &bull; A heartfelt apology from {personalization.hisName}
          </p>
        </div>
      </footer>

      {/* Edit Names & Details Modal (Kawshik only) */}
      <CustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        personalization={personalization}
        onSave={(updated) => setPersonalization(updated)}
        onExitAdmin={() => setIsAdmin(false)}
      />
    </div>
  );
}

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
import { Heart, Share2, Check, Lock, ShieldCheck, Eye, Settings, Smartphone, Monitor } from 'lucide-react';
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

  // Phone Simulator Frame Toggle (Allows Kawshik to preview mobile view directly on computer)
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);

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

  // Audio start listener on first interaction (ensures browser audio unlocks)
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

  const toggleAdmin = () => {
    setIsAdmin((prev) => !prev);
    soundManager.playGentleChime(587.33, 0.3);
  };

  // The core content of the application
  const mainContent = (
    <div className="w-full relative min-h-screen">
      {/* Falling romantic petals canvas background */}
      <FallingPetals active={true} />

      {/* Navigation Header */}
      <Header
        personalization={personalization}
        isAdmin={isAdmin}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onToggleAdmin={toggleAdmin}
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
          isAdmin={isAdmin}
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
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2D2424] relative selection:bg-[#FFE4E6] selection:text-[#991b1b]">
      {/* Admin Floating Control Pill (ONLY visible when Kawshik is in Admin Mode) */}
      {isAdmin && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-[#1c1917]/90 text-white backdrop-blur-md px-4 py-2 rounded-full shadow-2xl border border-stone-700 flex items-center gap-2.5 sm:gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Admin</span>
          </span>

          {/* Phone View Simulator Button */}
          <button
            onClick={() => {
              setIsPhoneFrame(!isPhoneFrame);
              soundManager.playGentleChime(523.25, 0.2);
            }}
            className={`px-3 py-1 rounded-full font-medium cursor-pointer flex items-center gap-1.5 transition-all ${
              isPhoneFrame
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
            }`}
            title="Toggle Smartphone Frame Preview"
          >
            {isPhoneFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span>Full View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>Phone Preview</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsCustomizerOpen(true)}
            className="px-2.5 py-1 rounded-full bg-[#be123c] hover:bg-[#9f1239] text-white font-medium cursor-pointer flex items-center gap-1"
          >
            <Settings className="w-3 h-3" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => setIsAdmin(false)}
            className="px-2.5 py-1 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer flex items-center gap-1"
            title="Preview what she sees"
          >
            <Eye className="w-3 h-3" />
            <span className="hidden sm:inline">Girlfriend View</span>
          </button>
        </div>
      )}

      {/* Render either directly or inside Phone Simulator Frame */}
      {isPhoneFrame ? (
        <div className="min-h-screen bg-stone-900 py-6 sm:py-10 flex flex-col items-center justify-center px-2">
          {/* Top helper title */}
          <div className="mb-4 text-center text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800 text-xs text-rose-300 border border-stone-700">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Phone Screen Simulator (iPhone / Galaxy)</span>
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Scroll inside the phone frame below to test the exact touch view your girlfriend will experience!
            </p>
          </div>

          {/* Realistic Phone Mockup Chassis */}
          <div className="w-[390px] max-w-[96vw] h-[820px] max-h-[88vh] bg-[#FFFDF9] rounded-[48px] border-[10px] border-stone-800 shadow-2xl overflow-hidden relative flex flex-col ring-1 ring-white/10">
            {/* Phone Dynamic Island / Camera Notch */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-stone-800/80 mr-2" />
              <div className="w-2 h-2 rounded-full bg-stone-900" />
            </div>

            {/* Scrollable phone screen area */}
            <div className="w-full flex-1 overflow-y-auto overflow-x-hidden pt-4">
              {mainContent}
            </div>

            {/* Bottom Home Indicator Bar */}
            <div className="w-full h-4 bg-transparent flex items-center justify-center pointer-events-none pb-1">
              <div className="w-32 h-1 bg-stone-300 rounded-full" />
            </div>
          </div>
        </div>
      ) : (
        /* Full Standard View (automatically scales to native mobile screens or desktops) */
        mainContent
      )}

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

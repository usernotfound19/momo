import React, { useState, useRef } from 'react';
import { Heart, Sparkles, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserPersonalization } from '../types';
import { soundManager } from '../utils/audio';

interface ForgiveMeSectionProps {
  personalization: UserPersonalization;
}

export const ForgiveMeSection: React.FC<ForgiveMeSectionProps> = ({
  personalization,
}) => {
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isForgiven, setIsForgiven] = useState(false);
  const [isPlayingHappyMusic, setIsPlayingHappyMusic] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const noPhrases = [
    'No 🥺',
    'Are you sure? 🥺',
    'Really sure? 💔',
    'Look at the puppy eyes! 🐶',
    'Think of the ice-cream dates! 🍦',
    'You cannot catch me! 🏃‍♂️💨',
    'Pretty please with cherries on top? 🍒',
    'Error 404: "No" not allowed! ❌',
    'Just tap YES already! ❤️',
  ];

  const dodgeNoButton = () => {
    soundManager.playGentleChime(784, 0.15);
    setNoCount((prev) => prev + 1);

    // Fast unpredictable displacement bounds for mobile and desktop
    const isMobile = window.innerWidth < 640;
    const maxOffset = isMobile ? 120 : 220;

    // Generate non-zero random coordinates
    const randomAngle = Math.random() * Math.PI * 2;
    const randomDistance = Math.random() * (maxOffset - 50) + 50;

    const newX = Math.cos(randomAngle) * randomDistance;
    const newY = Math.sin(randomAngle) * (randomDistance * 0.7);

    setNoPosition({ x: newX, y: newY });
  };

  const handleYesClick = () => {
    setIsForgiven(true);
    soundManager.playCelebrationChord();
    soundManager.playHappyHappySong();
    setIsPlayingHappyMusic(true);

    try {
      // Big multi-stage celebration explosion
      const count = 200;
      const defaults = { origin: { y: 0.6 } };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, { spread: 26, startVelocity: 55, colors: ['#ff4d6d', '#ff758f', '#ffb3c1'] });
      fire(0.2, { spread: 60, colors: ['#ffd166', '#06d6a0', '#118ab2'] });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#be123c', '#ffffff', '#fb7185'] });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45, colors: ['#f43f5e', '#ec4899', '#fef08a'] });
    } catch {
      // fallback
    }
  };

  const toggleHappyMusic = () => {
    if (isPlayingHappyMusic) {
      soundManager.stopHappySong();
      setIsPlayingHappyMusic(false);
    } else {
      soundManager.playHappyHappySong();
      setIsPlayingHappyMusic(true);
    }
  };

  const handleReset = () => {
    setIsForgiven(false);
    setNoCount(0);
    setNoPosition({ x: 0, y: 0 });
    soundManager.stopHappySong();
  };

  // Dynamic scales
  const noScale = Math.max(0.35, 1 - noCount * 0.1);
  const yesScale = Math.min(1.8, 1 + noCount * 0.12);

  return (
    <section id="decision" className="py-16 sm:py-24 md:py-32 px-4 bg-gradient-to-b from-[#FFFDF9] via-[#FFF1F2]/60 to-[#FFFDF9] overflow-hidden">
      <div className="max-w-2xl mx-auto text-center" ref={containerRef}>
        {!isForgiven ? (
          <div className="space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FFE4E6] border border-[#FDA4AF] flex items-center justify-center text-[#be123c] shadow-lg animate-float">
              <Heart className="w-8 h-8 fill-[#be123c] text-[#be123c]" />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0F2] text-[#be123c] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>One Sincere Question</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-elegant font-bold text-[#2d2424] leading-tight">
              Do you forgive me now?
            </h2>

            <p className="text-sm sm:text-base text-[#6f5b58] max-w-md mx-auto leading-relaxed px-2">
              I have laid bare my heart, put away all foolish ego, and promised to love you with patience.
              My life has no meaning without you, {personalization.herName}.
            </p>

            {/* Playful Interactive Decision Buttons Area */}
            <div className="relative pt-8 pb-12 flex items-center justify-center gap-6 min-h-[160px]">
              {/* YES Button - Grows as she avoids it! */}
              <button
                onClick={handleYesClick}
                style={{
                  transform: `scale(${yesScale})`,
                  transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  zIndex: 20,
                }}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#be123c] to-[#9f1239] hover:from-[#9f1239] hover:to-[#881337] text-white font-bold text-base sm:text-lg shadow-2xl shadow-rose-900/30 active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Heart className="w-5 h-5 fill-white animate-pulse" />
                <span>Yes! ❤️</span>
              </button>

              {/* NO Button - Dodges, speeds away and shrinks! */}
              <button
                onMouseEnter={dodgeNoButton}
                onTouchStart={(e) => {
                  e.preventDefault();
                  dodgeNoButton();
                }}
                onClick={dodgeNoButton}
                style={{
                  transform: `translate(${noPosition.x}px, ${noPosition.y}px) scale(${noScale})`,
                  transition: 'transform 0.12s ease-out',
                  zIndex: 10,
                  pointerEvents: noCount >= 10 ? 'none' : 'auto',
                }}
                className="px-5 py-3 rounded-full bg-white hover:bg-stone-100 text-stone-600 border border-stone-300 font-medium text-xs sm:text-sm shadow-md cursor-pointer select-none whitespace-nowrap"
              >
                <span>{noPhrases[Math.min(noCount, noPhrases.length - 1)]}</span>
              </button>
            </div>

            {noCount > 2 && (
              <p className="text-xs text-[#be123c] font-medium animate-pulse">
                (The "No" button seems to be running away! Maybe it's a sign? 😉)
              </p>
            )}
          </div>
        ) : (
          /* Forgiven State: The Famous Happy Happy Happy Cat Celebration */
          <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border-2 border-[#FDA4AF] shadow-2xl shadow-rose-900/15 space-y-6 animate-in fade-in zoom-in duration-500 relative overflow-hidden">
            {/* Top Celebration Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE4E6] text-[#881337] text-xs sm:text-sm font-bold uppercase tracking-wider animate-bounce">
              <span>🎉</span>
              <span>HAPPY HAPPY HAPPY!</span>
              <span>🎉</span>
            </div>

            {/* The Famous Happy Happy Happy Jumping Cat GIF */}
            <div className="relative mx-auto w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden border-4 border-[#FBCFE8] shadow-xl bg-[#FFF5F5] flex items-center justify-center">
              <img
                src="https://media1.tenor.com/m/J3tPz6V72bEAAAAC/happy-happy-cat.gif"
                alt="Happy Happy Happy Cat Jumping"
                className="w-full h-full object-cover select-none"
                onError={(e) => {
                  // Fallback GIF if tenor is blocked
                  (e.currentTarget as HTMLImageElement).src =
                    'https://media.giphy.com/media/GeimqsH0TLDt4tScGw/giphy.gif';
                }}
              />
              <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold py-1 px-2 rounded-xl text-center">
                🐱 HAPPY HAPPY HAPPY CAT! 🎵
              </div>
            </div>

            {/* Headline */}
            <div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif-elegant font-bold text-[#881337] mb-2">
                YAYYY! You Forgave Me! 🥰
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-[#be123c] uppercase tracking-widest">
                Best day of my entire life
              </p>
            </div>

            {/* Heartfelt resolution */}
            <p className="text-sm sm:text-base md:text-lg text-[#4a3a38] leading-relaxed max-w-lg mx-auto font-serif-elegant italic">
              "Thank you from the very bottom of my heart, {personalization.herName}.
              You just saved my whole world. I promise to never let temporary anger speak for me, to cherish your precious smile, and to hold you close forever."
            </p>

            {/* Interactive Music Controls & Reset */}
            <div className="pt-4 border-t border-[#FEE2E2] flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={toggleHappyMusic}
                className="px-4 py-2 rounded-full bg-[#FFE4E6] text-[#9f1239] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#FED7AA] cursor-pointer transition-all"
              >
                {isPlayingHappyMusic ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 animate-pulse text-[#be123c]" />
                    <span>Happy Song: Playing 🎵</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-stone-500" />
                    <span>Happy Song: Paused</span>
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="px-3.5 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-all"
                title="Play again"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay Question</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

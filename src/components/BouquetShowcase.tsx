import React, { useState } from 'react';
import { Heart, Sparkles, Plus, Minus, Check, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BouquetVisual } from './BouquetVisual';
import { CURATED_BOUQUETS, AVAILABLE_FLOWERS } from '../data/mockData';
import { BouquetOption, UserPersonalization } from '../types';
import { soundManager } from '../utils/audio';

interface BouquetShowcaseProps {
  personalization: UserPersonalization;
  onBouquetChosen: (bouquetTitle: string) => void;
}

export const BouquetShowcase: React.FC<BouquetShowcaseProps> = ({
  personalization,
  onBouquetChosen,
}) => {
  const [activeTab, setActiveTab] = useState<'curated' | 'custom'>('curated');
  const [selectedCurated, setSelectedCurated] = useState<BouquetOption>(CURATED_BOUQUETS[0]);
  const [sentBouquetTitle, setSentBouquetTitle] = useState<string | null>(null);

  // Custom bouquet builder state
  const [customFlowers, setCustomFlowers] = useState<{ flowerId: string; count: number; name: string }[]>([
    { flowerId: 'red-rose', count: 4, name: 'Velvet Red Rose' },
    { flowerId: 'babys-breath', count: 3, name: "Baby's Breath" },
    { flowerId: 'lavender', count: 2, name: 'Lavender Sprigs' },
  ]);

  const [customWrapper, setCustomWrapper] = useState<string>('#fdf2f8');
  const [customRibbon, setCustomRibbon] = useState<string>('#be123c');
  const [customTagMessage, setCustomTagMessage] = useState<string>('I am sorry with all my heart');

  const wrapperOptions = [
    { id: 'blush', name: 'Blush Silk', color: '#fdf2f8' },
    { id: 'kraft', name: 'Vintage Kraft', color: '#e8d8c8' },
    { id: 'sage', name: 'Sage Green', color: '#e6ede6' },
    { id: 'noir', name: 'Classic Cream', color: '#faf6f0' },
  ];

  const ribbonOptions = [
    { id: 'crimson', name: 'Crimson Velvet', color: '#be123c' },
    { id: 'rose-gold', name: 'Rose Gold', color: '#f43f5e' },
    { id: 'gold', name: 'Warm Gold', color: '#ca8a04' },
    { id: 'lavender', name: 'Soft Lavender', color: '#8b5cf6' },
  ];

  const handleUpdateCount = (flowerId: string, delta: number) => {
    soundManager.playGentleChime(delta > 0 ? 659.25 : 440, 0.4);
    setCustomFlowers((prev) => {
      const existing = prev.find((f) => f.flowerId === flowerId);
      if (!existing && delta > 0) {
        const flowerMeta = AVAILABLE_FLOWERS.find((f) => f.id === flowerId);
        return [...prev, { flowerId, count: 1, name: flowerMeta?.name || 'Flower' }];
      }
      if (existing) {
        const newCount = existing.count + delta;
        if (newCount <= 0) {
          return prev.filter((f) => f.flowerId !== flowerId);
        }
        return prev.map((f) => (f.flowerId === flowerId ? { ...f, count: newCount } : f));
      }
      return prev;
    });
  };

  const handlePresentCurated = (bouquet: BouquetOption) => {
    soundManager.playCelebrationChord();
    setSentBouquetTitle(bouquet.title);
    onBouquetChosen(bouquet.title);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#be123c', '#f43f5e', '#fda4af', '#fef08a'],
      });
    } catch {
      // fallback
    }

    setTimeout(() => {
      setSentBouquetTitle(null);
    }, 4500);
  };

  const handlePresentCustom = () => {
    soundManager.playCelebrationChord();
    const title = 'Your Bespoke Handcrafted Bouquet';
    setSentBouquetTitle(title);
    onBouquetChosen(title);

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#be123c', '#f472b6', '#ca8a04', '#ffffff'],
      });
    } catch {
      // fallback
    }

    setTimeout(() => {
      setSentBouquetTitle(null);
    }, 4500);
  };

  return (
    <section id="bouquets" className="py-14 sm:py-20 md:py-24 px-4 bg-gradient-to-b from-[#FFFDF9] via-[#FFF8F7] to-[#FFFDF9]">
      <div className="max-w-5xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFE4E6] text-[#be123c] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Peace Offerings</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif-elegant font-bold text-[#2d2424] mb-3">
            A Bouquet Handcrafted for You
          </h2>
          <p className="text-xs sm:text-base text-[#6f5b58] max-w-lg mx-auto leading-relaxed">
            Flowers express what words often fail to convey. Each delicate blossom represents a genuine promise of patience, tenderness, and love.
          </p>

          {/* Tab Selector */}
          <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
            <button
              onClick={() => {
                setActiveTab('curated');
                soundManager.playGentleChime(523.25, 0.3);
              }}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'curated'
                  ? 'bg-[#be123c] text-white shadow-md shadow-rose-900/20'
                  : 'bg-white text-[#5c4947] border border-[#E8D4D0] hover:bg-[#FFF5F5]'
              }`}
            >
              🌸 Curated Bouquets
            </button>
            <button
              onClick={() => {
                setActiveTab('custom');
                soundManager.playGentleChime(587.33, 0.3);
              }}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'custom'
                  ? 'bg-[#be123c] text-white shadow-md shadow-rose-900/20'
                  : 'bg-white text-[#5c4947] border border-[#E8D4D0] hover:bg-[#FFF5F5]'
              }`}
            >
              ✨ DIY Bouquet Studio
            </button>
          </div>
        </div>

        {/* Success Toast Banner */}
        {sentBouquetTitle && (
          <div className="mb-6 p-4 rounded-2xl bg-[#FFE4E6] border border-[#FDA4AF] text-[#881337] flex items-center justify-between shadow-lg animate-bounce">
            <div className="flex items-center gap-3">
              <Gift className="w-5 h-5 text-[#be123c] shrink-0" />
              <div>
                <p className="font-semibold text-xs sm:text-sm">
                  Bouquet presented to {personalization.herName}!
                </p>
                <p className="text-[11px] sm:text-xs text-[#9f1239]">
                  {sentBouquetTitle} — Delivered with pure love and apologies.
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-white rounded-full text-[#be123c] shrink-0">
              ❤️ Presented
            </span>
          </div>
        )}

        {/* TAB 1: Curated Bouquets */}
        {activeTab === 'curated' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            {/* Visualizer Card */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-7 border border-[#F2D7D4] shadow-xl shadow-rose-900/5 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-4 left-4">
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[#FFF0F2] text-[#9f1239] border border-[#FED7AA]">
                  Live Preview
                </span>
              </div>

              <div className="my-3 sm:my-4">
                <BouquetVisual
                  wrapperColor={selectedCurated.wrapperColor}
                  ribbonColor={selectedCurated.ribbonColor}
                  flowers={selectedCurated.flowers}
                  size="lg"
                />
              </div>

              {/* Tag tied to bouquet */}
              <div className="w-full bg-[#FFFBF7] p-3 rounded-2xl border border-[#F3E2DE] text-center shadow-inner">
                <p className="text-xs font-serif-elegant italic text-[#5c4947]">
                  "{selectedCurated.sentiment}"
                </p>
                <p className="text-[11px] font-semibold text-[#be123c] mt-1">
                  — With love from {personalization.hisName}
                </p>
              </div>
            </div>

            {/* Bouquet Selection List */}
            <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
              {CURATED_BOUQUETS.map((bouquet) => {
                const isSelected = selectedCurated.id === bouquet.id;
                return (
                  <div
                    key={bouquet.id}
                    onClick={() => {
                      setSelectedCurated(bouquet);
                      soundManager.playGentleChime(523.25, 0.4);
                    }}
                    className={`p-4 sm:p-6 rounded-3xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#be123c] ring-2 ring-[#be123c]/20 shadow-lg'
                        : 'bg-white/70 border-[#EED7D4] hover:bg-white hover:border-[#DDA59E]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-serif-elegant font-bold text-base sm:text-xl text-[#2d2424]">
                            {bouquet.title}
                          </h3>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-[#be123c] text-white flex items-center justify-center text-xs">
                              ✓
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#be123c] font-medium mb-1.5 sm:mb-2">
                          {bouquet.tagline}
                        </p>
                        <p className="text-xs sm:text-sm text-[#5c4947] leading-relaxed mb-3">
                          {bouquet.description}
                        </p>

                        {/* Stems tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {bouquet.flowers.map((fl) => (
                            <span
                              key={fl.flowerId}
                              className="text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full bg-[#FFF0F2] text-[#881337] border border-[#FBCFE8]"
                            >
                              {fl.count}× {fl.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="mt-4 pt-3 sm:pt-4 border-t border-[#F5E1DD] flex items-center justify-between gap-2">
                        <span className="text-[11px] sm:text-xs text-[#8c7471] italic truncate">
                          Send as peace offering
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePresentCurated(bouquet);
                          }}
                          className="px-3.5 sm:px-4 py-2 rounded-full bg-[#be123c] hover:bg-[#9f1239] text-white text-xs sm:text-sm font-semibold shadow-md flex items-center gap-1.5 cursor-pointer shrink-0 transition-all"
                        >
                          <Gift className="w-3.5 h-3.5" />
                          <span>Present This Bouquet</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Custom Bouquet Builder */}
        {activeTab === 'custom' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Visual preview */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-7 border border-[#F2D7D4] shadow-xl shadow-rose-900/5 flex flex-col items-center justify-center sticky top-20">
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[#FFF0F2] text-[#9f1239] border border-[#FED7AA]">
                  Live Studio
                </span>
                <span className="text-xs text-[#8c7471]">
                  {customFlowers.reduce((sum, f) => sum + f.count, 0)} stems
                </span>
              </div>

              <div className="my-2">
                <BouquetVisual
                  wrapperColor={customWrapper}
                  ribbonColor={customRibbon}
                  flowers={customFlowers}
                  size="lg"
                />
              </div>

              {/* Personal message tag */}
              <div className="w-full bg-[#FFFBF7] p-3 rounded-2xl border border-[#F3E2DE] text-center shadow-inner mt-2">
                <p className="text-xs font-serif-elegant italic text-[#5c4947]">
                  "{customTagMessage || 'I am deeply sorry...'}"
                </p>
                <p className="text-[11px] font-semibold text-[#be123c] mt-1">
                  — {personalization.hisName}
                </p>
              </div>

              <button
                onClick={handlePresentCustom}
                disabled={customFlowers.reduce((sum, f) => sum + f.count, 0) === 0}
                className="w-full mt-4 py-3 rounded-full bg-gradient-to-r from-[#be123c] to-[#9f1239] text-white font-medium text-xs sm:text-sm shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Gift className="w-4 h-4" />
                <span>Present This Bouquet to {personalization.herName}</span>
              </button>
            </div>

            {/* Customization controls */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              {/* Flowers selector */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EED7D4] shadow-xs">
                <h3 className="font-serif-elegant font-bold text-base sm:text-lg text-[#2d2424] mb-1">
                  1. Select Your Flowers
                </h3>
                <p className="text-xs text-[#6f5b58] mb-4">
                  Add or remove stems to compose the perfect arrangement.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  {AVAILABLE_FLOWERS.map((flower) => {
                    const count = customFlowers.find((f) => f.flowerId === flower.id)?.count || 0;
                    return (
                      <div
                        key={flower.id}
                        className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                          count > 0 ? 'bg-[#FFF8F8] border-[#FDA4AF]' : 'bg-[#FAFAFA] border-stone-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-1">
                          <span className="text-2xl shrink-0">{flower.icon}</span>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-semibold text-[#2d2424] truncate">
                              {flower.name}
                            </p>
                            <p className="text-[10px] sm:text-[11px] text-[#8c7471] line-clamp-1">
                              {flower.symbolism}
                            </p>
                          </div>
                        </div>

                        {/* Count controller */}
                        <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-full px-2 py-1 shadow-xs shrink-0">
                          <button
                            onClick={() => handleUpdateCount(flower.id, -1)}
                            disabled={count === 0}
                            className="w-5 h-5 flex items-center justify-center text-stone-500 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center text-[#2d2424]">{count}</span>
                          <button
                            onClick={() => handleUpdateCount(flower.id, 1)}
                            className="w-5 h-5 flex items-center justify-center text-rose-600 hover:text-rose-800 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Wrapper & Ribbon choice */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EED7D4] shadow-xs">
                <h3 className="font-serif-elegant font-bold text-base sm:text-lg text-[#2d2424] mb-3">
                  2. Wrapping Paper & Ribbon
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-[#5c4947] block mb-2">
                      Wrapping Paper:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {wrapperOptions.map((w) => (
                        <button
                          key={w.id}
                          onClick={() => {
                            setCustomWrapper(w.color);
                            soundManager.playGentleChime(440, 0.2);
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-2 cursor-pointer transition-all ${
                            customWrapper === w.color
                              ? 'border-[#be123c] bg-[#FFF0F2] text-[#881337]'
                              : 'border-stone-200 bg-white text-stone-700'
                          }`}
                        >
                          <span className="w-3.5 h-3.5 rounded-full border border-stone-300" style={{ backgroundColor: w.color }} />
                          <span>{w.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#5c4947] block mb-2">
                      Silk Ribbon:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {ribbonOptions.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => {
                            setCustomRibbon(r.color);
                            soundManager.playGentleChime(493.88, 0.2);
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-2 cursor-pointer transition-all ${
                            customRibbon === r.color
                              ? 'border-[#be123c] bg-[#FFF0F2] text-[#881337]'
                              : 'border-stone-200 bg-white text-stone-700'
                          }`}
                        >
                          <span className="w-3.5 h-3.5 rounded-full border border-stone-300" style={{ backgroundColor: r.color }} />
                          <span>{r.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tag note */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EED7D4] shadow-xs">
                <h3 className="font-serif-elegant font-bold text-base sm:text-lg text-[#2d2424] mb-2">
                  3. Ribbon Message Tag
                </h3>
                <input
                  type="text"
                  value={customTagMessage}
                  onChange={(e) => setCustomTagMessage(e.target.value)}
                  maxLength={65}
                  placeholder="Write a message on the tag..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#be123c] bg-[#FFFBF7]"
                />
                <p className="text-[11px] text-[#8c7471] mt-1 text-right">
                  {customTagMessage.length}/65
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

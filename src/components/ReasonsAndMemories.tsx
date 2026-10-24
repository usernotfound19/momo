import React, { useState, useEffect } from 'react';
import { Heart, Camera } from 'lucide-react';
import { REASONS_LIST } from '../data/mockData';
import { MemoryReason, UserPersonalization } from '../types';

interface ReasonsAndMemoriesProps {
  personalization: UserPersonalization;
}

export const ReasonsAndMemories: React.FC<ReasonsAndMemoriesProps> = ({
  personalization,
}) => {
  const [reasons] = useState<MemoryReason[]>(() => {
    try {
      const saved = localStorage.getItem('apology_reasons');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return REASONS_LIST;
  });

  return (
    <section id="reasons" className="py-14 sm:py-20 md:py-24 px-4 bg-gradient-to-b from-[#FFF8F7] to-[#FFFDF9]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFE4E6] text-[#be123c] text-xs font-semibold uppercase tracking-wider mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>Cherished Memories</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif-elegant font-bold text-[#2d2424] mb-3">
            Why You Mean the World to Me
          </h2>
          <p className="text-xs sm:text-sm text-[#735c59] max-w-md mx-auto leading-relaxed">
            In that clouded moment of foolish anger, I forgot just how precious your presence is in my life.
          </p>
        </div>

        {/* Polaroids / Note Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {reasons.map((item, idx) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 sm:p-7 border border-[#F0D5D1] shadow-lg shadow-rose-950/5 relative overflow-hidden group hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[#FFF0F2] text-[#be123c] border border-[#FCD5DC]">
                  {item.tag}
                </span>

                <span className="text-xs font-serif-elegant text-stone-400">
                  #{idx + 1}
                </span>
              </div>

              <h3 className="font-serif-elegant font-bold text-lg sm:text-xl text-[#2d2424] mb-2">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm md:text-base text-[#5c4947] leading-relaxed font-normal">
                {item.content}
              </p>

              <div className="mt-4 pt-3 border-t border-[#F8EAE7] flex items-center justify-between text-xs text-[#8c7471]">
                <span className="flex items-center gap-1 text-[#be123c]">
                  <Heart className="w-3.5 h-3.5 fill-[#be123c]" />
                  <span>{personalization.herName}</span>
                </span>
                <span className="font-script-romantic text-base sm:text-lg text-[#be123c]/70">
                  Always in my heart
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

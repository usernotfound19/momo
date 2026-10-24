import React, { useState } from 'react';
import { Ticket, Check, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LOVE_COUPONS } from '../data/mockData';
import { LoveCoupon, UserPersonalization } from '../types';
import { soundManager } from '../utils/audio';

interface LoveCouponsProps {
  personalization: UserPersonalization;
}

export const LoveCoupons: React.FC<LoveCouponsProps> = ({
  personalization,
}) => {
  const [coupons, setCoupons] = useState<LoveCoupon[]>(LOVE_COUPONS);

  const handleRedeem = (id: string) => {
    soundManager.playCelebrationChord();
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isRedeemed: !c.isRedeemed } : c))
    );

    try {
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.7 },
        colors: ['#be123c', '#f43f5e', '#facc15'],
      });
    } catch {
      // fallback
    }
  };

  return (
    <section id="coupons" className="py-14 sm:py-20 md:py-24 px-4 bg-[#FFFBF7]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFE4E6] text-[#be123c] text-xs font-semibold uppercase tracking-wider mb-3">
            <Ticket className="w-3.5 h-3.5" />
            <span>Peace Vouchers</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif-elegant font-bold text-[#2d2424] mb-3">
            Reconciliation Love Coupons
          </h2>
          <p className="text-xs sm:text-sm text-[#735c59] max-w-md mx-auto leading-relaxed">
            These are non-negotiable promises. Click any coupon to redeem it whenever you wish.
          </p>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className={`rounded-3xl border transition-all p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between ${
                coupon.isRedeemed
                  ? 'bg-[#FFF0F2] border-[#FBCFE8] shadow-xs'
                  : 'bg-white border-[#EED7D4] shadow-md hover:shadow-lg'
              }`}
            >
              {/* Top ticket cut notches */}
              <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FFFBF7] border-r border-[#EED7D4]" />
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FFFBF7] border-l border-[#EED7D4]" />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl sm:text-3xl p-2 rounded-2xl bg-[#FFF5F5] border border-[#FED7AA]">
                    {coupon.icon}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                    Lifetime Valid
                  </span>
                </div>

                <h3 className="font-serif-elegant font-bold text-base sm:text-lg text-[#2d2424] mb-2">
                  {coupon.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#5c4947] leading-relaxed mb-6 font-normal">
                  {coupon.description}
                </p>
              </div>

              {/* Bottom Redeem Bar */}
              <div className="pt-3 border-t border-dashed border-[#EED7D4] flex items-center justify-between gap-2">
                <span className="text-[11px] text-[#8c7471] truncate">
                  For: {personalization.herName}
                </span>

                <button
                  onClick={() => handleRedeem(coupon.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0 transition-all ${
                    coupon.isRedeemed
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-[#be123c] hover:bg-[#9f1239] text-white shadow-xs'
                  }`}
                >
                  {coupon.isRedeemed ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Redeemed!</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-3.5 h-3.5 fill-white" />
                      <span>Claim Coupon</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

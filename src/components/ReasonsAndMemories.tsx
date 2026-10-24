import React, { useState, useEffect } from 'react';
import { Heart, Plus, Trash2, Camera } from 'lucide-react';
import { REASONS_LIST } from '../data/mockData';
import { MemoryReason, UserPersonalization } from '../types';
import { soundManager } from '../utils/audio';

interface ReasonsAndMemoriesProps {
  personalization: UserPersonalization;
  isAdmin: boolean;
}

export const ReasonsAndMemories: React.FC<ReasonsAndMemoriesProps> = ({
  personalization,
  isAdmin,
}) => {
  const [reasons, setReasons] = useState<MemoryReason[]>(() => {
    try {
      const saved = localStorage.getItem('apology_reasons');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return REASONS_LIST;
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('apology_reasons', JSON.stringify(reasons));
    } catch {
      // fallback
    }
  }, [reasons]);

  const handleAddReason = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    soundManager.playGentleChime(587.33);
    const newReason: MemoryReason = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      category: 'Cherished Memory',
      tag: newTag.trim() || 'My Favorite',
    };

    setReasons([newReason, ...reasons]);
    setNewTitle('');
    setNewContent('');
    setNewTag('');
    setIsAdding(false);
  };

  const handleDeleteReason = (id: string) => {
    soundManager.playGentleChime(440, 0.2);
    setReasons(reasons.filter((r) => r.id !== id));
  };

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

                <div className="flex items-center gap-2">
                  <span className="text-xs font-serif-elegant text-stone-400">
                    #{idx + 1}
                  </span>
                  {/* Delete button only visible to admin */}
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteReason(item.id)}
                      className="text-stone-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 cursor-pointer transition-colors"
                      title="Delete this note (Admin only)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
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

        {/* Admin only: Add memory / reason form */}
        {isAdmin && (
          <div className="mt-8 text-center">
            {!isAdding ? (
              <button
                onClick={() => {
                  soundManager.playGentleChime(523.25);
                  setIsAdding(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#FFF5F5] border border-[#E9CFCB] text-[#5c4947] font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#be123c]" />
                <span>Add a Reason / Memory (Admin Only)</span>
              </button>
            ) : (
              <form
                onSubmit={handleAddReason}
                className="max-w-lg mx-auto bg-white p-5 sm:p-6 rounded-3xl border border-[#F0D5D1] shadow-xl text-left space-y-3.5"
              >
                <h4 className="font-serif-elegant font-bold text-lg text-[#2d2424]">
                  Add New Reason / Memory
                </h4>
                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">
                    Title / Quality:
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., The warmth of your hugs..."
                    className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-[#be123c] bg-[#FFFBF7]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">
                    Tag:
                  </label>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="e.g., Tenderness, Pure Joy"
                    className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-[#be123c] bg-[#FFFBF7]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">
                    Description:
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Write what you love about this..."
                    className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-[#be123c] bg-[#FFFBF7]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-1.5 rounded-full text-xs text-stone-600 hover:bg-stone-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#be123c] text-white text-xs font-semibold shadow-sm hover:bg-[#9f1239] cursor-pointer"
                  >
                    Save Note
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

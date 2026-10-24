import React, { useState } from 'react';
import { X, Heart, Save, Eye, Copy, Check, Lock } from 'lucide-react';
import { UserPersonalization } from '../types';
import { soundManager } from '../utils/audio';

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  personalization: UserPersonalization;
  onSave: (updated: UserPersonalization) => void;
  onExitAdmin: () => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  onClose,
  personalization,
  onSave,
  onExitAdmin,
}) => {
  const [formData, setFormData] = useState<UserPersonalization>(personalization);
  const [copiedCleanLink, setCopiedCleanLink] = useState(false);

  if (!isOpen) return null;

  const quickNicknames = ['My Love', 'Sweetheart', 'My Queen', 'Sunshine', 'Princess', 'Babu', 'Shona'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playGentleChime(659.25, 0.4);
    onSave(formData);
    onClose();
  };

  const handleCopyGirlfriendLink = () => {
    // Generate clean URL without ?admin parameter
    const cleanUrl = window.location.origin + window.location.pathname;
    navigator.clipboard.writeText(cleanUrl);
    setCopiedCleanLink(true);
    setTimeout(() => setCopiedCleanLink(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFDF9] rounded-3xl max-w-lg w-full p-5 sm:p-8 border border-[#F0D5D1] shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-[#FFE4E6] flex items-center justify-center text-[#be123c]">
            <Heart className="w-4 h-4 fill-[#be123c]" />
          </div>
          <h3 className="font-serif-elegant font-bold text-xl text-[#2d2424]">
            Admin Customization Panel
          </h3>
        </div>

        <p className="text-xs text-[#735c59] mb-4">
          Only you (Kawshik) see this panel. Your girlfriend will not see any edit or delete buttons on the shared page.
        </p>

        {/* Share with Girlfriend link helper */}
        <div className="p-3.5 mb-5 rounded-2xl bg-[#FFF5F5] border border-[#FECDD3] flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="text-left">
            <p className="text-xs font-semibold text-[#881337]">
              Link to Send to Girlfriend
            </p>
            <p className="text-[11px] text-[#9f1239]">
              Clean view without edit/delete buttons
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopyGirlfriendLink}
            className="w-full sm:w-auto px-3.5 py-1.5 rounded-full bg-white hover:bg-rose-50 text-[#be123c] border border-[#FDA4AF] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all shrink-0"
          >
            {copiedCleanLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Safe Link</span>
              </>
            )}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Girlfriend's Name or Pet Name:
            </label>
            <input
              type="text"
              required
              value={formData.herName}
              onChange={(e) => setFormData({ ...formData, herName: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-[#be123c] bg-white"
            />
            {/* Quick Nickname Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {quickNicknames.map((nick) => (
                <button
                  type="button"
                  key={nick}
                  onClick={() => setFormData({ ...formData, herName: nick })}
                  className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#FFF0F2] text-[#9f1239] border border-[#FBCFE8] hover:bg-[#FFE2E8] cursor-pointer"
                >
                  +{nick}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Your Name:
            </label>
            <input
              type="text"
              required
              value={formData.hisName}
              onChange={(e) => setFormData({ ...formData, hisName: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-[#be123c] bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Special Date or Tag:
            </label>
            <input
              type="text"
              value={formData.specialDate}
              onChange={(e) => setFormData({ ...formData, specialDate: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-[#be123c] bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Personal Apology Note on Hero Card:
            </label>
            <textarea
              rows={3}
              value={formData.personalCustomNote}
              onChange={(e) => setFormData({ ...formData, personalCustomNote: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-[#be123c] bg-white"
            />
          </div>

          <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={() => {
                onExitAdmin();
                onClose();
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-full text-xs font-semibold text-stone-600 hover:bg-stone-100 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Switch to Girlfriend View</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-xs font-medium text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#be123c] hover:bg-[#9f1239] text-white text-xs font-semibold shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

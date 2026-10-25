import React from 'react';
import { AlertTriangle, ShieldAlert, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WarningModal: React.FC = () => {
  const { isSafetyWarningVisible, dismissSafetyWarning } = useApp();

  if (!isSafetyWarningVisible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="warning-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-200">
        
        {/* Header / Title area: Red/Orange theme */}
        <div className="bg-gradient-to-r from-red-600 to-amber-600 px-6 py-4 text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 id="warning-modal-title" className="text-xl font-bold tracking-tight">
              সতর্কবার্তা
            </h3>
            <p className="text-xs text-white/90">
              তারাইল ব্লাড ব্যাংক নিরাপত্তা ও আর্থিক সচেতনতা
            </p>
          </div>
        </div>

        {/* Content area: White background with Yellow highlighted warning panel */}
        <div className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-300/80 rounded-xl p-4.5 flex gap-3.5">
            <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-sm text-neutral-800 leading-relaxed font-normal">
              <p className="font-semibold text-amber-900 mb-1">
                রক্তদান সম্পূর্ণ স্বেচ্ছাসেবামূলক ও বিনামূল্যের কাজ।
              </p>
              <p>
                রক্তের বিনিময়ে টাকা দাবি করা বা অপরিচিত কাউকে অগ্রিম যাতায়াত ভাড়া বাবদ টাকা পাঠানো থেকে সতর্ক থাকুন। কোনো সন্দেহজনক আচরণ দেখলে রিপোর্ট করুন। ব্যক্তিগত আর্থিক লেনদেনের ক্ষতির দায় ওয়েবসাইট কর্তৃপক্ষ বহন করবে না।
              </p>
            </div>
          </div>

          <div className="text-xs text-neutral-600 space-y-1.5 pl-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></span>
              <span>রোগীর কাছে সরাসরি উপস্থিত হয়ে রক্তদাতার সাথে লেনদেন বা নিশ্চিত হোন।</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></span>
              <span>কোনো মধ্যস্বত্বভোগী বা দালাল চক্রের মাধ্যমে যোগাযোগ করবেন না।</span>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              onClick={dismissSafetyWarning}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-[0.99] rounded-xl shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-red-600"
            >
              <Check className="w-4 h-4" />
              <span>বুঝেছি, সতর্ক থাকব</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

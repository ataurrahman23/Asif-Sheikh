import React from 'react';
import { Droplet, Heart, Shield, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenEmergencyModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenEmergencyModal }) => {
  return (
    <footer className="bg-neutral-950 text-neutral-300 pt-14 pb-10 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-neutral-800">
          
          {/* Brand & Purpose (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white">
                <Droplet className="w-6 h-6 fill-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  তারাইল ব্লাড ব্যাংক
                </h3>
                <span className="text-xs text-neutral-400">Tarail Blood Bank · Kishoreganj</span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              রক্তের প্রয়োজনে পাশে আছে তারাইল ব্লাড ব্যাংক। তারাইল উপজেলা ও কিশোরগঞ্জ জেলার মানুষের পাশে দাঁড়াতে ও রক্তদানকে সহজতর করতে একটি উন্মুক্ত অলাভজনক প্ল্যাটফর্ম।
            </p>

            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-neutral-300 space-y-1">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-red-500" />
                <span>নিরাপত্তা অঙ্গীকার:</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                রক্তদান সম্পূর্ণ স্বেচ্ছাসেবামূলক। রক্তের জন্য কাউকে অগ্রিম টাকা পাঠাবেন না। দালাল ও আর্থিক প্রতারণা থেকে সাবধান থাকুন।
              </p>
            </div>
          </div>

          {/* Quick Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              দ্রুত লিঙ্ক
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('hero')}
                  className="hover:text-red-400 transition-colors cursor-pointer text-left"
                >
                  হোম
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('donors')}
                  className="hover:text-red-400 transition-colors cursor-pointer text-left"
                >
                  রক্তদাতা খুঁজুন
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('emergency')}
                  className="hover:text-red-400 transition-colors cursor-pointer text-left"
                >
                  জরুরি রক্তের অনুরোধ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('hospitals')}
                  className="hover:text-red-400 transition-colors cursor-pointer text-left"
                >
                  হাসপাতাল ডিরেক্টরি
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('safety')}
                  className="hover:text-red-400 transition-colors cursor-pointer text-left"
                >
                  রক্তদান নির্দেশিকা
                </button>
              </li>
            </ul>
          </div>

          {/* Blood Groups Fast Access (2 cols) */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              রক্তের গ্রুপ
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
              <span className="text-neutral-400">A+ / A-</span>
              <span className="text-neutral-400">B+ / B-</span>
              <span className="text-neutral-400">AB+ / AB-</span>
              <span className="text-neutral-400">O+ / O-</span>
            </div>
            <div className="pt-2">
              <button
                onClick={onOpenEmergencyModal}
                className="w-full py-2 px-3 text-xs font-semibold text-center text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                জরুরি অনুরোধ জানান
              </button>
            </div>
          </div>

          {/* Regional Healthcare & Contact (3 cols) */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              আঞ্চলিক স্বাস্থ্য কমপ্লেক্স
            </h4>
            <div className="space-y-2 text-neutral-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>তারাঈল উপজেলা স্বাস্থ্য কমপ্লেক্স, তারাঈল, কিশোরগঞ্জ</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>জাতীয় জরুরি সেবা: ৯৯৯</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('developer')}
                className="text-xs text-neutral-400 hover:text-white underline underline-offset-4 transition-colors"
              >
                ডেভেলপার পরিচিতি ও কারিগরি বিবরণ →
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} তারাইল ব্লাড ব্যাংক (Tarail Blood Bank)। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>মানবতার কল্যাণে স্বেচ্ছাসেবী প্ল্যাটফর্ম</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

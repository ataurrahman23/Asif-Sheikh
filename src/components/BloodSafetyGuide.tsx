import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';

export const BloodSafetyGuide: React.FC = () => {
  const [calcDate, setCalcDate] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [nextEligibleDate, setNextEligibleDate] = useState<string | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calcDate) return;

    const last = new Date(calcDate);
    // Interval: 90 days for male, 120 days for female
    const intervalDays = gender === 'male' ? 90 : 120;
    const nextDate = new Date(last.getTime() + intervalDays * 24 * 60 * 60 * 1000);
    setNextEligibleDate(nextDate.toISOString().split('T')[0]);
  };

  return (
    <section id="safety" className="py-14 bg-neutral-50/60 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-2xl mb-10">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-red-600 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>স্বাস্থ্যবিধি ও সচেতনতা</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            রক্তদান নিরাপত্তা ও যোগ্যতা নির্দেশিকা
          </h2>
          <p className="text-sm text-neutral-600 mt-2">
            রক্তদান একটি সম্পূর্ণ নিরাপদ প্রক্রিয়া। একজন সুস্থ ব্যক্তি নিয়মিত রক্তদান করলে শরীরে কোনো ক্ষতিকর প্রভাব পড়ে না, বরং নতুন রক্তকণিকা তৈরিতে সহায়তা করে।
          </p>
        </div>

        {/* 2-Column Split: Medical Criteria & Eligibility Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Who can and cannot donate (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Who can donate card */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xs">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  ✓
                </div>
                <h3 className="text-base font-bold text-neutral-900">
                  রক্তদানের সাধারণ যোগ্যতা (Who Can Donate)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-700">
                <div className="flex items-start gap-2 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>বয়স:</strong> ১৮ থেকে ৬০ বছরের যেকোনো সুস্থ নাগরিক।</span>
                </div>
                <div className="flex items-start gap-2 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>ওজন:</strong> ন্যূনতম ৪৫ কেজি (পুরুষ ও মহিলা)।</span>
                </div>
                <div className="flex items-start gap-2 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>হিমোগ্লোবিন:</strong> ন্যূনতম ১২.৫ গ্রাম/ডেসিলিটার।</span>
                </div>
                <div className="flex items-start gap-2 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>বিরতি:</strong> পুরুষদের ৩ মাস ও মহিলাদের ৪ মাস পরপর।</span>
                </div>
              </div>
            </div>

            {/* Who cannot donate card */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xs">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  ✕
                </div>
                <h3 className="text-base font-bold text-neutral-900">
                  কখন রক্তদান করা যাবে না (Temporary / Permanent Disqualifiers)
                </h3>
              </div>

              <div className="space-y-2 text-xs text-neutral-700">
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50/40 border border-red-100/60">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>গর্ভবতী মা ও দুগ্ধদানকারী মায়েরা রক্তদান করতে পারবেন না।</span>
                </div>
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50/40 border border-red-100/60">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>গত ১ বছরের মধ্যে জন্ডিস, ম্যালেরিয়া বা বড় কোনো অস্ত্রোপচার হয়ে থাকলে।</span>
                </div>
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50/40 border border-red-100/60">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>বর্তমানে উচ্চ রক্তচাপ, অনিয়ন্ত্রিত ডায়াবেটিস বা অ্যান্টিবায়োটিক সেবনরত অবস্থায়।</span>
                </div>
              </div>
            </div>

            {/* Before and After Care */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xs">
              <h4 className="text-sm font-bold text-neutral-900 mb-3">
                রক্তদানের পূর্ব ও পরবর্তী সতর্কতা
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-600">
                <div>
                  <strong className="text-neutral-900 block mb-1">রক্তদানের পূর্বে:</strong>
                  <ul className="list-disc list-inside space-y-1">
                    <li>আগের রাতে পর্যাপ্ত ভালো ঘুম দিন।</li>
                    <li>রক্তদানের ২-৩ ঘণ্টা আগে পুষ্টিকর খাবার খান।</li>
                    <li>রক্তদানের আগে প্রচুর পানি বা জুস পান করুন।</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-neutral-900 block mb-1">রক্তদানের পরে:</strong>
                  <ul className="list-disc list-inside space-y-1">
                    <li>রক্তদানের পর অন্তত ১৫ মিনিট বিশ্রাম নিন।</li>
                    <li>পরবর্তী কয়েক ঘণ্টা অতিরিক্ত ভারী কাজ এড়িয়ে চলুন।</li>
                    <li>প্রচুর তরল খাদ্য ও স্যালাইন বা ফলের রস গ্রহণ করুন।</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Next Donation Calculator & Awareness Image (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Visual Awareness Asset */}
            <div className="relative rounded-2xl overflow-hidden border border-neutral-200 shadow-2xs aspect-4/3 bg-neutral-100">
              <img
                src="/src/assets/images/blood_donation_awareness_1792949176478.jpg"
                alt="রক্তদান জীবন বাঁচায়"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-5">
                <p className="text-xs text-white leading-relaxed">
                  রক্তের কোনো কৃত্রিম বিকল্প নেই। একজন মানুষের রক্তের একমাত্র উৎস হলেন অন্য একজন সহৃদয় মানুষ।
                </p>
              </div>
            </div>

            {/* Calculator Card */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-600" />
                <h3 className="text-base font-bold text-neutral-900">
                  পরবর্তী রক্তদানের সম্ভাব্য তারিখ
                </h3>
              </div>

              <form onSubmit={handleCalculate} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">
                    লিঙ্গ নির্বাচন করুন
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`py-2 px-3 rounded-lg font-medium border text-center transition-colors cursor-pointer ${
                        gender === 'male'
                          ? 'bg-red-50 text-red-700 border-red-300 font-bold'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      পুরুষ (৯০ দিন ব্যবধান)
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`py-2 px-3 rounded-lg font-medium border text-center transition-colors cursor-pointer ${
                        gender === 'female'
                          ? 'bg-red-50 text-red-700 border-red-300 font-bold'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      মহিলা (১২০ দিন ব্যবধান)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">
                    সর্বশেষ রক্তদানের তারিখ দিন:
                  </label>
                  <input
                    type="date"
                    required
                    value={calcDate}
                    onChange={e => setCalcDate(e.target.value)}
                    className="w-full py-2.5 px-3 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-2xs transition-colors cursor-pointer"
                >
                  সম্ভাব্য তারিখ হিসাব করুন
                </button>
              </form>

              {nextEligibleDate && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
                  <span className="text-[11px] text-emerald-800 font-medium">
                    আপনি পুনরায় রক্ত দিতে পারবেন আনুমানিক:
                  </span>
                  <div className="text-base font-extrabold text-emerald-900">
                    {nextEligibleDate}
                  </div>
                </div>
              )}

              {/* Explicit Medical Disclaimer */}
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 text-[11px] text-neutral-500 leading-normal flex items-start gap-2">
                <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <span>
                  <strong>সতর্কতা:</strong> এটি শুধুমাত্র একটি সাধারণ গাণিতিক হিসেব। চূড়ান্ত শারীরিক যোগ্যতা ও রক্তদানের উপযুক্ততা হাসপাতালে চিকিৎসকের শারীরিক পরীক্ষার মাধ্যমেই নির্ধারিত হবে।
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { useApp } from '../context/AppContext';
import { BloodGroup } from '../types';
import { Search, HeartHandshake, AlertCircle, Users, CheckCircle2, Droplet, Clock } from 'lucide-react';

interface HeroProps {
  onSelectBloodGroup: (group: BloodGroup | 'ALL') => void;
  selectedBloodGroup: BloodGroup | 'ALL';
  onOpenRegisterDonor: () => void;
  onOpenEmergencyModal: () => void;
  onScrollToSearch: () => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const Hero: React.FC<HeroProps> = ({
  onSelectBloodGroup,
  selectedBloodGroup,
  onOpenRegisterDonor,
  onOpenEmergencyModal,
  onScrollToSearch
}) => {
  const { donors, emergencyRequests } = useApp();

  const totalDonors = donors.length;
  const availableDonors = donors.filter(d => d.isAvailable && d.availabilityStatus === 'available').length;
  const verifiedDonors = donors.filter(d => d.isVerified).length;
  const openRequests = emergencyRequests.filter(r => r.status === 'open').length;

  return (
    <section className="relative overflow-hidden bg-white border-b border-neutral-200">
      
      {/* Subtle background ambient mesh */}
      <div className="absolute inset-0 bg-radial from-red-50/70 via-transparent to-transparent opacity-70 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Messaging & CTAs (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Trust Kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-red-700 tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              <span>তারাইল উপজেলা ও কিশোরগঞ্জ জেলার জন্য নিবেদিত</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 leading-[1.25]">
              রক্তের প্রয়োজনে পাশে আছে{' '}
              <span className="text-red-600">তারাইল ব্লাড ব্যাংক</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl font-normal leading-relaxed">
              সহজে রক্তদাতা খুঁজুন, মানুষের পাশে দাঁড়ান, জীবন বাঁচাতে সাহায্য করুন। সম্পূর্ণ অলাভজনক ও স্বেচ্ছাসেবামূলক একটি উন্মুক্ত সামাজিক প্ল্যাটফর্ম।
            </p>

            {/* CTAs Group */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Main CTA */}
              <button
                onClick={onScrollToSearch}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-[0.99] rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>রক্তদাতা খুঁজুন</span>
              </button>

              {/* Secondary CTA */}
              <button
                onClick={onOpenRegisterDonor}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 active:scale-[0.99] rounded-xl transition-all cursor-pointer"
              >
                <HeartHandshake className="w-4 h-4 text-red-600" />
                <span>রক্তদাতা হিসেবে নিবন্ধন করুন</span>
              </button>

              {/* Prominent Emergency CTA */}
              <button
                onClick={onOpenEmergencyModal}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 active:scale-[0.99] rounded-xl transition-all cursor-pointer"
              >
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>জরুরি রক্ত লাগবে?</span>
              </button>
            </div>

            {/* Blood Group Selector Strip */}
            <div className="pt-6 border-t border-neutral-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  রক্তের গ্রুপ অনুযায়ী খুঁজুন:
                </span>
                {selectedBloodGroup !== 'ALL' && (
                  <button
                    onClick={() => onSelectBloodGroup('ALL')}
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    ফিল্টার মুছুন
                  </button>
                )}
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {BLOOD_GROUPS.map(group => {
                  const isSelected = selectedBloodGroup === group;
                  return (
                    <button
                      key={group}
                      onClick={() => {
                        onSelectBloodGroup(isSelected ? 'ALL' : group);
                        onScrollToSearch();
                      }}
                      className={`h-11 rounded-xl font-bold text-sm transition-all flex flex-col items-center justify-center cursor-pointer border ${
                        isSelected
                          ? 'bg-red-600 text-white border-red-600 shadow-sm'
                          : 'bg-white hover:bg-red-50/70 text-neutral-800 border-neutral-200 hover:border-red-200'
                      }`}
                    >
                      <span>{group}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Visual Hero Asset & Quick Facts (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-200 shadow-sm aspect-16/10 bg-neutral-100">
              <img
                src="/src/assets/images/hero_blood_donation_1792949176778.jpg"
                alt="তারাইল ব্লাড ব্যাংক রক্তদান কর্মসূচি"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-5">
                <div className="text-white space-y-1">
                  <p className="text-xs font-semibold tracking-wide text-red-300">
                    “আপনার এক ব্যাগ রক্ত বাঁচাতে পারে একটি মুমূর্ষু প্রাণ”
                  </p>
                  <p className="text-xs text-neutral-200">
                    তারাইল উপজেলা স্বাস্থ্য কমপ্লেক্স ও নিকটের রক্তদাতাদের সাথে সেতুবন্ধন।
                  </p>
                </div>
              </div>
            </div>

            {/* Live Data Statistics (Truthful & non-hallucinated) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-neutral-900 tabular-nums">{totalDonors}</div>
                <div className="text-[11px] font-medium text-neutral-500 mt-0.5">নিবন্ধিত রক্তদাতা</div>
              </div>
              <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-emerald-600 tabular-nums">{availableDonors}</div>
                <div className="text-[11px] font-medium text-neutral-500 mt-0.5">বর্তমানে প্রস্তুত</div>
              </div>
              <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-blue-600 tabular-nums">{verifiedDonors}</div>
                <div className="text-[11px] font-medium text-neutral-500 mt-0.5">যাচাইকৃত রক্তদাতা</div>
              </div>
              <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-red-600 tabular-nums">{openRequests}</div>
                <div className="text-[11px] font-medium text-neutral-500 mt-0.5">জরুরি অনুরোধ</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

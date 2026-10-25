import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Hospital } from '../types';
import {
  Building2,
  Phone,
  MapPin,
  Clock,
  Globe,
  ExternalLink,
  Search,
  ShieldAlert,
  Hospital as HospitalIcon
} from 'lucide-react';

export const HospitalDirectory: React.FC = () => {
  const { hospitals } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'hospital' | 'blood_bank' | 'red_crescent'>('ALL');

  const filteredHospitals = hospitals.filter(h => {
    if (typeFilter !== 'ALL' && h.type !== typeFilter) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchName = h.name.toLowerCase().includes(term);
      const matchAddress = h.address.toLowerCase().includes(term);
      const matchUpazila = h.upazila.toLowerCase().includes(term);
      if (!matchName && !matchAddress && !matchUpazila) return false;
    }
    return true;
  });

  const getTypeLabel = (type: Hospital['type']) => {
    switch (type) {
      case 'hospital':
        return 'হাসপাতাল';
      case 'blood_bank':
        return 'ব্লাড ব্যাংক';
      case 'red_crescent':
        return 'রেড ক্রিসেন্ট রক্ত কেন্দ্র';
      default:
        return 'চিকিৎসা কেন্দ্র';
    }
  };

  return (
    <section id="hospitals" className="py-14 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-red-600 mb-1">
              <Building2 className="w-4 h-4" />
              <span>জরুরি সেবা ডিরেক্টরি</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              হাসপাতাল ও রক্ত পরিসঞ্চালন কেন্দ্র
            </h2>
            <p className="text-sm text-neutral-600 mt-2 max-w-xl">
              তারাইল, কিশোরগঞ্জ সদর ও পার্শ্ববর্তী সরকারি-বেসরকারি হাসপাতাল এবং অনুমোদিত রক্ত কেন্দ্রের সরাসরি যোগাযোগ নম্বর।
            </p>
          </div>

          {/* Quick Notice */}
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-[11px] text-neutral-600 max-w-sm">
            <span className="font-semibold text-neutral-800 block">জরুরি তথ্য:</span>
            হাসপাতালে কোনো গ্রুপের রক্ত সংরক্ষিত আছে কিনা তা নিশ্চিত হতে সরাসরি সংশ্লিষ্ট হাসপাতালের কন্ট্রোল রুমে ফোন দিন।
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="হাসপাতালের নাম বা উপজেলা লিখে খুঁজুন (উদা: তারাঈল উপজেলা স্বাস্থ্য কমপ্লেক্স)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-neutral-50/50 border border-neutral-200 rounded-xl focus:bg-white focus:border-red-600 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs pb-1 sm:pb-0">
            {(['ALL', 'hospital', 'blood_bank', 'red_crescent'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  typeFilter === t
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {t === 'ALL' ? 'সব কেন্দ্র' : getTypeLabel(t)}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Cards Grid */}
        {filteredHospitals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredHospitals.map(hosp => (
              <div
                key={hosp.hospitalId}
                className="bg-neutral-50/50 rounded-2xl border border-neutral-200 p-5 hover:border-red-200 hover:bg-white transition-all shadow-2xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-red-100/70 text-red-700 flex items-center justify-center shrink-0">
                      <HospitalIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-neutral-600 bg-white border border-neutral-200 px-2.5 py-0.5 rounded-md">
                      {getTypeLabel(hosp.type)}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-neutral-900 leading-snug">
                      {hosp.name}
                    </h3>
                    <div className="flex items-start gap-1.5 text-xs text-neutral-600 mt-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                      <span>{hosp.address}, {hosp.upazila}, {hosp.district}</span>
                    </div>
                  </div>

                  {hosp.openingHours && (
                    <div className="flex items-center gap-1.5 text-xs text-neutral-600 pt-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span>{hosp.openingHours}</span>
                    </div>
                  )}
                </div>

                {/* Contact and Links */}
                <div className="pt-4 mt-4 border-t border-neutral-200/70 space-y-2">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${hosp.phone.split(',')[0].trim()}`}
                      className="flex-1 py-2 px-3 text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-red-600" />
                      <span>কল দিন: {hosp.phone.split(',')[0].trim()}</span>
                    </a>

                    {hosp.mapUrl && (
                      <a
                        href={hosp.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="গুগল ম্যাপে অবস্থান দেখুন"
                        className="p-2 text-neutral-600 hover:text-neutral-900 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-8 text-center max-w-md mx-auto">
            <p className="text-sm font-semibold text-neutral-800">
              কোনো হাসপাতাল বা রক্ত কেন্দ্র পাওয়া যায়নি।
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              ফিল্টার পরিবর্তন করুন অথবা অ্যাডমিন প্যানেল থেকে নতুন হাসপাতাল যুক্ত করুন।
            </p>
          </div>
        )}

      </div>
    </section>
  );
};

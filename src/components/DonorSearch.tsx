import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BloodGroup, DonorProfile } from '../types';
import { DISTRICTS, UPAZILAS, TARAIL_AREAS } from '../data/initialData';
import {
  Search,
  Filter,
  CheckCircle,
  Phone,
  Calendar,
  Heart,
  Star,
  MapPin,
  RefreshCw,
  Eye,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface DonorSearchProps {
  selectedBloodGroup: BloodGroup | 'ALL';
  onSelectBloodGroup: (group: BloodGroup | 'ALL') => void;
  onViewDonorProfile: (donor: DonorProfile) => void;
  onOpenRegisterDonor: () => void;
}

export const DonorSearch: React.FC<DonorSearchProps> = ({
  selectedBloodGroup,
  onSelectBloodGroup,
  onViewDonorProfile,
  onOpenRegisterDonor
}) => {
  const { donors } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('কিশোরগঞ্জ');
  const [selectedUpazila, setSelectedUpazila] = useState<string>('তারাইল');
  const [selectedArea, setSelectedArea] = useState<string>('ALL');
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);

  // Available upazilas for selected district
  const upazilaList = useMemo(() => {
    return UPAZILAS[selectedDistrict] || [];
  }, [selectedDistrict]);

  // Filtering logic
  const filteredDonors = useMemo(() => {
    return donors.filter(donor => {
      // Consent to publish check
      if (!donor.consentToPublish) return false;

      // Blood group filter
      if (selectedBloodGroup !== 'ALL' && donor.bloodGroup !== selectedBloodGroup) {
        return false;
      }

      // District filter
      if (selectedDistrict !== 'ALL' && donor.district !== selectedDistrict) {
        return false;
      }

      // Upazila filter
      if (selectedUpazila !== 'ALL' && donor.upazila !== selectedUpazila) {
        return false;
      }

      // Area filter
      if (selectedArea !== 'ALL' && !donor.area.includes(selectedArea)) {
        return false;
      }

      // Available only filter
      if (availableOnly && (!donor.isAvailable || donor.availabilityStatus !== 'available')) {
        return false;
      }

      // Free-text search
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchName = donor.name.toLowerCase().includes(term);
        const matchArea = donor.area.toLowerCase().includes(term);
        const matchAddress = donor.address ? donor.address.toLowerCase().includes(term) : false;
        if (!matchName && !matchArea && !matchAddress) {
          return false;
        }
      }

      return true;
    });
  }, [donors, selectedBloodGroup, selectedDistrict, selectedUpazila, selectedArea, availableOnly, searchTerm]);

  const handleClearFilters = () => {
    onSelectBloodGroup('ALL');
    setSelectedDistrict('ALL');
    setSelectedUpazila('ALL');
    setSelectedArea('ALL');
    setAvailableOnly(false);
    setSearchTerm('');
  };

  const handleCopyPhone = (donorId: string, phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopiedPhoneId(donorId);
    setTimeout(() => setCopiedPhoneId(null), 2500);
  };

  return (
    <section id="donors" className="py-12 lg:py-16 bg-neutral-50/70 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-600 mb-1">
              <Search className="w-3.5 h-3.5" />
              <span>স্মার্ট রক্তদাতা অনুসন্ধান</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              উপযুক্ত রক্তদাতা খুঁজুন
            </h2>
            <p className="text-sm text-neutral-600 mt-1 max-w-xl">
              তারাইল ও পার্শ্ববর্তী এলাকার যাচাইকৃত এবং প্রস্তুত রক্তদাতাদের তালিকা থেকে যোগাযোগ করুন।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 rounded-lg shadow-2xs hover:bg-neutral-50 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>ফিল্টার রিসেট</span>
            </button>
            <button
              onClick={onOpenRegisterDonor}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-2xs transition-colors"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>নিবন্ধন করুন</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Panel */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 mb-8 shadow-2xs space-y-4">
          
          {/* Row 1: Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="রক্তদাতার নাম বা এলাকার নাম লিখে খুঁজুন (উদা: তানভীর, তারাঈল বাজার)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-neutral-50/50 border border-neutral-200 rounded-xl focus:bg-white focus:border-red-600 transition-colors"
            />
          </div>

          {/* Row 2: Dropdown Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            
            {/* Blood Group */}
            <div>
              <label className="block font-medium text-neutral-700 mb-1">রক্তের গ্রুপ</label>
              <select
                value={selectedBloodGroup}
                onChange={e => onSelectBloodGroup(e.target.value as BloodGroup | 'ALL')}
                className="w-full py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-lg font-medium text-neutral-800 focus:border-red-600"
              >
                <option value="ALL">সব রক্তের গ্রুপ (All Groups)</option>
                <option value="A+">A+ (এ পজিটিভ)</option>
                <option value="A-">A- (এ নেগেটিভ)</option>
                <option value="B+">B+ (বি পজিটিভ)</option>
                <option value="B-">B- (বি নেগেটিভ)</option>
                <option value="AB+">AB+ (এবি পজিটিভ)</option>
                <option value="AB-">AB- (এবি নেগেটিভ)</option>
                <option value="O+">O+ (ও পজিটিভ)</option>
                <option value="O-">O- (ও নেগেটিভ)</option>
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block font-medium text-neutral-700 mb-1">জেলা (District)</label>
              <select
                value={selectedDistrict}
                onChange={e => {
                  setSelectedDistrict(e.target.value);
                  setSelectedUpazila('ALL');
                  setSelectedArea('ALL');
                }}
                className="w-full py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-lg font-medium text-neutral-800 focus:border-red-600"
              >
                <option value="ALL">সকল জেলা</option>
                {DISTRICTS.map(dist => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            {/* Upazila */}
            <div>
              <label className="block font-medium text-neutral-700 mb-1">উপজেলা (Upazila)</label>
              <select
                value={selectedUpazila}
                onChange={e => {
                  setSelectedUpazila(e.target.value);
                  setSelectedArea('ALL');
                }}
                disabled={selectedDistrict === 'ALL'}
                className="w-full py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-lg font-medium text-neutral-800 focus:border-red-600 disabled:opacity-50"
              >
                <option value="ALL">সকল উপজেলা</option>
                {upazilaList.map(upz => (
                  <option key={upz} value={upz}>{upz}</option>
                ))}
              </select>
            </div>

            {/* Area/Union (If Tarail is selected) */}
            <div>
              <label className="block font-medium text-neutral-700 mb-1">ইউনিয়ন / এলাকা</label>
              <select
                value={selectedArea}
                onChange={e => setSelectedArea(e.target.value)}
                disabled={selectedUpazila !== 'তারাইল'}
                className="w-full py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-lg font-medium text-neutral-800 focus:border-red-600 disabled:opacity-50"
              >
                <option value="ALL">সব এলাকা (তারাইল)</option>
                {TARAIL_AREAS.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Row 3: Availability quick toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-700 select-none">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={e => setAvailableOnly(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
              />
              <span>শুধুমাত্র প্রস্তুত রক্তদাতা দেখান (Show Available Only)</span>
            </label>

            <span className="text-xs text-neutral-500">
              পাওয়া গেছে: <strong className="text-neutral-900 font-semibold">{filteredDonors.length}</strong> জন রক্তদাতা
            </span>
          </div>

        </div>

        {/* Results Grid */}
        {filteredDonors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDonors.map(donor => {
              // Calculate status badge
              let statusText = 'প্রস্তুত আছেন';
              let statusBg = 'text-emerald-700 bg-emerald-50 border-emerald-200';
              if (donor.availabilityStatus === 'temporarily_unavailable' || !donor.isAvailable) {
                statusText = 'সাময়িক বিরতিতে';
                statusBg = 'text-neutral-600 bg-neutral-100 border-neutral-200';
              } else if (donor.availabilityStatus === 'needs_update') {
                statusText = 'যাচাই প্রয়োজন';
                statusBg = 'text-amber-700 bg-amber-50 border-amber-200';
              }

              return (
                <div
                  key={donor.donorId}
                  onClick={() => onViewDonorProfile(donor)}
                  className="bg-white rounded-2xl border border-neutral-200/90 hover:border-red-300 p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {/* Top row: Avatar, Name, Verified Badge, Blood Group */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {donor.photoURL ? (
                          <img
                            src={donor.photoURL}
                            alt={donor.name}
                            className="w-12 h-12 rounded-xl object-cover border border-neutral-200"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 text-red-700 flex items-center justify-center font-bold text-base">
                            {donor.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-base font-bold text-neutral-900 group-hover:text-red-600 transition-colors">
                              {donor.name}
                            </h3>
                            {donor.isVerified && (
                              <span
                                title="প্রশাসক কর্তৃক যাচাইকৃত রক্তদাতা"
                                className="inline-flex items-center text-blue-600"
                              >
                                <CheckCircle className="w-4 h-4 fill-blue-600 text-white" />
                              </span>
                            )}
                          </div>
                          
                          {/* Location */}
                          <div className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
                            <span>{donor.area}, {donor.upazila}</span>
                          </div>
                        </div>
                      </div>

                      {/* Blood Group Badge */}
                      <div className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-extrabold text-sm shadow-2xs">
                        {donor.bloodGroup}
                      </div>
                    </div>

                    {/* Metadata Strip: Unboxed text with subtle separators */}
                    <div className="mt-4 pt-3 border-t border-neutral-100 text-xs text-neutral-600 space-y-1.5">
                      
                      {/* Availability status line */}
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500">বর্তমান অবস্থা:</span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${statusBg}`}>
                          {statusText}
                        </span>
                      </div>

                      {/* Donation History (Truthful, non-competitive) */}
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500">রক্তদান সংখ্যা:</span>
                        <span className="font-semibold text-neutral-800">
                          {donor.totalDonations} বার{' '}
                          <span className="text-[10px] text-neutral-500 font-normal">
                            ({donor.isDonationCountVerified ? 'যাচাইকৃত' : 'স্বঘোষিত'})
                          </span>
                        </span>
                      </div>

                      {/* Last Donation Date */}
                      {donor.lastDonationDate && (
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500">সর্বশেষ রক্তদান:</span>
                          <span className="font-medium text-neutral-700">{donor.lastDonationDate}</span>
                        </div>
                      )}

                      {/* Rating (if any) */}
                      {donor.ratingCount && donor.ratingCount > 0 ? (
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500">রেটিং:</span>
                          <span className="flex items-center gap-1 font-semibold text-amber-600">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            <span>{donor.averageRating}</span>
                            <span className="text-[10px] text-neutral-400">({donor.ratingCount})</span>
                          </span>
                        </div>
                      ) : null}

                    </div>

                    {/* Bio snippet */}
                    {donor.bio && (
                      <p className="mt-3 text-xs text-neutral-600 line-clamp-2 italic bg-neutral-50/70 p-2 rounded-lg border border-neutral-100">
                        "{donor.bio}"
                      </p>
                    )}
                  </div>

                  {/* Actions: View Profile & Contact */}
                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDonorProfile(donor);
                      }}
                      className="flex-1 py-2 px-3 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>প্রোফাইল</span>
                    </button>

                    {donor.isPhonePublic ? (
                      <div className="flex items-center gap-1 flex-1">
                        <a
                          href={`tel:${donor.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 py-2 px-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>কল দিন</span>
                        </a>
                        <button
                          onClick={(e) => handleCopyPhone(donor.donorId, donor.phone, e)}
                          title="নম্বর কপি করুন"
                          className="p-2 text-xs text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                        >
                          {copiedPhoneId === donor.donorId ? '✓' : 'নম্বর'}
                        </button>
                      </div>
                    ) : (
                      <span className="flex-1 py-2 px-2 text-center text-[11px] font-medium text-neutral-400 bg-neutral-50 rounded-lg border border-neutral-100">
                        ফোন গোপন রাখা
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              কোনো রক্তদাতা পাওয়া যায়নি
            </h3>
            <p className="text-xs text-neutral-600 mt-1 max-w-sm mx-auto">
              আপনার নির্বাচিত ফিল্টারে কোনো রক্তদাতা পাওয়া যায়নি। ফিল্টার পরিবর্তন করে অথবা 'ফিল্টার রিসেট' করে পুনরায় চেষ্টা করুন।
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={handleClearFilters}
                className="py-2 px-4 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg"
              >
                ফিল্টার রিসেট করুন
              </button>
              <button
                onClick={onOpenRegisterDonor}
                className="py-2 px-4 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg"
              >
                প্রথম রক্তদাতা হিসেবে যোগ দিন
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

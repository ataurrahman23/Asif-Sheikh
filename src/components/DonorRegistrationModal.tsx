import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BloodGroup, AvailabilityStatus } from '../types';
import { DISTRICTS, UPAZILAS, TARAIL_AREAS } from '../data/initialData';
import { X, Heart, CheckCircle2, Shield, User, Phone, MapPin } from 'lucide-react';

interface DonorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const DonorRegistrationModal: React.FC<DonorRegistrationModalProps> = ({
  isOpen,
  onClose,
  onOpenAuth
}) => {
  const { currentUser, registerDonor, donors } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [age, setAge] = useState(25);
  const [district, setDistrict] = useState('কিশোরগঞ্জ');
  const [upazila, setUpazila] = useState('তারাইল');
  const [area, setArea] = useState('তারাঈল বাজার');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [isPhonePublic, setIsPhonePublic] = useState(true);
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [totalDonations, setTotalDonations] = useState(0);
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>('available');
  const [bio, setBio] = useState('');
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || '');
  const [consentToPublish, setConsentToPublish] = useState(true);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  // Check if current user already has a donor profile
  const existingDonor = currentUser ? donors.find(d => d.userId === currentUser.userId) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (!name.trim()) {
      setError('আপনার পূর্ণ নাম প্রদান করুন।');
      return;
    }

    if (!phone.trim() || phone.length < 10) {
      setError('সঠিক মোবাইল নম্বর প্রদান করুন (কমপক্ষে ১১ ডিজিট)।');
      return;
    }

    if (age < 18 || age > 65) {
      setError('রক্তদানের জন্য বয়স ১৮ থেকে ৬৫ বছরের মধ্যে হতে হবে।');
      return;
    }

    if (!consentToPublish) {
      setError('রক্তদাতা হিসেবে তথ্য প্রকাশের সম্মতি প্রয়োজন।');
      return;
    }

    const ok = await registerDonor({
      name: name.trim(),
      bloodGroup,
      age: Number(age),
      district,
      upazila,
      area: area.trim(),
      address: address.trim() || undefined,
      phone: phone.trim(),
      isPhonePublic,
      lastDonationDate: lastDonationDate || undefined,
      totalDonations: Number(totalDonations) || 0,
      isDonationCountVerified: false, // Explicitly self-reported
      isAvailable: availabilityStatus === 'available',
      availabilityStatus,
      bio: bio.trim() || undefined,
      photoURL: photoURL.trim() || undefined,
      consentToPublish
    });

    if (ok) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-neutral-200 my-8">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">রক্তদাতা হিসেবে নিবন্ধন করুন</h3>
              <p className="text-[11px] text-red-100">তারাইল ব্লাড ব্যাংক স্বেচ্ছাসেবক কমিউনিটি</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-red-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!currentUser ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <User className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-neutral-900">
              নিবন্ধন করতে প্রথমে সাইন ইন করুন
            </h4>
            <p className="text-xs text-neutral-600 max-w-sm mx-auto">
              প্রোফাইল নিরাপত্তা ও যোগাযোগের নির্ভরযোগ্যতা নিশ্চিত করতে অ্যাকাউন্ট সাইন ইন করা প্রয়োজন।
            </p>
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="py-2.5 px-6 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl"
            >
              গুগল বা ইমেইল দিয়ে সাইন ইন করুন
            </button>
          </div>
        ) : success ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-lg font-bold text-neutral-900">
              অভিনন্দন! আপনার প্রোফাইল তৈরি হয়েছে
            </h4>
            <p className="text-xs text-neutral-600 max-w-sm mx-auto">
              এখন থেকে রক্তের প্রয়োজনে মানুষ আপনার সাথে যোগাযোগ করতে পারবে। আপনি যেকোনো সময় প্রোফাইল থেকে নিজের অবস্থান হালনাগাদ করতে পারবেন।
            </p>
          </div>
        ) : existingDonor ? (
          <div className="p-8 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-blue-600 mx-auto" />
            <h4 className="text-base font-bold text-neutral-900">
              আপনার রক্তদাতা প্রোফাইল ইতিপূর্বেই সক্রিয় আছে!
            </h4>
            <p className="text-xs text-neutral-600">
              নাম: <strong>{existingDonor.name}</strong> ({existingDonor.bloodGroup})<br />
              এলাকা: {existingDonor.area}, {existingDonor.upazila}
            </p>
            <p className="text-xs text-neutral-500">
              তথ্য বা প্রাপ্যতা পরিবর্তন করতে রক্তদাতা সার্চ তালিকা থেকে আপনার নামের প্রোফাইলে ক্লিক করে 'সম্পাদনা' বাটন চাপুন।
            </p>
            <button
              onClick={onClose}
              className="py-2 px-5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg"
            >
              বন্ধ করুন
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 font-medium">
                {error}
              </div>
            )}

            {/* Notice about privacy */}
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-600 text-[11px] flex gap-2">
              <Shield className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
              <span>
                আপনার অ্যাকাউন্ট ইমেইল ঠিকানা কখনো উন্মুক্ত করা হবে না। ফোন নম্বর উন্মুক্ত বা গোপন রাখার পূর্ণ নিয়ন্ত্রণ আপনার হাতে।
              </span>
            </div>

            {/* Name & Blood Group */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-neutral-800 mb-1">
                  পূর্ণ নাম <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="আপনার নাম"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full py-2.5 px-3 bg-neutral-50 border border-neutral-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  রক্তের গ্রুপ <span className="text-red-600">*</span>
                </label>
                <select
                  value={bloodGroup}
                  onChange={e => setBloodGroup(e.target.value as BloodGroup)}
                  className="w-full py-2.5 px-3 bg-neutral-50 border border-neutral-200 rounded-lg font-bold text-red-600"
                >
                  {BLOOD_GROUPS.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Age & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  বয়স (১৮–৬৫) <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  min="18"
                  max="65"
                  required
                  value={age}
                  onChange={e => setAge(parseInt(e.target.value) || 18)}
                  className="w-full py-2.5 px-3 bg-neutral-50 border border-neutral-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  মোবাইল নম্বর <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="০১XXXXXXXXX"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full py-2.5 px-3 bg-neutral-50 border border-neutral-200 rounded-lg font-mono"
                />
              </div>
            </div>

            {/* Location Hierarchy */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-neutral-800 mb-1">জেলা</label>
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-lg"
                >
                  {DISTRICTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">উপজেলা</label>
                <select
                  value={upazila}
                  onChange={e => setUpazila(e.target.value)}
                  className="w-full py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-lg"
                >
                  {(UPAZILAS[district] || ['তারাইল']).map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">ইউনিয়ন / এলাকা</label>
                <input
                  type="text"
                  placeholder="উদা: তারাঈল বাজার, সাচাইল"
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  className="w-full py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-lg"
                />
              </div>
            </div>

            {/* Donation History */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  মোট রক্তদানের সংখ্যা (স্বঘোষিত)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={totalDonations}
                  onChange={e => setTotalDonations(parseInt(e.target.value) || 0)}
                  className="w-full py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  সর্বশেষ রক্তদানের তারিখ (যদি থাকে)
                </label>
                <input
                  type="date"
                  value={lastDonationDate}
                  onChange={e => setLastDonationDate(e.target.value)}
                  className="w-full py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-lg"
                />
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                বর্তমানে রক্তদানে প্রস্তুত আছেন?
              </label>
              <select
                value={availabilityStatus}
                onChange={e => setAvailabilityStatus(e.target.value as AvailabilityStatus)}
                className="w-full py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-lg font-medium"
              >
                <option value="available">হ্যাঁ, প্রস্তুত (সরাসরি যোগাযোগ করুন)</option>
                <option value="temporarily_unavailable">সাময়িক বিরতিতে (কয়েক মাস পর পারব)</option>
              </select>
            </div>

            {/* Bio / Motivation */}
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                ছোট পরিচিতি বা বার্তা (ঐচ্ছিক)
              </label>
              <textarea
                rows={2}
                placeholder="রক্তদানে আপনার আগ্রহ বা বিশেষ কোনো নির্দেশনা থাকলে লিখুন..."
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-lg"
              />
            </div>

            {/* Privacy Controls */}
            <div className="space-y-2 pt-2 border-t border-neutral-200">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isPhonePublic}
                  onChange={e => setIsPhonePublic(e.target.checked)}
                  className="rounded text-red-600 w-4 h-4"
                />
                <span className="text-[11px] text-neutral-800 font-medium">
                  পাবলিক কার্ডে ফোন নম্বর সরাসরি প্রকাশে সম্মতি দিচ্ছি
                </span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={consentToPublish}
                  onChange={e => setConsentToPublish(e.target.checked)}
                  className="rounded text-red-600 w-4 h-4 mt-0.5"
                />
                <span className="text-[11px] text-neutral-600 leading-normal">
                  আমি তারাইল ব্লাড ব্যাংকে স্বেচ্ছায় রক্তদাতা হিসেবে নিবন্ধন করছি এবং আমার প্রদত্ত তথ্য সঠিক।
                </span>
              </label>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>রক্তদাতা প্রোফাইল সংরক্ষণ করুন</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

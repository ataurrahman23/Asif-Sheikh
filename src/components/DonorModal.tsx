import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DonorProfile, BloodGroup, AvailabilityStatus } from '../types';
import {
  X,
  Phone,
  CheckCircle,
  MapPin,
  Calendar,
  Heart,
  Star,
  Flag,
  Edit2,
  Save,
  Shield,
  Clock,
  Share2
} from 'lucide-react';

interface DonorModalProps {
  donor: DonorProfile | null;
  onClose: () => void;
  onOpenReport: (donor: DonorProfile) => void;
  onOpenAuth: () => void;
}

export const DonorModal: React.FC<DonorModalProps> = ({
  donor,
  onClose,
  onOpenReport,
  onOpenAuth
}) => {
  const { currentUser, updateDonorProfile, ratings, submitRating } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [ratingStars, setRatingStars] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Form states for donor editing their own profile
  const [editAvailability, setEditAvailability] = useState<AvailabilityStatus>(
    donor?.availabilityStatus || 'available'
  );
  const [editIsPhonePublic, setEditIsPhonePublic] = useState(donor?.isPhonePublic ?? true);
  const [editPhone, setEditPhone] = useState(donor?.phone || '');
  const [editLastDonationDate, setEditLastDonationDate] = useState(donor?.lastDonationDate || '');
  const [editTotalDonations, setEditTotalDonations] = useState(donor?.totalDonations || 0);
  const [editBio, setEditBio] = useState(donor?.bio || '');
  const [editArea, setEditArea] = useState(donor?.area || '');
  const [editAddress, setEditAddress] = useState(donor?.address || '');

  if (!donor) return null;

  const isOwner = currentUser?.userId === donor.userId;
  const isAdmin = currentUser?.role === 'admin';
  const canEdit = isOwner || isAdmin;

  // Donor's reviews
  const donorReviews = ratings.filter(r => r.donorId === donor.donorId && !r.isModerated);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(donor.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleSaveProfile = async () => {
    await updateDonorProfile(donor.donorId, {
      availabilityStatus: editAvailability,
      isAvailable: editAvailability === 'available',
      isPhonePublic: editIsPhonePublic,
      phone: editPhone,
      lastDonationDate: editLastDonationDate,
      totalDonations: Number(editTotalDonations),
      bio: editBio,
      area: editArea,
      address: editAddress
    });
    setIsEditing(false);
  };

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    const success = await submitRating(donor.donorId, ratingStars, reviewText);
    if (success) {
      setRatingSubmitted(true);
      setReviewText('');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-neutral-200 my-8">
        
        {/* Modal Top Bar */}
        <div className="bg-neutral-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
              রক্তদাতা প্রোফাইল
            </span>
            <span className="text-neutral-500">·</span>
            <span className="text-xs text-neutral-300">আইডি: {donor.donorId}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Header Card: Avatar, Name, Blood Group, Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
            <div className="flex items-center gap-4">
              {donor.photoURL ? (
                <img
                  src={donor.photoURL}
                  alt={donor.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-neutral-200 shadow-2xs"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-center font-bold text-2xl">
                  {donor.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-neutral-900">{donor.name}</h2>
                  {donor.isVerified ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg">
                      <CheckCircle className="w-3.5 h-3.5 fill-blue-600 text-white" />
                      <span>যাচাইকৃত রক্তদাতা</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                      স্বেচ্ছাসেবক
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{donor.area}, {donor.upazila}, {donor.district}</span>
                </div>
              </div>
            </div>

            {/* Blood Group Display */}
            <div className="flex items-center sm:flex-col items-end gap-2">
              <div className="px-4 py-2 rounded-xl bg-red-600 text-white font-extrabold text-xl shadow-sm text-center">
                {donor.bloodGroup}
              </div>
              <span className="text-[11px] text-neutral-400">রক্তের গ্রুপ</span>
            </div>
          </div>

          {/* Edit Profile Form (for profile owner) */}
          {canEdit && isEditing ? (
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <h3 className="text-sm font-bold text-neutral-900">প্রোফাইল সম্পাদনা করুন</h3>
                <span className="text-xs text-neutral-500">অনুমোদিত ফিল্ডগুলো হালনাগাদ করুন</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">উপলব্ধতার স্ট্যাটাস</label>
                  <select
                    value={editAvailability}
                    onChange={e => setEditAvailability(e.target.value as AvailabilityStatus)}
                    className="w-full py-2 px-3 bg-white border border-neutral-300 rounded-lg font-medium"
                  >
                    <option value="available">প্রস্তুত (Available to contact)</option>
                    <option value="temporarily_unavailable">সাময়িক বিরতিতে (Temporarily unavailable)</option>
                    <option value="needs_update">যাচাই প্রয়োজন (Needs update)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">ফোন নম্বর</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    className="w-full py-2 px-3 bg-white border border-neutral-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">সর্বশেষ রক্তদানের তারিখ</label>
                  <input
                    type="date"
                    value={editLastDonationDate}
                    onChange={e => setEditLastDonationDate(e.target.value)}
                    className="w-full py-2 px-3 bg-white border border-neutral-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">মোট রক্তদান সংখ্যা (স্বঘোষিত)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editTotalDonations}
                    onChange={e => setEditTotalDonations(parseInt(e.target.value) || 0)}
                    className="w-full py-2 px-3 bg-white border border-neutral-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">এলাকা / ইউনিয়ন</label>
                  <input
                    type="text"
                    value={editArea}
                    onChange={e => setEditArea(e.target.value)}
                    className="w-full py-2 px-3 bg-white border border-neutral-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">বিস্তারিত ঠিকানা (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={e => setEditAddress(e.target.value)}
                    className="w-full py-2 px-3 bg-white border border-neutral-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1 text-xs">ছোট পরিচিতি / বায়ো</label>
                <textarea
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  rows={2}
                  className="w-full py-2 px-3 text-xs bg-white border border-neutral-300 rounded-lg"
                />
              </div>

              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-medium text-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editIsPhonePublic}
                    onChange={e => setEditIsPhonePublic(e.target.checked)}
                    className="rounded text-red-600 w-4 h-4"
                  />
                  <span>ফোন নম্বর সবার জন্য উন্মুক্ত রাখুন</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-200 rounded-lg"
                  >
                    বাতিল
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>সংরক্ষণ করুন</span>
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* Key Facts & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            
            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/80">
              <span className="text-neutral-500 block">উপলব্ধতার স্ট্যাটাস</span>
              <div className="flex items-center gap-2 mt-1">
                {donor.availabilityStatus === 'available' ? (
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                    সরাসরি প্রস্তুত (Available)
                  </span>
                ) : donor.availabilityStatus === 'temporarily_unavailable' ? (
                  <span className="px-2.5 py-1 rounded-md text-xs font-medium text-neutral-600 bg-neutral-100 border border-neutral-200">
                    সাময়িক বিরতিতে (Unavailable)
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-md text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200">
                    যাচাই প্রয়োজন (Needs Update)
                  </span>
                )}
                <span className="text-[11px] text-neutral-400">
                  আপডেট: {donor.lastStatusUpdate || 'সম্প্রতি'}
                </span>
              </div>
            </div>

            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/80">
              <span className="text-neutral-500 block">রক্তদান সংখ্যা (নন-র‍্যাংকিং)</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-lg font-bold text-neutral-900">{donor.totalDonations} বার</span>
                <span className="text-[11px] text-neutral-500">
                  ({donor.isDonationCountVerified ? 'অ্যাডমিন কর্তৃক যাচাইকৃত' : 'স্বঘোষিত হিসেব'})
                </span>
              </div>
            </div>

            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/80">
              <span className="text-neutral-500 block">সর্বশেষ রক্তদানের তারিখ</span>
              <div className="mt-1 font-semibold text-neutral-800 text-sm">
                {donor.lastDonationDate || 'উল্লেখ নেই'}
              </div>
            </div>

            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/80">
              <span className="text-neutral-500 block">বয়স ও গোপনীয়তা</span>
              <div className="mt-1 font-semibold text-neutral-800 text-sm">
                {donor.age ? `${donor.age} বছর` : 'সুরক্ষিত'}
              </div>
            </div>

          </div>

          {/* Introduction / Bio */}
          {donor.bio && (
            <div className="bg-red-50/40 border border-red-100 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-red-900 mb-1">রক্তদাতার বার্তা:</h4>
              <p className="text-xs text-neutral-700 leading-relaxed font-normal">
                {donor.bio}
              </p>
            </div>
          )}

          {/* Contact Actions Area */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-neutral-500 block">যোগাযোগের নম্বর:</span>
              {donor.isPhonePublic ? (
                <div className="text-base font-bold text-neutral-900 mt-0.5 tracking-wide">
                  {donor.phone}
                </div>
              ) : (
                <div className="text-xs font-medium text-neutral-500 mt-0.5">
                  ফোন নম্বর রক্তদাতার সম্মতিক্রমে গোপন রাখা হয়েছে।
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {donor.isPhonePublic ? (
                <>
                  <a
                    href={`tel:${donor.phone}`}
                    className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>সরাসরি কল দিন</span>
                  </a>
                  <button
                    onClick={handleCopyPhone}
                    className="px-3 py-2 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    {copiedPhone ? 'কপি হয়েছে ✓' : 'নম্বর কপি'}
                  </button>
                </>
              ) : null}

              {canEdit && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-2 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-100 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>সম্পাদনা</span>
                </button>
              )}
            </div>
          </div>

          {/* Reviews & Ratings Section */}
          <div className="pt-4 border-t border-neutral-100 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-neutral-900">
                মতামত ও রেটিং ({donorReviews.length})
              </h4>
              {donor.averageRating ? (
                <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span>{donor.averageRating} / ৫.০</span>
                </div>
              ) : null}
            </div>

            {/* Existing Reviews List */}
            {donorReviews.length > 0 ? (
              <div className="space-y-2.5 max-h-48 overflow-y-auto">
                {donorReviews.map(rev => (
                  <div key={rev.ratingId} className="bg-neutral-50 border border-neutral-200/70 p-3 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold text-neutral-800">
                      <span>{rev.raterName}</span>
                      <div className="flex text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    {rev.review && (
                      <p className="text-neutral-600">{rev.review}</p>
                    )}
                    <span className="text-[10px] text-neutral-400 block pt-0.5">
                      {rev.createdAt.split('T')[0]}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-500">এখনো কোনো মতামত দেওয়া হয়নি।</p>
            )}

            {/* Leave a Rating Form */}
            {!isOwner && (
              <form onSubmit={handleRatingSubmit} className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-2.5 text-xs">
                <span className="font-semibold text-neutral-800 block">এই রক্তদাতাকে রেটিং দিন</span>
                
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRatingStars(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-5 h-5 ${star <= ratingStars ? 'fill-amber-400 text-amber-500' : 'text-neutral-300'}`} />
                    </button>
                  ))}
                  <span className="text-neutral-600 font-semibold ml-2">({ratingStars} স্টার)</span>
                </div>

                <input
                  type="text"
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  placeholder="আপনার অভিজ্ঞতা লিখুন (ঐচ্ছিক)..."
                  className="w-full py-2 px-3 text-xs bg-white border border-neutral-300 rounded-lg"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-neutral-500">
                    রেটিং দেওয়ার জন্য লগইন থাকতে হবে।
                  </span>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors"
                  >
                    {ratingSubmitted ? 'রেটিং দেওয়া হয়েছে ✓' : 'রেটিং জমা দিন'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Safety Reporting Area */}
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span>কোনো অসঙ্গতি বা সন্দেহজনক আচরণ দেখেছেন?</span>
            <button
              onClick={() => onOpenReport(donor)}
              className="inline-flex items-center gap-1 text-neutral-600 hover:text-red-600 font-medium py-1 px-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>রিপোর্ট করুন</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

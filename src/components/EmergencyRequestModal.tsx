import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BloodGroup, RequestUrgency } from '../types';
import { DISTRICTS, UPAZILAS } from '../data/initialData';
import { X, AlertCircle, CheckCircle, Send } from 'lucide-react';

interface EmergencyRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const EmergencyRequestModal: React.FC<EmergencyRequestModalProps> = ({ isOpen, onClose }) => {
  const { createEmergencyRequest } = useApp();

  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [units, setUnits] = useState(1);
  const [hospitalName, setHospitalName] = useState('');
  const [district, setDistrict] = useState('কিশোরগঞ্জ');
  const [upazila, setUpazila] = useState('তারাইল');
  const [area, setArea] = useState('');
  const [requiredDate, setRequiredDate] = useState('জরুরি (আজকের মধ্যে)');
  const [urgency, setUrgency] = useState<RequestUrgency>('emergency');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [consentToPublish, setConsentToPublish] = useState(true);

  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!patientName.trim()) {
      setError('রোগী বা অনুরোধকারীর নাম প্রদান করুন।');
      return;
    }
    if (!hospitalName.trim()) {
      setError('হাসপাতাল বা চিকিৎসা কেন্দ্রের নাম প্রদান করুন।');
      return;
    }
    if (!contactPhone.trim() || contactPhone.length < 10) {
      setError('সঠিক যোগাযোগের ফোন নম্বর প্রদান করুন (কমপক্ষে ১১ ডিজিট)।');
      return;
    }
    if (!consentToPublish) {
      setError('পাবলিক নোটিশে নম্বর প্রকাশের সম্মতি দিন।');
      return;
    }

    const success = await createEmergencyRequest({
      patientName: patientName.trim(),
      bloodGroup,
      units: Number(units) || 1,
      hospitalName: hospitalName.trim(),
      district,
      upazila,
      area: area.trim() || undefined,
      requiredDate,
      urgency,
      contactPhone: contactPhone.trim(),
      notes: notes.trim() || undefined,
      consentToPublish
    });

    if (success) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
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
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-200 my-8">
        
        {/* Modal Header */}
        <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-200" />
            <h3 className="text-lg font-bold">জরুরি রক্তের অনুরোধ জানান</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-red-100 hover:text-white hover:bg-red-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-lg font-bold text-neutral-900">
              অনুরোধটি সফলভাবে প্রকাশিত হয়েছে!
            </h4>
            <p className="text-xs text-neutral-600 max-w-sm mx-auto">
              রক্তদাতারা আপনার যোগাযোগের নম্বরে সরাসরি ফোন দিতে পারবেন। তারাইল ব্লাড ব্যাংক আপনার রোগীর দ্রুত সুস্থতা কামনা করে।
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 font-medium">
                {error}
              </div>
            )}

            {/* Blood group & Units */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  প্রয়োজনীয় রক্তের গ্রুপ <span className="text-red-600">*</span>
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

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  রক্তের পরিমাণ (ব্যাগ)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={units}
                  onChange={e => setUnits(parseInt(e.target.value) || 1)}
                  className="w-full py-2.5 px-3 bg-neutral-50 border border-neutral-200 rounded-lg"
                />
              </div>
            </div>

            {/* Patient Name & Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  রোগীর নাম / পরিচয় <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="উদা: আব্দুল করিম (বয়স ৫০)"
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  className="w-full py-2.5 px-3 bg-neutral-50 border border-neutral-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  জরুরিতা (Urgency)
                </label>
                <select
                  value={urgency}
                  onChange={e => setUrgency(e.target.value as RequestUrgency)}
                  className="w-full py-2.5 px-3 bg-neutral-50 border border-neutral-200 rounded-lg font-medium"
                >
                  <option value="emergency">জরুরি (অবিলম্বে / এখনই)</option>
                  <option value="today">আজকের মধ্যে</option>
                  <option value="tomorrow">আগামীকাল</option>
                  <option value="scheduled">পরিকল্পিত অপারেশনের তারিখ</option>
                </select>
              </div>
            </div>

            {/* Hospital Name */}
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                হাসপাতাল বা ক্লিনিকের নাম <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="উদা: তারাঈল উপজেলা স্বাস্থ্য কমপ্লেক্স / কিশোরগঞ্জ সদর হাসপাতাল"
                value={hospitalName}
                onChange={e => setHospitalName(e.target.value)}
                className="w-full py-2.5 px-3 bg-neutral-50 border border-neutral-200 rounded-lg"
              />
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-3">
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
            </div>

            {/* Contact phone */}
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                যোগাযোগের মোবাইল নম্বর <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="০১XXXXXXXXX"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                className="w-full py-2.5 px-3 bg-neutral-50 border border-neutral-200 rounded-lg font-mono text-sm"
              />
              <span className="text-[11px] text-neutral-500 mt-1 block">
                এই নম্বরে রক্তদাতারা সরাসরি কল করে যোগাযোগ করবেন।
              </span>
            </div>

            {/* Notes */}
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                রোগের বিবরণ বা বিশেষ নির্দেশনা (ঐচ্ছিক)
              </label>
              <textarea
                rows={2}
                placeholder="উদা: রোগীর সিজার হবে, ২ জন রক্তদাতা প্রয়োজন। রক্তের গ্রুপ নিশ্চিত করা হয়েছে।"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-lg"
              />
            </div>

            {/* Consent Checkbox */}
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={consentToPublish}
                  onChange={e => setConsentToPublish(e.target.checked)}
                  className="rounded text-red-600 w-4 h-4 mt-0.5"
                />
                <span className="text-[11px] text-neutral-700 leading-normal">
                  আমি নিশ্চিত করছি যে রক্তের তথ্যাবলি সঠিক এবং আমি স্বেচ্ছায় পাবলিক নোটিশে রক্তের প্রয়োজন ও ফোন নম্বর প্রকাশে সম্মতি দিচ্ছি।
                </span>
              </label>
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>অনুরোধ প্রকাশ করুন</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

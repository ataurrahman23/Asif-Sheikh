import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ReportReason } from '../types';
import { X, Flag, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'donor' | 'request';
  targetId: string;
  targetName: string;
  onOpenAuth: () => void;
}

const REPORT_REASONS: ReportReason[] = [
  'ভুল তথ্য বা ভুয়া প্রোফাইল',
  'রক্তের জন্য টাকা দাবি',
  'হয়রানি বা অসদাচরণ',
  'ভুল রক্তদানের তথ্য',
  'ভুয়া জরুরি অনুরোধ',
  'অন্যান্য'
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetName,
  onOpenAuth
}) => {
  const { currentUser, submitReport } = useApp();

  const [reason, setReason] = useState<ReportReason>('ভুল তথ্য বা ভুয়া প্রোফাইল');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    const success = await submitReport(targetType, targetId, targetName, reason, description);
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200">
        
        {/* Header */}
        <div className="bg-neutral-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-red-500" />
            <h3 className="text-base font-bold">অভিযোগ বা রিপোর্ট দাখিল করুন</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!currentUser ? (
          <div className="p-6 text-center space-y-4 text-xs">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
            <h4 className="font-bold text-neutral-900 text-sm">
              রিপোর্ট জমা দিতে লগইন করা আবশ্যক
            </h4>
            <p className="text-neutral-600">
              ভুয়া অভিযোগ রোধ করতে এবং নিরাপদ কমিউনিটি বজায় রাখতে রিপোর্টকারীর অ্যাকাউন্ট পরিচয় প্রয়োজন।
            </p>
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="py-2.5 px-5 font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl"
            >
              সাইন ইন করুন
            </button>
          </div>
        ) : submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-neutral-900">
              রিপোর্টটি সফলভাবে জমা হয়েছে
            </h4>
            <p className="text-xs text-neutral-600">
              প্রশাসক দল আপনার অভিযোগটি নিবিড়ভাবে পর্যালোচনা করবেন এবং প্রয়োজনীয় ব্যবস্থা গ্রহণ করবেন।
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl font-medium">
                {error}
              </div>
            )}

            <div>
              <span className="text-neutral-500 block mb-0.5">অভিযোগের বিষয়বস্তু:</span>
              <strong className="text-neutral-900 font-bold block text-sm">
                {targetName} ({targetType === 'donor' ? 'রক্তদাতা' : 'জরুরি অনুরোধ'})
              </strong>
            </div>

            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                অভিযোগের কারণ নির্বাচন করুন <span className="text-red-600">*</span>
              </label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value as ReportReason)}
                className="w-full py-2 px-3 bg-neutral-50 border border-neutral-300 rounded-lg font-medium text-neutral-800"
              >
                {REPORT_REASONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                বিস্তারিত বিবরণ (ঐচ্ছিক)
              </label>
              <textarea
                rows={3}
                placeholder="ঘটনাক্রম বা কী ধরনের সমস্যা লক্ষ্য করেছেন তা লিখুন..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full py-2 px-3 bg-neutral-50 border border-neutral-300 rounded-lg text-xs"
              />
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
              <strong>সতর্কতা:</strong> মিথ্যা বা উদ্দেশ্যপ্রণোদিত রিপোর্ট দাখিল করা হলে অ্যাকাউন্ট স্থগিত করা হতে পারে।
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-neutral-600 bg-neutral-100 rounded-lg hover:bg-neutral-200"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-2xs"
              >
                রিপোর্ট জমা দিন
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

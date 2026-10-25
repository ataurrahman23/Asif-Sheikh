import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, LogIn, Mail, Shield, User, Heart, Lock } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginAsGoogle, loginWithEmail, currentUser } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('সঠিক ইমেইল ঠিকানা প্রদান করুন।');
      return;
    }
    if (password.length < 6) {
      setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }

    loginWithEmail(email, name || undefined, 'user');
    onClose();
  };

  const handleGoogleLogin = (customEmail?: string, customName?: string) => {
    loginAsGoogle(customEmail, customName);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogIn className="w-5 h-5 text-white" />
            <h3 className="text-base font-bold">
              {mode === 'signin' ? 'সাইন ইন করুন' : 'নতুন অ্যাকাউন্ট তৈরি করুন'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-red-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Google Sign In Button */}
          <div>
            <button
              onClick={() => handleGoogleLogin()}
              className="w-full py-2.5 px-4 text-xs font-semibold text-neutral-800 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>গুগল দিয়ে সাইন ইন (Google Sign-In)</span>
            </button>
            <p className="text-[11px] text-neutral-400 text-center mt-1">
              দ্রুত ও নিরাপদ অথেনটিকেশন (পাসওয়ার্ড ছাড়া)
            </p>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-white px-2 text-neutral-400">অথবা ইমেইল দিয়ে</span>
            </div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            {mode === 'signup' && (
              <div>
                <label className="block font-medium text-neutral-700 mb-1">আপনার নাম</label>
                <input
                  type="text"
                  required
                  placeholder="উদা: আব্দুল করিম"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-lg"
                />
              </div>
            )}

            <div>
              <label className="block font-medium text-neutral-700 mb-1">ইমেইল ঠিকানা</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-lg font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">পাসওয়ার্ড</label>
              <input
                type="password"
                required
                placeholder="কমপক্ষে ৬ অক্ষর"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors cursor-pointer"
            >
              {mode === 'signin' ? 'সাইন ইন করুন' : 'নিবন্ধন সম্পন্ন করুন'}
            </button>
          </form>

          {/* Mode Switcher */}
          <div className="text-center pt-2 text-[11px] text-neutral-600">
            {mode === 'signin' ? (
              <span>
                নতুন ব্যবহারকারী?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-red-600 font-bold hover:underline"
                >
                  নতুন একাউন্ট খুলুন
                </button>
              </span>
            ) : (
              <span>
                ইতিমধ্যে একাউন্ট আছে?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-red-600 font-bold hover:underline"
                >
                  লগইন করুন
                </button>
              </span>
            )}
          </div>

          {/* Quick Demo Switcher for Preview Testing */}
          <div className="pt-3 border-t border-neutral-100">
            <span className="text-[11px] font-semibold text-neutral-500 block mb-2">
              প্রিভিউ ও টেস্টিং কুইক লগইন:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleGoogleLogin('asifjony2022@gmail.com', 'প্রধান প্রশাসক (Asif)')}
                className="p-2 text-left bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <div>
                  <div className="font-bold text-[10px] leading-tight">অ্যাডমিন হিসেবে</div>
                  <div className="text-[9px] text-neutral-400 truncate">asifjony2022@gmail.com</div>
                </div>
              </button>

              <button
                onClick={() => handleGoogleLogin('donor.test@gmail.com', 'তানভীর আহমেদ (রক্তদাতা)')}
                className="p-2 text-left bg-red-50 hover:bg-red-100 text-red-900 border border-red-200 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Heart className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <div>
                  <div className="font-bold text-[10px] leading-tight">রক্তদাতা হিসেবে</div>
                  <div className="text-[9px] text-red-600 truncate">স্বেচ্ছাসেবক প্রোফাইল</div>
                </div>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

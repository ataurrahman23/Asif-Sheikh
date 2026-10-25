import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Droplet, Bell, Menu, X, Shield, User, LogIn, LogOut, HeartHandshake } from 'lucide-react';

interface HeaderProps {
  onOpenAuth: () => void;
  onOpenRegisterDonor: () => void;
  onOpenEmergencyModal: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAuth,
  onOpenRegisterDonor,
  onOpenEmergencyModal,
  onNavigate
}) => {
  const { currentUser, logout, emergencyRequests } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const openEmergencyCount = emergencyRequests.filter(r => r.status === 'open').length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => onNavigate('hero')}
            className="flex items-center gap-2.5 text-left group whitespace-nowrap shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-sm shadow-red-200 group-hover:bg-red-700 transition-colors">
              <Droplet className="w-6 h-6 fill-white text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-neutral-900 group-hover:text-red-600 transition-colors">
                তারাইল ব্লাড ব্যাংক
              </span>
              <span className="block text-xs font-medium text-neutral-500">
                Tarail Blood Bank
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (single-line, clean typography) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-neutral-700">
            <button
              onClick={() => onNavigate('hero')}
              className="hover:text-red-600 transition-colors whitespace-nowrap shrink-0 py-1"
            >
              হোম
            </button>
            <button
              onClick={() => onNavigate('donors')}
              className="hover:text-red-600 transition-colors whitespace-nowrap shrink-0 py-1"
            >
              রক্তদাতা খুঁজুন
            </button>
            <button
              onClick={() => onNavigate('emergency')}
              className="hover:text-red-600 transition-colors whitespace-nowrap shrink-0 py-1 relative"
            >
              জরুরি অনুরোধ
              {openEmergencyCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[11px] font-semibold bg-red-100 text-red-700 rounded">
                  {openEmergencyCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onNavigate('hospitals')}
              className="hover:text-red-600 transition-colors whitespace-nowrap shrink-0 py-1"
            >
              হাসপাতাল তালিকা
            </button>
            <button
              onClick={() => onNavigate('safety')}
              className="hover:text-red-600 transition-colors whitespace-nowrap shrink-0 py-1"
            >
              রক্তদান নির্দেশিকা
            </button>
            <button
              onClick={() => onNavigate('developer')}
              className="hover:text-red-600 transition-colors whitespace-nowrap shrink-0 py-1 text-neutral-500"
            >
              ডেভেলপার
            </button>
          </nav>

          {/* Zone 3: Primary Action & Auth Zone */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Functional Notification Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-neutral-600 hover:text-red-600 hover:bg-neutral-100 rounded-lg transition-colors relative"
                title="বিজ্ঞপ্তি ও জরুরি অনুরোধ"
                aria-label="বিজ্ঞপ্তি"
              >
                <Bell className="w-5 h-5" />
                {openEmergencyCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-neutral-200 rounded-xl shadow-xl p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <h4 className="text-sm font-semibold text-neutral-900">জরুরি নোটিফিকেশন</h4>
                    <span className="text-xs text-neutral-500">{openEmergencyCount}টি সক্রিয় অনুরোধ</span>
                  </div>
                  <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto">
                    {emergencyRequests.filter(r => r.status === 'open').slice(0, 3).map(req => (
                      <div
                        key={req.requestId}
                        onClick={() => {
                          setShowNotifications(false);
                          onNavigate('emergency');
                        }}
                        className="p-2.5 bg-red-50/60 hover:bg-red-50 rounded-lg cursor-pointer transition-colors border border-red-100/60"
                      >
                        <div className="flex items-center justify-between text-xs font-semibold text-red-700">
                          <span>{req.bloodGroup} রক্ত প্রয়োজন ({req.units} ব্যাগ)</span>
                          <span className="text-[11px] text-neutral-500">{req.urgency === 'emergency' ? 'জরুরি' : 'আজকেই'}</span>
                        </div>
                        <p className="text-xs text-neutral-700 mt-1 line-clamp-1">{req.hospitalName}</p>
                      </div>
                    ))}
                    {openEmergencyCount === 0 && (
                      <p className="text-xs text-neutral-500 text-center py-4">বর্তমানে কোনো সক্রিয় জরুরি অনুরোধ নেই।</p>
                    )}
                  </div>
                  <div className="pt-3 border-t border-neutral-100 mt-3 text-center">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        onNavigate('emergency');
                      }}
                      className="text-xs font-medium text-red-600 hover:text-red-700"
                    >
                      সব জরুরি অনুরোধ দেখুন →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Emergency CTA */}
            <button
              onClick={onOpenEmergencyModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors whitespace-nowrap"
            >
              জরুরি রক্ত লাগবে?
            </button>

            {/* User Profile / Login */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                {currentUser.role === 'admin' ? (
                  <button
                    onClick={() => onNavigate('admin')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>অ্যাডমিন প্যানেল</span>
                  </button>
                ) : (
                  <button
                    onClick={onOpenRegisterDonor}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <HeartHandshake className="w-4 h-4" />
                    <span>রক্তদাতা প্রোফাইল</span>
                  </button>
                )}
                
                <div className="relative group">
                  <button
                    onClick={logout}
                    title={`${currentUser.name} (${currentUser.role}) - লগআউট করতে ক্লিক করুন`}
                    className="flex items-center gap-2 p-1.5 text-neutral-700 hover:text-red-600 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt={currentUser.name}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-neutral-200"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
                        {currentUser.name.charAt(0)}
                      </div>
                    )}
                    <LogOut className="w-4 h-4 text-neutral-400 hover:text-red-600" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors whitespace-nowrap"
              >
                <LogIn className="w-4 h-4" />
                <span>লগইন / নিবন্ধন</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg"
              aria-label="মেনু খুলুন"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-neutral-200 space-y-2">
            <button
              onClick={() => {
                onNavigate('hero');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-red-50 hover:text-red-600 rounded-lg"
            >
              হোম
            </button>
            <button
              onClick={() => {
                onNavigate('donors');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-red-50 hover:text-red-600 rounded-lg"
            >
              রক্তদাতা খুঁজুন
            </button>
            <button
              onClick={() => {
                onNavigate('emergency');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-red-50 hover:text-red-600 rounded-lg flex items-center justify-between"
            >
              <span>জরুরি অনুরোধ</span>
              {openEmergencyCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
                  {openEmergencyCount} সক্রিয়
                </span>
              )}
            </button>
            <button
              onClick={() => {
                onNavigate('hospitals');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-red-50 hover:text-red-600 rounded-lg"
            >
              হাসপাতাল তালিকা
            </button>
            <button
              onClick={() => {
                onNavigate('safety');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-red-50 hover:text-red-600 rounded-lg"
            >
              রক্তদান নির্দেশিকা ও যোগ্যতা
            </button>
            <button
              onClick={() => {
                onNavigate('developer');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-red-50 hover:text-red-600 rounded-lg"
            >
              ডেভেলপার
            </button>

            <div className="pt-3 border-t border-neutral-100 space-y-2">
              <button
                onClick={() => {
                  onOpenEmergencyModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 text-xs font-semibold text-center text-red-700 bg-red-50 rounded-lg"
              >
                জরুরি রক্ত লাগবে? অনুরোধ জানান
              </button>
              {currentUser && currentUser.role === 'admin' && (
                <button
                  onClick={() => {
                    onNavigate('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-center text-white bg-neutral-900 rounded-lg flex items-center justify-center gap-1.5"
                >
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>অ্যাডমিন ড্যাশবোর্ড</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EmergencyRequest, BloodGroup, RequestUrgency, RequestStatus } from '../types';
import { DISTRICTS, UPAZILAS } from '../data/initialData';
import {
  AlertCircle,
  Clock,
  Phone,
  PlusCircle,
  MapPin,
  CheckCircle2,
  XCircle,
  Flag,
  Share2,
  Calendar,
  Building2
} from 'lucide-react';

interface EmergencyRequestsProps {
  onOpenReportRequest: (req: EmergencyRequest) => void;
  onOpenEmergencyModal: () => void;
}

export const EmergencyRequests: React.FC<EmergencyRequestsProps> = ({
  onOpenReportRequest,
  onOpenEmergencyModal
}) => {
  const { emergencyRequests, currentUser, updateEmergencyStatus } = useApp();

  const [filterBloodGroup, setFilterBloodGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<RequestStatus | 'ALL'>('open');

  const filtered = emergencyRequests.filter(req => {
    if (filterBloodGroup !== 'ALL' && req.bloodGroup !== filterBloodGroup) return false;
    if (filterStatus !== 'ALL' && req.status !== filterStatus) return false;
    return true;
  });

  const getUrgencyBadge = (urgency: RequestUrgency) => {
    switch (urgency) {
      case 'emergency':
        return <span className="px-2 py-0.5 text-xs font-bold text-red-700 bg-red-100 border border-red-200 rounded-md">জরুরি (এখনই)</span>;
      case 'today':
        return <span className="px-2 py-0.5 text-xs font-semibold text-amber-700 bg-amber-100 border border-amber-200 rounded-md">আজকের মধ্যে</span>;
      case 'tomorrow':
        return <span className="px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 border border-blue-200 rounded-md">আগামীকাল</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-medium text-neutral-600 bg-neutral-100 border border-neutral-200 rounded-md">পরিকল্পিত</span>;
    }
  };

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'open':
        return <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">চলমান (Open)</span>;
      case 'in_progress':
        return <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">রক্তদাতা খোঁজা হচ্ছে</span>;
      case 'fulfilled':
        return <span className="text-xs font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">রক্ত সংগ্রহ সম্পন্ন</span>;
      case 'closed':
        return <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">বন্ধ</span>;
      default:
        return null;
    }
  };

  return (
    <section id="emergency" className="py-12 lg:py-16 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Create Request CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-600 mb-1">
              <AlertCircle className="w-4 h-4" />
              <span>জরুরি রক্তের প্রয়োজনের লাইভ তালিকা</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              জরুরি রক্তের অনুরোধ
            </h2>
            <p className="text-sm text-neutral-600 mt-1 max-w-xl">
              হাসপাতালে ভর্তি রোগীদের জন্য রক্ত প্রয়োজন হলে অবিলম্বে যোগাযোগ করুন অথবা আপনার নিজের রক্তের প্রয়োজন প্রকাশ করুন।
            </p>
          </div>

          <button
            onClick={onOpenEmergencyModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:scale-[0.99] rounded-xl shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>জরুরি রক্ত লাগবে? অনুরোধ জানান</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-neutral-50 border border-neutral-200 rounded-xl mb-6 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-neutral-700">স্ট্যাটাস:</span>
            {(['open', 'in_progress', 'fulfilled', 'ALL'] as const).map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  filterStatus === st
                    ? 'bg-red-600 text-white shadow-2xs'
                    : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {st === 'open' ? 'চলমান অনুরোধ' : st === 'in_progress' ? 'প্রক্রিয়াধীন' : st === 'fulfilled' ? 'সম্পন্ন' : 'সবগুলো'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-700">রক্তের গ্রুপ:</span>
            <select
              value={filterBloodGroup}
              onChange={e => setFilterBloodGroup(e.target.value as BloodGroup | 'ALL')}
              className="py-1.5 px-3 bg-white border border-neutral-200 rounded-lg text-xs font-medium"
            >
              <option value="ALL">সব গ্রুপ</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>

        {/* Request Cards Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(req => {
              const isOwner = currentUser?.userId === req.userId;
              const isAdmin = currentUser?.role === 'admin';
              const canManage = isOwner || isAdmin;

              return (
                <div
                  key={req.requestId}
                  className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xs hover:border-red-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    
                    {/* Header: Blood Group, Units, Urgency */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 rounded-xl bg-red-600 text-white font-extrabold text-base flex flex-col items-center justify-center shadow-2xs">
                          <span>{req.bloodGroup}</span>
                          <span className="text-[10px] font-normal leading-none">{req.units} ব্যাগ</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-neutral-900 line-clamp-1">
                            {req.patientName}
                          </h3>
                          <span className="text-xs text-neutral-500 block">
                            প্রয়োজন: {req.requiredDate}
                          </span>
                        </div>
                      </div>

                      <div>{getUrgencyBadge(req.urgency)}</div>
                    </div>

                    {/* Hospital & Location */}
                    <div className="space-y-1.5 text-xs text-neutral-700 bg-neutral-50/70 p-3 rounded-xl border border-neutral-100">
                      <div className="flex items-start gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                        <span className="font-semibold text-neutral-900">{req.hospitalName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-500">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span>{req.upazila}, {req.district}</span>
                      </div>
                    </div>

                    {/* Notes */}
                    {req.notes && (
                      <p className="text-xs text-neutral-600 italic line-clamp-2">
                        "{req.notes}"
                      </p>
                    )}

                    {/* Status & Timestamp */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-neutral-500">স্ট্যাটাস:</span>
                      {getStatusBadge(req.status)}
                    </div>

                  </div>

                  {/* Actions Area */}
                  <div className="pt-4 mt-3 border-t border-neutral-100 space-y-2">
                    
                    {/* Primary Contact Button */}
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${req.contactPhone}`}
                        className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>কল দিন ({req.contactPhone})</span>
                      </a>
                      
                      <button
                        onClick={() => onOpenReportRequest(req)}
                        title="সন্দেহজনক অনুরোধ রিপোর্ট করুন"
                        className="p-2 text-neutral-500 hover:text-red-600 hover:bg-neutral-100 rounded-lg transition-colors text-xs"
                      >
                        <Flag className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Owner / Admin Management controls */}
                    {canManage && (
                      <div className="bg-neutral-50 p-2 rounded-lg border border-neutral-200 flex items-center justify-between text-xs">
                        <span className="text-[11px] font-medium text-neutral-500">স্ট্যাটাস পরিবর্তন:</span>
                        <div className="flex items-center gap-1">
                          {req.status !== 'fulfilled' && (
                            <button
                              onClick={() => updateEmergencyStatus(req.requestId, 'fulfilled')}
                              className="px-2 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded"
                            >
                              রক্ত পেয়েছি
                            </button>
                          )}
                          {req.status !== 'closed' && (
                            <button
                              onClick={() => updateEmergencyStatus(req.requestId, 'closed')}
                              className="px-2 py-1 text-[11px] font-medium text-neutral-600 bg-neutral-200 hover:bg-neutral-300 rounded"
                            >
                              বন্ধ করুন
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-8 text-center max-w-md mx-auto">
            <AlertCircle className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-800">
              এই ফিল্টারে কোনো রক্তের অনুরোধ নেই।
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              রক্ত প্রয়োজন হলে নতুন অনুরোধ পোস্ট করতে পারেন।
            </p>
          </div>
        )}

      </div>
    </section>
  );
};

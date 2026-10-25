import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DonorProfile, EmergencyRequest, Hospital, ReportReason, RequestStatus } from '../types';
import {
  Shield,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Building2,
  Settings,
  FileText,
  Trash2,
  Edit,
  Plus,
  RefreshCw,
  Search,
  ExternalLink,
  Lock,
  Database
} from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
}

type AdminTab = 'dashboard' | 'donors' | 'requests' | 'reports' | 'hospitals' | 'developer' | 'firebase';

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const {
    currentUser,
    donors,
    emergencyRequests,
    reports,
    ratings,
    hospitals,
    auditLogs,
    developerSettings,
    verifyDonor,
    updateDonorProfile,
    updateEmergencyStatus,
    deleteEmergencyRequest,
    resolveReport,
    addHospital,
    updateHospital,
    deleteHospital,
    updateDeveloperSettings,
    resetAllData
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [donorSearch, setDonorSearch] = useState('');
  const [reportFilter, setReportFilter] = useState<'ALL' | 'pending' | 'resolved' | 'dismissed'>('pending');

  // New hospital form state
  const [showAddHospital, setShowAddHospital] = useState(false);
  const [hospName, setHospName] = useState('');
  const [hospType, setHospType] = useState<Hospital['type']>('hospital');
  const [hospAddress, setHospAddress] = useState('');
  const [hospUpazila, setHospUpazila] = useState('তারাইল');
  const [hospDistrict, setHospDistrict] = useState('কিশোরগঞ্জ');
  const [hospPhone, setHospPhone] = useState('');
  const [hospHours, setHospHours] = useState('২৪ ঘণ্টা জরুরি সেবা');
  const [hospMapUrl, setHospMapUrl] = useState('');

  // Developer settings form state
  const [devName, setDevName] = useState(developerSettings.developerName || '');
  const [devPhoto, setDevPhoto] = useState(developerSettings.developerPhoto || '');
  const [devBio, setDevBio] = useState(developerSettings.developerBio || '');
  const [devPortfolio, setDevPortfolio] = useState(developerSettings.portfolioUrl || '');
  const [devGithub, setDevGithub] = useState(developerSettings.githubUrl || '');
  const [devFacebook, setDevFacebook] = useState(developerSettings.facebookUrl || '');
  const [devLinkedin, setDevLinkedin] = useState(developerSettings.linkedinUrl || '');
  const [devSavedMessage, setDevSavedMessage] = useState(false);

  // Security gate: strictly check role
  const isAdmin = currentUser && currentUser.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-xl border border-neutral-200">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900">অ্যাক্সেস সংরক্ষিত (Admin Only)</h3>
          <p className="text-xs text-neutral-600">
            অ্যাডমিন প্যানেল শুধুমাত্র অনুমোদিত প্রশাসকের জন্য সংরক্ষিত। অনুগ্রহ করে নিবন্ধিত অ্যাডমিন ইমেইল <strong>asifjony2022@gmail.com</strong> দিয়ে সাইন ইন করুন।
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl"
          >
            ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  // Real statistics derived directly from live database
  const totalUsers = 1 + donors.length;
  const totalDonors = donors.length;
  const availableDonors = donors.filter(d => d.isAvailable && d.availabilityStatus === 'available').length;
  const needsUpdateDonors = donors.filter(d => d.availabilityStatus === 'needs_update').length;
  const verifiedDonors = donors.filter(d => d.isVerified).length;
  const openRequests = emergencyRequests.filter(r => r.status === 'open').length;
  const fulfilledRequests = emergencyRequests.filter(r => r.status === 'fulfilled').length;
  const pendingReports = reports.filter(r => r.status === 'pending').length;
  const totalRatings = ratings.length;

  const handleSaveDevSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateDeveloperSettings({
      developerName: devName.trim(),
      developerPhoto: devPhoto.trim() || undefined,
      developerBio: devBio.trim() || undefined,
      portfolioUrl: devPortfolio.trim() || undefined,
      githubUrl: devGithub.trim() || undefined,
      facebookUrl: devFacebook.trim() || undefined,
      linkedinUrl: devLinkedin.trim() || undefined
    });
    setDevSavedMessage(true);
    setTimeout(() => setDevSavedMessage(false), 2500);
  };

  const handleCreateHospital = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospName.trim() || !hospPhone.trim()) return;

    await addHospital({
      name: hospName.trim(),
      type: hospType,
      address: hospAddress.trim(),
      upazila: hospUpazila.trim(),
      district: hospDistrict.trim(),
      phone: hospPhone.trim(),
      openingHours: hospHours.trim() || undefined,
      mapUrl: hospMapUrl.trim() || undefined
    });

    setHospName('');
    setHospPhone('');
    setHospAddress('');
    setShowAddHospital(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-white rounded-2xl max-w-6xl w-full h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-neutral-200">
        
        {/* Top Navbar */}
        <div className="bg-neutral-950 text-white px-6 py-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-bold">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                তারাইল ব্লাড ব্যাংক অ্যাডমিন কনসোল
                <span className="text-[11px] font-semibold bg-red-950 border border-red-800 text-red-300 px-2 py-0.5 rounded">
                  Admin Active
                </span>
              </h2>
              <p className="text-[11px] text-neutral-400">
                লগইন ইউজার: {currentUser.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetAllData}
              title="রিসেট ডেমো ডেটা"
              className="px-2.5 py-1.5 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">রিসেট ডেটা</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              বন্ধ করুন (Close)
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-neutral-900 text-neutral-300 px-6 flex items-center gap-2 overflow-x-auto text-xs font-medium border-b border-neutral-800 shrink-0">
          {[
            { id: 'dashboard', label: 'ড্যাশবোর্ড ও পরিসংখ্যান' },
            { id: 'donors', label: `রক্তদাতা ব্যবস্থাপনা (${totalDonors})` },
            { id: 'requests', label: `জরুরি অনুরোধ (${emergencyRequests.length})` },
            { id: 'reports', label: `নিরাপত্তা রিপোর্ট (${pendingReports} বিচারাধীন)` },
            { id: 'hospitals', label: `হাসপাতাল ডিরেক্টরি (${hospitals.length})` },
            { id: 'developer', label: 'ডেভেলপার সেটিংস' },
            { id: 'firebase', label: 'ফায়ারবেস ও অডিট লগ' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`py-3 px-3 border-b-2 font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-red-500 text-white'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-neutral-50/50">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
                  <span className="text-xs text-neutral-500 block">মোট রক্তদাতা প্রোফাইল</span>
                  <div className="text-2xl font-extrabold text-neutral-900 mt-1 tabular-nums">{totalDonors}</div>
                  <span className="text-[11px] text-neutral-400">নিবন্ধিত ও সক্রিয়</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
                  <span className="text-xs text-neutral-500 block">বর্তমানে প্রস্তুত রক্তদাতা</span>
                  <div className="text-2xl font-extrabold text-emerald-600 mt-1 tabular-nums">{availableDonors}</div>
                  <span className="text-[11px] text-emerald-700/80">সরাসরি যোগাযোগযোগ্য</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
                  <span className="text-xs text-neutral-500 block">যাচাইকৃত রক্তদাতা (Verified)</span>
                  <div className="text-2xl font-extrabold text-blue-600 mt-1 tabular-nums">{verifiedDonors}</div>
                  <span className="text-[11px] text-blue-700/80">অ্যাডমিন কর্তৃক সত্যতা পরীক্ষিত</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
                  <span className="text-xs text-neutral-500 block">আপডেট প্রয়োজন (Needs Update)</span>
                  <div className="text-2xl font-extrabold text-amber-600 mt-1 tabular-nums">{needsUpdateDonors}</div>
                  <span className="text-[11px] text-amber-700/80">৯০ দিনের বেশি সময় তথ্য আপডেট নেই</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
                  <span className="text-xs text-neutral-500 block">সক্রিয় জরুরি অনুরোধ</span>
                  <div className="text-2xl font-extrabold text-red-600 mt-1 tabular-nums">{openRequests}</div>
                  <span className="text-[11px] text-red-700/80">রক্ত সংগ্রহ চলছে</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
                  <span className="text-xs text-neutral-500 block">রক্তদান সম্পন্ন অনুরোধ</span>
                  <div className="text-2xl font-extrabold text-neutral-800 mt-1 tabular-nums">{fulfilledRequests}</div>
                  <span className="text-[11px] text-neutral-500">রোগী রক্ত পেয়েছে</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
                  <span className="text-xs text-neutral-500 block">বিচারাধীন অভিযোগ (Reports)</span>
                  <div className="text-2xl font-extrabold text-purple-600 mt-1 tabular-nums">{pendingReports}</div>
                  <span className="text-[11px] text-purple-700/80">প্রশাসকের পর্যালোচনা দরকার</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
                  <span className="text-xs text-neutral-500 block">মোট রেটিং ও মতামত</span>
                  <div className="text-2xl font-extrabold text-amber-600 mt-1 tabular-nums">{totalRatings}</div>
                  <span className="text-[11px] text-neutral-500">স্বেচ্ছাসেবক মূল্যায়ন</span>
                </div>
              </div>

              {/* Quick Actions and Integrity Notice */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 space-y-3">
                  <h3 className="text-sm font-bold text-neutral-900">নিরাপত্তা ও নীতি নির্দেশিকা</h3>
                  <ul className="text-xs text-neutral-600 space-y-2 list-disc list-inside">
                    <li>কোনো রক্তদাতা নিবন্ধন করার সাথে সাথে স্বয়ংক্রিয়ভাবে 'যাচাইকৃত' ব্যাজ পাবে না।</li>
                    <li>শুধুমাত্র ফোন কল বা এনআইডি বা স্থানীয় পরিচিতির সত্যতা যাচাইয়ের পর অ্যাডমিন ব্যাজ প্রদান করবেন।</li>
                    <li>রক্তের জন্য কোনো ধরনের অর্থ দাবির অভিযোগ পেলে দ্রুত প্রোফাইল সাময়িক স্থগিত করুন।</li>
                    <li>কোনো পয়েন্ট বা লিডারবোর্ড সিস্টেম নেই, যাতে রক্তদানকে প্রতিযোগিতায় পরিণত না করা হয়।</li>
                  </ul>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-neutral-200 space-y-3">
                  <h3 className="text-sm font-bold text-neutral-900">সাম্প্রতিক অডিট লগ ট্রেইল</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
                    {auditLogs.slice(0, 5).map(log => (
                      <div key={log.logId} className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200/70">
                        <div className="flex items-center justify-between font-semibold text-neutral-800">
                          <span>{log.actionType}</span>
                          <span className="text-[10px] text-neutral-400">{log.timestamp.split('T')[0]}</span>
                        </div>
                        <p className="text-[11px] text-neutral-600 mt-0.5">{log.details}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: DONOR MANAGEMENT */}
          {activeTab === 'donors' && (
            <div className="space-y-4">
              
              <div className="flex items-center justify-between gap-4">
                <input
                  type="text"
                  placeholder="রক্তদাতার নাম, এলাকা বা গ্রুপ লিখে ফিল্টার করুন..."
                  value={donorSearch}
                  onChange={e => setDonorSearch(e.target.value)}
                  className="py-2 px-3 text-xs bg-white border border-neutral-300 rounded-xl max-w-sm w-full"
                />
                <span className="text-xs text-neutral-500">মোট: {donors.length} জন রক্তদাতা</span>
              </div>

              <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-100/70 text-neutral-600 font-semibold border-b border-neutral-200">
                      <tr>
                        <th className="py-3 px-4">রক্তদাতার নাম ও এলাকা</th>
                        <th className="py-3 px-4">রক্তের গ্রুপ</th>
                        <th className="py-3 px-4">যোগাযোগ নম্বর</th>
                        <th className="py-3 px-4">রক্তদান সংখ্যা</th>
                        <th className="py-3 px-4">অবস্থা</th>
                        <th className="py-3 px-4">যাচাই স্ট্যাটাস</th>
                        <th className="py-3 px-4 text-right">অ্যাডমিন অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {donors
                        .filter(d =>
                          d.name.toLowerCase().includes(donorSearch.toLowerCase()) ||
                          d.area.toLowerCase().includes(donorSearch.toLowerCase()) ||
                          d.bloodGroup.toLowerCase().includes(donorSearch.toLowerCase())
                        )
                        .map(donor => (
                          <tr key={donor.donorId} className="hover:bg-neutral-50/80 transition-colors">
                            <td className="py-3 px-4">
                              <div className="font-bold text-neutral-900">{donor.name}</div>
                              <span className="text-[11px] text-neutral-500">{donor.area}, {donor.upazila}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded font-extrabold text-red-700 bg-red-50 border border-red-200">
                                {donor.bloodGroup}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-neutral-800">
                              {donor.phone}
                              {!donor.isPhonePublic && (
                                <span className="block text-[10px] text-neutral-400">কার্ডে গোপন</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-semibold text-neutral-800">{donor.totalDonations} বার</span>
                              <span className="block text-[10px] text-neutral-500">
                                {donor.isDonationCountVerified ? 'যাচাইকৃত' : 'স্বঘোষিত'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {donor.availabilityStatus === 'available' ? (
                                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">প্রস্তুত</span>
                              ) : donor.availabilityStatus === 'temporarily_unavailable' ? (
                                <span className="text-[11px] text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">বিরতিতে</span>
                              ) : (
                                <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded">যাচাই প্রয়োজন</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {donor.isVerified ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                                  <CheckCircle className="w-3 h-3 fill-blue-600 text-white" />
                                  <span>যাচাইকৃত</span>
                                </span>
                              ) : (
                                <span className="text-[11px] text-neutral-400">সাধারণ</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right space-x-1">
                              {donor.isVerified ? (
                                <button
                                  onClick={() => verifyDonor(donor.donorId, false, 'Admin revoked')}
                                  className="px-2.5 py-1 text-[11px] font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded"
                                >
                                  ব্যাজ বাতিল
                                </button>
                              ) : (
                                <button
                                  onClick={() => verifyDonor(donor.donorId, true, 'Admin verified identity')}
                                  className="px-2.5 py-1 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-2xs"
                                >
                                  যাচাই করুন
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: EMERGENCY REQUESTS */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-900">জরুরি রক্তের অনুরোধ ব্যবস্থাপনা</h3>
              
              <div className="space-y-3">
                {emergencyRequests.map(req => (
                  <div key={req.requestId} className="bg-white p-4 rounded-xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded font-extrabold text-white bg-red-600">
                          {req.bloodGroup}
                        </span>
                        <h4 className="font-bold text-neutral-900 text-sm">{req.patientName}</h4>
                        <span className="text-neutral-500 font-medium">({req.units} ব্যাগ)</span>
                        <span className="text-neutral-400">·</span>
                        <span className="font-semibold text-neutral-700">{req.status.toUpperCase()}</span>
                      </div>
                      <p className="text-neutral-600 mt-1">
                        হাসপাতাল: <strong>{req.hospitalName}</strong> | ফোন: {req.contactPhone} | সময়: {req.requiredDate}
                      </p>
                      {req.notes && (
                        <p className="text-neutral-500 italic mt-0.5">"{req.notes}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={req.status}
                        onChange={e => updateEmergencyStatus(req.requestId, e.target.value as RequestStatus)}
                        className="py-1.5 px-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs"
                      >
                        <option value="open">Open (চলমান)</option>
                        <option value="in_progress">In Progress (প্রক্রিয়াধীন)</option>
                        <option value="fulfilled">Fulfilled (রক্ত সংগ্রহ সম্পন্ন)</option>
                        <option value="closed">Closed (বন্ধ)</option>
                      </select>

                      <button
                        onClick={() => deleteEmergencyRequest(req.requestId)}
                        title="অনুরোধটি মুছে ফেলুন"
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SAFETY REPORTS & FRAUD MODERATION */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900">
                  ব্যবহারকারীদের অভিযোগ ও রিপোর্ট ({reports.length})
                </h3>
                <div className="flex items-center gap-1 text-xs">
                  {(['ALL', 'pending', 'resolved', 'dismissed'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setReportFilter(f)}
                      className={`px-3 py-1 rounded-lg font-medium ${
                        reportFilter === f
                          ? 'bg-neutral-900 text-white'
                          : 'bg-white text-neutral-600 border border-neutral-200'
                      }`}
                    >
                      {f === 'ALL' ? 'সব' : f === 'pending' ? 'বিচারাধীন' : f === 'resolved' ? 'সমাধানকৃত' : 'বাতিল'}
                    </button>
                  ))}
                </div>
              </div>

              {reports.filter(r => reportFilter === 'ALL' || r.status === reportFilter).length > 0 ? (
                <div className="space-y-3">
                  {reports
                    .filter(r => reportFilter === 'ALL' || r.status === reportFilter)
                    .map(report => (
                      <div key={report.reportId} className="bg-white p-4 rounded-xl border border-neutral-200 text-xs space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-bold text-red-600 text-sm">{report.reason}</span>
                            <div className="text-neutral-500 mt-0.5">
                              রিপোর্টকারী: {report.reporterEmail || report.reporterUserId} · লক্ষ্য: {report.targetType} ({report.targetName || report.targetId})
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            report.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-neutral-100 text-neutral-700'
                          }`}>
                            {report.status.toUpperCase()}
                          </span>
                        </div>

                        {report.description && (
                          <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-100 text-neutral-700">
                            <strong>বর্ণনা:</strong> {report.description}
                          </div>
                        )}

                        {report.status === 'pending' ? (
                          <div className="pt-2 border-t border-neutral-100 flex items-center justify-end gap-2">
                            <button
                              onClick={() => resolveReport(report.reportId, 'Dismissed by admin: Insufficient evidence', 'dismissed')}
                              className="px-3 py-1 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg"
                            >
                              খারিজ করুন (Dismiss)
                            </button>
                            <button
                              onClick={() => resolveReport(report.reportId, 'Reviewed and appropriate action taken', 'resolved')}
                              className="px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                            >
                              সমাধান সম্পন্ন (Resolve)
                            </button>
                          </div>
                        ) : (
                          <div className="text-[11px] text-neutral-400">
                            পদক্ষেপ: {report.actionTaken} (বাই {report.resolvedBy})
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-xl border border-neutral-200 text-center text-xs text-neutral-500">
                  কোনো বিচারাধীন অভিযোগ বা রিপোর্ট নেই।
                </div>
              )}
            </div>
          )}

          {/* TAB 5: HOSPITALS MANAGEMENT */}
          {activeTab === 'hospitals' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900">হাসপাতাল তালিকা পরিচালনা</h3>
                <button
                  onClick={() => setShowAddHospital(!showAddHospital)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন হাসপাতাল যোগ করুন</span>
                </button>
              </div>

              {showAddHospital && (
                <form onSubmit={handleCreateHospital} className="bg-white p-5 rounded-2xl border border-neutral-200 space-y-3 text-xs">
                  <h4 className="font-bold text-neutral-900">নতুন হাসপাতাল বা সেন্টারের তথ্য</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-neutral-700 mb-1">হাসপাতালের নাম *</label>
                      <input
                        type="text"
                        required
                        value={hospName}
                        onChange={e => setHospName(e.target.value)}
                        className="w-full py-2 px-3 border border-neutral-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-neutral-700 mb-1">ধরণ</label>
                      <select
                        value={hospType}
                        onChange={e => setHospType(e.target.value as Hospital['type'])}
                        className="w-full py-2 px-3 border border-neutral-300 rounded-lg"
                      >
                        <option value="hospital">সাধারণ হাসপাতাল</option>
                        <option value="blood_bank">ব্লাড ব্যাংক</option>
                        <option value="red_crescent">রেড ক্রিসেন্ট রক্ত কেন্দ্র</option>
                        <option value="clinic">ক্লিনিক</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-medium text-neutral-700 mb-1">ফোন নম্বর *</label>
                      <input
                        type="text"
                        required
                        value={hospPhone}
                        onChange={e => setHospPhone(e.target.value)}
                        className="w-full py-2 px-3 border border-neutral-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-neutral-700 mb-1">উপজেলা</label>
                      <input
                        type="text"
                        value={hospUpazila}
                        onChange={e => setHospUpazila(e.target.value)}
                        className="w-full py-2 px-3 border border-neutral-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-neutral-700 mb-1">জেলা</label>
                      <input
                        type="text"
                        value={hospDistrict}
                        onChange={e => setHospDistrict(e.target.value)}
                        className="w-full py-2 px-3 border border-neutral-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-700 mb-1">ঠিকানা</label>
                    <input
                      type="text"
                      value={hospAddress}
                      onChange={e => setHospAddress(e.target.value)}
                      className="w-full py-2 px-3 border border-neutral-300 rounded-lg"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddHospital(false)}
                      className="px-3 py-1.5 text-xs text-neutral-600 bg-neutral-100 rounded-lg"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg"
                    >
                      সংরক্ষণ করুন
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {hospitals.map(h => (
                  <div key={h.hospitalId} className="bg-white p-4 rounded-xl border border-neutral-200 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-neutral-900 text-sm">{h.name}</h4>
                      <p className="text-neutral-500 mt-0.5">{h.address}, {h.upazila}, {h.district} | ফোন: {h.phone}</p>
                    </div>
                    <button
                      onClick={() => deleteHospital(h.hospitalId)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: DEVELOPER SETTINGS */}
          {activeTab === 'developer' && (
            <div className="max-w-2xl bg-white p-6 rounded-2xl border border-neutral-200 space-y-4 text-xs">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">ডেভেলপার পোর্টফোলিও কনফিগারেশন</h3>
                <p className="text-neutral-500 mt-1">
                  এখানে তথ্য পূরণ করলে ওয়েবসাইটের "Developer" সেকশনে আপনার নাম, বায়ো এবং সামাজিক যোগাযোগ ও পোর্টফোলিও লিঙ্ক প্রদর্শিত হবে।
                </p>
              </div>

              {devSavedMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-medium">
                  ডেভেলপার তথ্য সফলভাবে হালনাগাদ হয়েছে!
                </div>
              )}

              <form onSubmit={handleSaveDevSettings} className="space-y-3">
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">ডেভেলপারের নাম</label>
                  <input
                    type="text"
                    placeholder="আপনার নাম"
                    value={devName}
                    onChange={e => setDevName(e.target.value)}
                    className="w-full py-2 px-3 border border-neutral-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">প্রোফাইল ছবি URL (ঐচ্ছিক)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={devPhoto}
                    onChange={e => setDevPhoto(e.target.value)}
                    className="w-full py-2 px-3 border border-neutral-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">সংক্ষিপ্ত বায়ো / ভূমিকা</label>
                  <textarea
                    rows={2}
                    placeholder="ফুল-স্ট্যাক সফটওয়্যার ইঞ্জিনিয়ার ও সোশ্যাল গুড ডেভেলপার..."
                    value={devBio}
                    onChange={e => setDevBio(e.target.value)}
                    className="w-full py-2 px-3 border border-neutral-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">পোর্টফোলিও ওয়েবসাইট URL</label>
                    <input
                      type="url"
                      placeholder="https://yourportfolio.com"
                      value={devPortfolio}
                      onChange={e => setDevPortfolio(e.target.value)}
                      className="w-full py-2 px-3 border border-neutral-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">GitHub URL</label>
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={devGithub}
                      onChange={e => setDevGithub(e.target.value)}
                      className="w-full py-2 px-3 border border-neutral-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">Facebook URL</label>
                    <input
                      type="url"
                      placeholder="https://facebook.com/..."
                      value={devFacebook}
                      onChange={e => setDevFacebook(e.target.value)}
                      className="w-full py-2 px-3 border border-neutral-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">LinkedIn URL</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={devLinkedin}
                      onChange={e => setDevLinkedin(e.target.value)}
                      className="w-full py-2 px-3 border border-neutral-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="py-2.5 px-5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl"
                  >
                    সেটিংস সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 7: FIREBASE SPARK & AUDIT TRAIL */}
          {activeTab === 'firebase' && (
            <div className="space-y-6 text-xs">
              
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-4">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-red-600" />
                  <h3 className="text-sm font-bold text-neutral-900">
                    ফায়ারবেস স্পার্ক (Spark Free Tier) ও ক্লাউড কনফিগারেশন নির্দেশিকা
                  </h3>
                </div>

                <div className="space-y-3 text-neutral-700 leading-relaxed">
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                    <strong className="text-neutral-900 block mb-1">ফ্রি টায়ার স্ট্যাটাস:</strong>
                    ওয়েবসাইটটি সম্পূর্ণ ফ্রি-টিয়ার এবং লোকাল প্রিভিউ পরিবেশের জন্য অপটিমাইজ করা। কোনো ডোমেন বা পেইড হোস্টিং কেনার বাধ্যবাধকতা নেই।
                  </div>

                  <div className="space-y-1.5">
                    <p><strong>১. ফায়ারবেস অথেনটিকেশন:</strong> গুগল সাইন ইন এবং ইমেইল সাইন ইন সমর্থিত। কোনো পেইড SMS OTP প্রয়োজন নেই।</p>
                    <p><strong>২. ক্লাউড ফায়ারস্টোর রুলস:</strong> প্রোজেক্টে সম্পূর্ণ সুরক্ষিত `firestore.rules` প্রস্তুত রাখা হয়েছে। সাধারণ ব্যবহারকারীরা অন্য কারো ডেটা পরিবর্তন করতে বা নিজেদের অ্যাডমিন বানাতে পারবে না।</p>
                    <p><strong>৩. লাইভ ডেটাবেজ সংযোগ:</strong> আপনার নিজের গুগল ক্লাউড / ফায়ারবেস প্রজেক্ট কানেক্ট করার পর `firebase-applet-config.json` এর মাধ্যমে সরাসরি স্পার্ক প্ল্যানের সাথে সংযুক্ত হতে পারবে।</p>
                  </div>
                </div>
              </div>

              {/* Audit Logs */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-3">
                <h3 className="text-sm font-bold text-neutral-900">সম্পূর্ণ প্রশাসনিক অডিট লগ ({auditLogs.length})</h3>
                <div className="divide-y divide-neutral-100 max-h-60 overflow-y-auto">
                  {auditLogs.map(log => (
                    <div key={log.logId} className="py-2.5 space-y-1">
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="font-bold text-neutral-900">{log.actionType}</span>
                        <span className="text-neutral-400">{log.timestamp}</span>
                      </div>
                      <p className="text-neutral-600">{log.details}</p>
                      <span className="text-[10px] text-neutral-400">কর্তৃক: {log.adminEmail}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

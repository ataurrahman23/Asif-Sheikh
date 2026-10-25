/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { BloodGroup, DonorProfile, EmergencyRequest } from './types';
import { Header } from './components/Header';
import { WarningModal } from './components/WarningModal';
import { Hero } from './components/Hero';
import { DonorSearch } from './components/DonorSearch';
import { DonorModal } from './components/DonorModal';
import { EmergencyRequests } from './components/EmergencyRequests';
import { EmergencyRequestModal } from './components/EmergencyRequestModal';
import { DonorRegistrationModal } from './components/DonorRegistrationModal';
import { HowItWorks } from './components/HowItWorks';
import { BloodSafetyGuide } from './components/BloodSafetyGuide';
import { HospitalDirectory } from './components/HospitalDirectory';
import { DeveloperPortfolio } from './components/DeveloperPortfolio';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { ReportModal } from './components/ReportModal';
import { Footer } from './components/Footer';

const MainAppContent: React.FC = () => {
  const { currentUser } = useApp();

  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [activeDonorProfile, setActiveDonorProfile] = useState<DonorProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRegisterDonorOpen, setIsRegisterDonorOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Safety report target modal state
  const [reportTarget, setReportTarget] = useState<{
    type: 'donor' | 'request';
    id: string;
    name: string;
  } | null>(null);

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'admin') {
      setIsAdminPanelOpen(true);
      return;
    }

    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenReportDonor = (donor: DonorProfile) => {
    setReportTarget({
      type: 'donor',
      id: donor.donorId,
      name: donor.name
    });
  };

  const handleOpenReportRequest = (req: EmergencyRequest) => {
    setReportTarget({
      type: 'request',
      id: req.requestId,
      name: `${req.bloodGroup} রক্ত - ${req.patientName}`
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Session-scoped first-visit safety warning */}
      <WarningModal />

      {/* Primary Top Bar (Three-zone Top Bar Contract) */}
      <Header
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenRegisterDonor={() => {
          if (!currentUser) {
            setIsAuthModalOpen(true);
          } else {
            setIsRegisterDonorOpen(true);
          }
        }}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* Main Content Flow */}
      <main className="flex-1">
        
        {/* Hero Banner with requested headlines, CTAs, and blood group selector */}
        <Hero
          selectedBloodGroup={selectedBloodGroup}
          onSelectBloodGroup={setSelectedBloodGroup}
          onOpenRegisterDonor={() => {
            if (!currentUser) {
              setIsAuthModalOpen(true);
            } else {
              setIsRegisterDonorOpen(true);
            }
          }}
          onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
          onScrollToSearch={() => handleNavigate('donors')}
        />

        {/* Smart Donor Search backed by database with all 8 blood groups and locations */}
        <DonorSearch
          selectedBloodGroup={selectedBloodGroup}
          onSelectBloodGroup={setSelectedBloodGroup}
          onViewDonorProfile={setActiveDonorProfile}
          onOpenRegisterDonor={() => {
            if (!currentUser) {
              setIsAuthModalOpen(true);
            } else {
              setIsRegisterDonorOpen(true);
            }
          }}
        />

        {/* Emergency Blood Requests Feed & Submission */}
        <EmergencyRequests
          onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
          onOpenReportRequest={handleOpenReportRequest}
        />

        {/* How-it-works section */}
        <HowItWorks />

        {/* Medical Safety & Eligibility Guide */}
        <BloodSafetyGuide />

        {/* Verified Hospital & Blood Donation Center Directory */}
        <HospitalDirectory />

        {/* Developer Portfolio Section (Configurable via Admin Panel) */}
        <DeveloperPortfolio onOpenAdminSettings={() => setIsAdminPanelOpen(true)} />

      </main>

      {/* Footer with policies and contact */}
      <Footer
        onNavigate={handleNavigate}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
      />

      {/* MODALS */}

      {/* Dedicated Donor Profile View & Rating/Report */}
      <DonorModal
        donor={activeDonorProfile}
        onClose={() => setActiveDonorProfile(null)}
        onOpenReport={handleOpenReportDonor}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Emergency Request Form Modal */}
      <EmergencyRequestModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      {/* Donor Registration Form Modal */}
      <DonorRegistrationModal
        isOpen={isRegisterDonorOpen}
        onClose={() => setIsRegisterDonorOpen(false)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Safety Report Modal */}
      {reportTarget && (
        <ReportModal
          isOpen={true}
          onClose={() => setReportTarget(null)}
          targetType={reportTarget.type}
          targetId={reportTarget.id}
          targetName={reportTarget.name}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />
      )}

      {/* Protected Admin Panel Console */}
      {isAdminPanelOpen && (
        <AdminPanel onClose={() => setIsAdminPanelOpen(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

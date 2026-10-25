import React from 'react';
import { useApp } from '../context/AppContext';
import { Code2, Globe, Github, Facebook, Linkedin, User, Sparkles } from 'lucide-react';

interface DeveloperPortfolioProps {
  onOpenAdminSettings?: () => void;
}

export const DeveloperPortfolio: React.FC<DeveloperPortfolioProps> = ({ onOpenAdminSettings }) => {
  const { developerSettings, currentUser } = useApp();

  const isConfigured = Boolean(
    developerSettings.developerName ||
    developerSettings.developerBio ||
    developerSettings.portfolioUrl ||
    developerSettings.githubUrl ||
    developerSettings.facebookUrl ||
    developerSettings.linkedinUrl
  );

  return (
    <section id="developer" className="py-14 bg-neutral-50/50 border-b border-neutral-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
            <Code2 className="w-4 h-4 text-red-600" />
            <span>সফটওয়্যার উন্নয়ন ও কারিগরি দল</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            ডেভেলপার (Developer)
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            তারাইল ব্লাড ব্যাংক ওয়েবসাইট আর্কিটেকচার ও নিরাপদ কোডিং বাস্তবায়ন
          </p>
        </div>

        {isConfigured ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              
              {developerSettings.developerPhoto ? (
                <img
                  src={developerSettings.developerPhoto}
                  alt={developerSettings.developerName || 'Developer'}
                  className="w-24 h-24 rounded-2xl object-cover border border-neutral-200 shadow-2xs shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-bold text-2xl shrink-0">
                  {developerSettings.developerName ? developerSettings.developerName.charAt(0) : <User className="w-10 h-10 text-neutral-400" />}
                </div>
              )}

              <div className="space-y-3 flex-1">
                {developerSettings.developerName && (
                  <h3 className="text-xl font-bold text-neutral-900">
                    {developerSettings.developerName}
                  </h3>
                )}

                {developerSettings.developerBio && (
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                    {developerSettings.developerBio}
                  </p>
                )}

                {/* Social & Portfolio Links */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                  {developerSettings.portfolioUrl && (
                    <a
                      href={developerSettings.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5 text-blue-600" />
                      <span>পোর্টফোলিও ওয়েবসাইট</span>
                    </a>
                  )}

                  {developerSettings.githubUrl && (
                    <a
                      href={developerSettings.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                    >
                      <Github className="w-3.5 h-3.5 text-neutral-900" />
                      <span>GitHub</span>
                    </a>
                  )}

                  {developerSettings.facebookUrl && (
                    <a
                      href={developerSettings.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                    >
                      <Facebook className="w-3.5 h-3.5 text-blue-600" />
                      <span>Facebook</span>
                    </a>
                  )}

                  {developerSettings.linkedinUrl && (
                    <a
                      href={developerSettings.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                    >
                      <Linkedin className="w-3.5 h-3.5 text-blue-700" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Unconfigured state (Honoring prompt: "Do not invent my name, biography, or portfolio URLs. Use empty optional settings until I provide real details.") */
          <div className="bg-white rounded-2xl border border-dashed border-neutral-300 p-8 text-center max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-500 flex items-center justify-center mx-auto">
              <Code2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-neutral-900">
              ডেভেলপার তথ্য এখনো কনফিগার করা হয়নি
            </h4>
            <p className="text-xs text-neutral-500">
              অ্যাডমিন প্যানেলে লগইন করে আপনার নিজের নাম, ছবি, বায়ো এবং সামাজিক যোগাযোগ ও পোর্টফোলিও লিঙ্ক যোগ করুন।
            </p>
            {currentUser?.role === 'admin' && onOpenAdminSettings && (
              <button
                onClick={onOpenAdminSettings}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg"
              >
                <span>অ্যাডমিন সেটিংসে যান</span>
              </button>
            )}
          </div>
        )}

      </div>
    </section>
  );
};

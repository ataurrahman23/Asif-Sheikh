import React from 'react';
import { Search, PhoneCall, Stethoscope, HeartHandshake } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '০১',
      title: 'রক্তদাতা বা অনুরোধ খুঁজুন',
      desc: 'আপনার কাঙ্ক্ষিত রক্তের গ্রুপ এবং এলাকা অনুযায়ী তাৎক্ষণিক ফিল্টার করে রক্তদাতা বা জরুরি অনুরোধ খুঁজুন।',
      icon: Search,
    },
    {
      number: '০২',
      title: 'সরাসরি যোগাযোগ করুন',
      desc: 'কোনো মাধ্যম বা দালাল ছাড়া সরাসরি রক্তদাতার সাথে ফোনে যোগাযোগ করে বর্তমান অবস্থা ও সময় আলোচনা করুন।',
      icon: PhoneCall,
    },
    {
      number: '০৩',
      title: 'হাসপাতালে স্বাস্থ্য পরীক্ষা',
      desc: 'হাসপাতাল বা ক্লিনিকে রক্তদানের পূর্বে চিকিৎসকের তত্ত্বাবধানে হিমোগ্লোবিন, রক্তচাপ ও স্ক্রিনিং টেস্ট সম্পন্ন করুন।',
      icon: Stethoscope,
    },
    {
      number: '০৪',
      title: 'নিরাপদ রক্তদান ও জীবন রক্ষা',
      desc: 'সম্পূর্ণ বিনামূল্যে রক্তদান করে মুমূর্ষু রোগীর প্রাণ বাঁচান এবং মানবতার দৃষ্টান্ত স্থাপন করুন।',
      icon: HeartHandshake,
    },
  ];

  return (
    <section className="py-14 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-red-600 mb-1">
            <span>সহজ ৪ ধাপ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            কীভাবে রক্তদান বা গ্রহণ করবেন?
          </h2>
          <p className="text-sm text-neutral-600 mt-2">
            তারাইল ব্লাড ব্যাংক কোনো রক্ত মজুত করে না; এটি সরাসরি রক্তদাতা ও গ্রহীতার মধ্যে দ্রুত যোগাযোগের একটি বিশ্বস্ত মাধ্যম।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div
                key={idx}
                className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200/80 relative hover:border-red-200 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-red-100/80 text-red-700 flex items-center justify-center">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold text-neutral-300 font-mono">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-200/60 text-[11px] font-semibold text-neutral-400">
                  তারাইল ব্লাড ব্যাংক গাইডলাইন
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

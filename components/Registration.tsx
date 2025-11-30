
import React, { useState } from 'react';
import { UserProfile, Language } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface RegistrationProps {
  onRegister: (profile: UserProfile) => void;
}

const Registration: React.FC<RegistrationProps> = ({ onRegister }) => {
  const { t, setLanguage, language } = useLanguage();
  const { theme } = useTheme();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    wardNumber: '',
    panchayatName: '',
    mobile: ''
  });

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'mr', label: 'मराठी' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
    { code: 'ml', label: 'മലയാളം' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.name && profile.wardNumber && profile.panchayatName) {
      onRegister(profile);
    }
  };

  return (
    <div className={`theme-${theme} min-h-screen bg-[var(--bg-main)] flex flex-col items-center justify-center p-6 font-sans transition-colors duration-300`}>
      <div className="w-full max-w-md bg-[var(--bg-card)] rounded-2xl shadow-2xl overflow-hidden animate-fade-in border border-[var(--border-color)]">
        <div className="bg-orange-600 p-6 text-center relative overflow-hidden">
           {/* Decorative sheen */}
           <div className="absolute top-0 left-0 w-full h-full bg-white/5 pointer-events-none"></div>

           <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 text-3xl shadow-inner text-white">
             🏛️
           </div>
           <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">{t('app_name')}</h1>
           <p className="text-orange-100 text-sm font-medium">{t('setup_profile')}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="flex justify-end mb-2">
             <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="text-xs bg-[var(--bg-input)] border border-[var(--border-color)] rounded px-2 py-1 text-[var(--text-main)] outline-none focus:ring-1 focus:ring-orange-500"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <p className="text-sm text-[var(--text-sub)] mb-4 text-center">
            {t('enter_details')}
          </p>

          <div>
            <label className="block text-xs font-bold text-[var(--text-sub)] uppercase mb-1">{t('full_name')}</label>
            <input
              type="text"
              required
              className="w-full p-3 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-[var(--bg-input)] text-[var(--text-main)] placeholder-gray-400"
              placeholder="e.g. Rajesh Kumar"
              value={profile.name}
              onChange={e => setProfile({...profile, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-sub)] uppercase mb-1">{t('ward_no')}</label>
            <input
              type="text"
              required
              className="w-full p-3 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-[var(--bg-input)] text-[var(--text-main)] placeholder-gray-400"
              placeholder="e.g. 4"
              value={profile.wardNumber}
              onChange={e => setProfile({...profile, wardNumber: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-sub)] uppercase mb-1">{t('panchayat_name')}</label>
            <input
              type="text"
              required
              className="w-full p-3 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-[var(--bg-input)] text-[var(--text-main)] placeholder-gray-400"
              placeholder="e.g. Rampur Gram Panchayat"
              value={profile.panchayatName}
              onChange={e => setProfile({...profile, panchayatName: e.target.value})}
            />
          </div>
          
           <div>
            <label className="block text-xs font-bold text-[var(--text-sub)] uppercase mb-1">{t('mobile')}</label>
            <input
              type="tel"
              className="w-full p-3 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-[var(--bg-input)] text-[var(--text-main)] placeholder-gray-400"
              placeholder="9876543210"
              value={profile.mobile}
              onChange={e => setProfile({...profile, mobile: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-orange-700 transform transition-transform active:scale-95 mt-4"
          >
            {t('register_btn')}
          </button>
        </form>
      </div>
      <p className="text-[var(--text-sub)] text-xs mt-6 opacity-60">
         Secure • Private • Local Storage
      </p>
    </div>
  );
};

export default Registration;

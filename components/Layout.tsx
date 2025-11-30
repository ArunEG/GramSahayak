

import React from 'react';
import { TabView, Language, UserProfile } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: TabView;
  setActiveTab: (tab: TabView) => void;
  userProfile?: UserProfile | null;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, userProfile }) => {
  const { language, setLanguage, t } = useLanguage();

  const navItems: { id: TabView; label: string; icon: string }[] = [
    { id: 'DASHBOARD', label: t('nav_home'), icon: '🏠' },
    { id: 'GRIEVANCES', label: t('nav_issues'), icon: '📋' },
    { id: 'SCHEDULE', label: t('nav_schedule'), icon: '📅' },
    { id: 'DRAFTER', label: t('nav_drafter'), icon: '✍️' },
    { id: 'SCHEMES', label: t('nav_schemes'), icon: '💡' },
    { id: 'CONNECT', label: t('nav_connect'), icon: '📢' },
  ];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden border-x border-gray-200 font-sans">
      {/* Header */}
      <header className="bg-orange-600 text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold leading-tight">{t('app_name')}</h1>
            <p className="text-xs text-orange-100 opacity-90 font-medium">
               {userProfile ? userProfile.panchayatName : t('subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-3">
             <select 
              value={language}
              onChange={handleLanguageChange}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/40 pl-2 pr-1 py-1 rounded text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code} className="text-gray-800">
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full max-w-md z-40 overflow-x-auto no-scrollbar">
        <div className="flex justify-between items-center h-16 min-w-full px-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center min-w-[60px] h-full transition-colors ${
                activeTab === item.id
                  ? 'text-orange-600 border-t-2 border-orange-600 bg-orange-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-[9px] uppercase font-medium tracking-wide">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
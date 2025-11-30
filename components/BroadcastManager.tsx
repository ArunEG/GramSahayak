

import React, { useState } from 'react';
import { generateBroadcastMessage } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { UserProfile } from '../types';

interface BroadcastManagerProps {
  userProfile?: UserProfile | null;
}

const BroadcastManager: React.FC<BroadcastManagerProps> = ({ userProfile }) => {
  const { t, language: appLanguage } = useLanguage();
  const { theme } = useTheme();
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Hinglish' | 'Local'>('Local');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isDark = theme !== 'light';

  const handleDraft = async () => {
    if (!topic) {
      alert("Please enter a topic for the update.");
      return;
    }
    if (!userProfile) {
       alert("User profile missing. Please re-login.");
       return;
    }
    setIsLoading(true);
    // Pass the app's current language to the service
    const result = await generateBroadcastMessage(topic, userProfile, language, appLanguage);
    setMessage(result);
    setIsLoading(false);
  };

  const handleShare = () => {
    if (!message) return;
    // Create WhatsApp URL
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Theme-aware Header Card */}
      <div className={`p-6 rounded-xl shadow-md border ${
        isDark 
          ? 'bg-green-900/30 border-green-800 text-green-100' 
          : 'bg-green-600 border-green-600 text-white'
      }`}>
        <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
          <span>📢</span> {t('connect_title')}
        </h2>
        <p className={`text-xs ${isDark ? 'text-green-300' : 'text-green-100'}`}>
          {t('connect_desc')}
        </p>
      </div>

      <div className="bg-[var(--bg-card)] p-4 rounded-xl shadow-sm border border-[var(--border-color)] space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--text-sub)] mb-1">{t('update_topic')}</label>
          <textarea
            rows={3}
            className="w-full p-3 border border-[var(--border-color)] rounded-lg text-sm bg-[var(--bg-input)] text-[var(--text-main)] focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-400"
            placeholder="e.g. Vaccination camp at School tomorrow 10 AM. Everyone please come."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-sub)] mb-1">{t('lang_style')}</label>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {(['Local', 'Hinglish', 'Hindi', 'English'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`flex-1 py-2 px-3 text-xs rounded-md border font-medium transition-colors whitespace-nowrap ${
                  language === lang 
                    ? 'bg-green-600 text-white border-green-600' 
                    : 'bg-[var(--bg-main)] text-[var(--text-sub)] border-[var(--border-color)] hover:bg-[var(--bg-input)]'
                }`}
              >
                {lang === 'Local' ? t('app_name') === 'GramSahayak' ? 'Local' : 'Local Language' : lang}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleDraft}
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-bold text-white shadow-md transition-all ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isLoading ? t('drafting') : t('create_msg_btn')}
        </button>
      </div>

      {message && (
        <div className="bg-[var(--bg-card)] p-4 rounded-xl shadow-md border border-[var(--border-color)] animate-slide-in">
          <label className="block text-xs font-bold text-[var(--text-sub)] uppercase tracking-wide mb-2">
            {t('preview_msg')}
          </label>
          <textarea
            rows={8}
            className={`w-full p-3 rounded-lg text-sm font-sans mb-3 focus:outline-none border ${
              isDark 
                ? 'bg-green-900/20 text-green-100 border-green-800' 
                : 'bg-green-50 text-gray-800 border-green-100'
            }`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          
          <button
            onClick={handleShare}
            className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            {t('send_wa_btn')}
          </button>
        </div>
      )}
    </div>
  );
};

export default BroadcastManager;


import React, { useState } from 'react';
import { generateOfficialLetter } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { UserProfile } from '../types';

interface LetterDrafterProps {
  userProfile?: UserProfile | null;
}

const LetterDrafter: React.FC<LetterDrafterProps> = ({ userProfile }) => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [tone, setTone] = useState<'Formal' | 'Urgent' | 'Request'>('Formal');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isDark = theme !== 'light';

  const handleGenerate = async () => {
    if (!recipient || !subject || !details) {
      alert("Please fill in all fields");
      return;
    }
    if (!userProfile) {
       alert("User profile missing. Please re-login.");
       return;
    }

    setIsLoading(true);
    // Pass the current language and user profile to the AI service
    const result = await generateOfficialLetter(recipient, subject, details, userProfile, tone, language);
    setGeneratedLetter(result);
    setIsLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    alert("Copied to clipboard!");
  };

  return (
    <div className="space-y-4">
      {/* Theme-aware Info Card */}
      <div className={`p-4 rounded-xl border mb-4 ${
        isDark 
          ? 'bg-indigo-900/30 border-indigo-700 text-indigo-100' 
          : 'bg-indigo-50 border-indigo-100 text-indigo-900'
      }`}>
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span>🤖</span> {t('drafter_title')}
        </h2>
        <p className={`text-xs mt-1 ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
          {t('drafter_desc')}
        </p>
      </div>

      <div className="bg-[var(--bg-card)] p-4 rounded-xl shadow-sm border border-[var(--border-color)] space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--text-sub)] mb-1">{t('recipient')}</label>
          <input
            type="text"
            className="w-full p-2 border border-[var(--border-color)] rounded-md text-sm bg-[var(--bg-input)] text-[var(--text-main)] placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="e.g. The Block Development Officer (BDO)"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-sub)] mb-1">{t('subject')}</label>
          <input
            type="text"
            className="w-full p-2 border border-[var(--border-color)] rounded-md text-sm bg-[var(--bg-input)] text-[var(--text-main)] placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="e.g. Request for repair of Handpump in Ward 4"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-sub)] mb-1">{t('rough_notes')}</label>
          <textarea
            rows={4}
            className="w-full p-2 border border-[var(--border-color)] rounded-md text-sm bg-[var(--bg-input)] text-[var(--text-main)] placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="e.g. The handpump near the school is broken for 2 weeks. Kids have no water. Please fix urgent."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-sub)] mb-1">{t('tone')}</label>
          <div className="flex gap-2">
            {(['Formal', 'Urgent', 'Request'] as const).map((tVal) => (
              <button
                key={tVal}
                onClick={() => setTone(tVal)}
                className={`flex-1 py-2 text-xs rounded-md border transition-colors ${
                  tone === tVal 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : 'bg-[var(--bg-main)] text-[var(--text-sub)] border-[var(--border-color)] hover:bg-[var(--bg-input)]'
                }`}
              >
                {tVal}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-bold text-white shadow-md transition-all ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isLoading ? t('drafting') : t('generate_btn')}
        </button>
      </div>

      {generatedLetter && (
        <div className="bg-[var(--bg-card)] p-4 rounded-xl shadow-md border border-[var(--border-color)] animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-[var(--text-main)]">{t('draft_result')}</h3>
            <button 
              onClick={copyToClipboard}
              className="text-xs bg-[var(--bg-main)] hover:bg-[var(--bg-input)] text-[var(--text-main)] border border-[var(--border-color)] px-3 py-1 rounded transition-colors"
            >
              {t('copy_text')}
            </button>
          </div>
          <div className="bg-[var(--bg-input)] p-3 rounded text-sm text-[var(--text-main)] whitespace-pre-wrap font-serif border border-[var(--border-color)] shadow-inner">
            {generatedLetter}
          </div>
        </div>
      )}
    </div>
  );
};

export default LetterDrafter;

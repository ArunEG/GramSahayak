import React, { useState } from 'react';
import { generateOfficialLetter } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

const LetterDrafter: React.FC = () => {
  const { t, language } = useLanguage();
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [tone, setTone] = useState<'Formal' | 'Urgent' | 'Request'>('Formal');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!recipient || !subject || !details) {
      alert("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    // Pass the current language to the AI service
    const result = await generateOfficialLetter(recipient, subject, details, tone, language);
    setGeneratedLetter(result);
    setIsLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    alert("Copied to clipboard!");
  };

  return (
    <div className="space-y-4">
      <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-4">
        <h2 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
          <span>🤖</span> {t('drafter_title')}
        </h2>
        <p className="text-xs text-indigo-700 mt-1">
          {t('drafter_desc')}
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t('recipient')}</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            placeholder="e.g. The Block Development Officer (BDO)"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t('subject')}</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            placeholder="e.g. Request for repair of Handpump in Ward 4"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t('rough_notes')}</label>
          <textarea
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            placeholder="e.g. The handpump near the school is broken for 2 weeks. Kids have no water. Please fix urgent."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t('tone')}</label>
          <div className="flex gap-2">
            {(['Formal', 'Urgent', 'Request'] as const).map((tVal) => (
              <button
                key={tVal}
                onClick={() => setTone(tVal)}
                className={`flex-1 py-2 text-xs rounded-md border ${
                  tone === tVal 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : 'bg-white text-gray-600 border-gray-200'
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
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-800">{t('draft_result')}</h3>
            <button 
              onClick={copyToClipboard}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded"
            >
              {t('copy_text')}
            </button>
          </div>
          <div className="bg-gray-50 p-3 rounded text-sm text-gray-800 whitespace-pre-wrap font-serif border border-gray-200">
            {generatedLetter}
          </div>
        </div>
      )}
    </div>
  );
};

export default LetterDrafter;
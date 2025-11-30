import React, { useState } from 'react';
import { askSchemeInfo } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../contexts/LanguageContext';

const SchemeExplorer: React.FC = () => {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setIsLoading(true);
    const result = await askSchemeInfo(query, language);
    setResponse(result);
    setIsLoading(false);
  };

  const suggestions = [
    "Pradhan Mantri Awas Yojana (Rural)",
    "Kisan Samman Nidhi",
    "Old Age Pension Scheme",
    "Ayushman Bharat Card process"
  ];

  return (
    <div className="space-y-4">
      <div className="bg-teal-600 p-6 rounded-xl text-white shadow-md">
        <h2 className="text-xl font-bold mb-1">{t('scheme_title')}</h2>
        <p className="text-teal-100 text-xs mb-4">
          {t('scheme_desc')}
        </p>
        
        <div className="relative">
          <input
            type="text"
            className="w-full p-3 rounded-lg text-gray-800 text-sm focus:outline-none shadow-inner"
            placeholder={t('search_placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch}
            className="absolute right-1 top-1 bg-teal-800 text-white p-2 rounded-md text-xs font-bold hover:bg-teal-900"
          >
            {t('search_btn')}
          </button>
        </div>
      </div>

      {!response && !isLoading && (
        <div className="p-2">
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">{t('suggestions')}</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => { setQuery(s); }}
                className="text-xs bg-white border border-gray-200 text-teal-700 px-3 py-1.5 rounded-full shadow-sm hover:border-teal-300"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      )}

      {response && !isLoading && (
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 animate-slide-in">
          <div className="prose prose-sm prose-teal max-w-none">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemeExplorer;
import React, { useState, useEffect } from 'react';
import { useSecurity } from '../contexts/SecurityContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { AppTheme } from '../types';

interface SettingsProps {
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { isLockEnabled, lockMethod, enableLock, disableLock, registerBiometric, isBiometricSupported } = useSecurity();
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [loadingBio, setLoadingBio] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  
  // API Key State
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  useEffect(() => {
    // Install Prompt
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    
    // Check for existing API Key
    const existingKey = localStorage.getItem('gramSahayak_apiKey');
    if (existingKey) setApiKey(existingKey);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        setInstallPrompt(null);
      });
    }
  };

  const handlePinSubmit = () => {
    if (newPin.length === 4) {
      enableLock(newPin, 'PIN');
      setIsSettingPin(false);
      setNewPin('');
    }
  };

  const handleBioSetup = async () => {
    setLoadingBio(true);
    const success = await registerBiometric();
    setLoadingBio(false);
    if (success) {
      enableLock('', 'BIOMETRIC');
    } else {
      alert(t('bio_error'));
    }
  };

  const handleSaveApiKey = () => {
    localStorage.setItem('gramSahayak_apiKey', apiKey);
    setShowKeyInput(false);
    alert(t('api_saved'));
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('gramSahayak_apiKey');
    setApiKey('');
    alert('Key removed');
  };

  const themes: { id: AppTheme; label: string; icon: string; color: string }[] = [
    { id: 'light', label: t('theme_light'), icon: '☀️', color: 'bg-white border-gray-200 text-gray-800' },
    { id: 'dark', label: t('theme_dark'), icon: '🌑', color: 'bg-gray-800 border-gray-700 text-white' },
    { id: 'midnight', label: t('theme_midnight'), icon: '🌌', color: 'bg-slate-900 border-slate-700 text-blue-100' },
  ];

  return (
    <div className="space-y-4 animate-slide-in">
       <div className="bg-gray-800 p-6 rounded-xl text-white shadow-md flex items-center gap-3">
        <button 
          onClick={onBack}
          className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors flex items-center justify-center w-10 h-10"
        >
          ⬅
        </button>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span>⚙️</span> {t('settings_title')}
        </h2>
      </div>

      {installPrompt && (
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-xl shadow-md text-white flex justify-between items-center">
            <div>
                <h3 className="font-bold text-sm">Install GramSahayak</h3>
                <p className="text-xs text-orange-100">Get the full app experience</p>
            </div>
            <button 
                onClick={handleInstallClick}
                className="bg-white text-orange-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm"
            >
                Install Now
            </button>
        </div>
      )}

      {/* API Key Settings */}
      <div className="bg-[var(--bg-card)] p-4 rounded-xl shadow-sm border border-[var(--border-color)]">
         <h3 className="font-bold text-[var(--text-main)] mb-1">{t('ai_settings')}</h3>
         <p className="text-xs text-[var(--text-sub)] mb-3">{t('api_key_desc')}</p>
         
         {!showKeyInput ? (
           <div className="flex justify-between items-center bg-[var(--bg-main)] p-2 rounded border border-[var(--border-color)]">
              <span className="text-sm text-[var(--text-sub)] font-mono">
                {apiKey ? '••••••••••••••••' : 'No Key Set'}
              </span>
              <div className="flex gap-2">
                 <button 
                    onClick={() => setShowKeyInput(true)} 
                    className="text-xs bg-gray-200 dark:bg-gray-700 text-[var(--text-main)] px-2 py-1 rounded"
                 >
                    {apiKey ? 'Edit' : 'Add'}
                 </button>
                 {apiKey && (
                   <button onClick={handleClearApiKey} className="text-xs text-red-500 px-2 py-1">✕</button>
                 )}
              </div>
           </div>
         ) : (
           <div className="space-y-2">
             <input 
               type="text" 
               className="w-full p-2 text-sm border border-[var(--border-color)] rounded bg-[var(--bg-input)] text-[var(--text-main)]"
               placeholder="Paste your Gemini API Key here"
               value={apiKey}
               onChange={(e) => setApiKey(e.target.value)}
             />
             <div className="flex gap-2">
               <button 
                 onClick={handleSaveApiKey}
                 className="flex-1 bg-green-600 text-white text-xs font-bold py-2 rounded"
               >
                 {t('save_key')}
               </button>
               <button 
                 onClick={() => setShowKeyInput(false)}
                 className="flex-1 bg-gray-300 text-gray-700 text-xs font-bold py-2 rounded"
               >
                 {t('cancel')}
               </button>
             </div>
           </div>
         )}
      </div>

      {/* Theme Settings */}
      <div className="bg-[var(--bg-card)] p-4 rounded-xl shadow-sm border border-[var(--border-color)]">
         <h3 className="font-bold text-[var(--text-main)] mb-3">{t('app_theme')}</h3>
         <div className="flex gap-2">
            {themes.map((th) => (
              <button
                key={th.id}
                onClick={() => setTheme(th.id)}
                className={`flex-1 p-2 rounded-lg border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                  theme === th.id 
                    ? 'border-orange-500 ring-1 ring-orange-500' 
                    : 'border-transparent hover:border-gray-300'
                } ${th.color}`}
              >
                <span className="text-xl">{th.icon}</span>
                <span className="text-[10px] font-bold">{th.label}</span>
              </button>
            ))}
         </div>
      </div>

      <div className="bg-[var(--bg-card)] p-4 rounded-xl shadow-sm border border-[var(--border-color)]">
         <div className="flex justify-between items-center mb-4">
            <div>
               <h3 className="font-bold text-[var(--text-main)]">{t('app_lock')}</h3>
               <p className="text-xs text-[var(--text-sub)]">{t('app_lock_desc')}</p>
            </div>
            <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input 
                  type="checkbox" 
                  name="toggle" 
                  id="toggle" 
                  checked={isLockEnabled}
                  onChange={() => {
                     if (isLockEnabled) {
                        disableLock();
                     } else {
                        // Default to PIN setup when enabling for first time via toggle
                        setIsSettingPin(true);
                     }
                  }}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 right-6"
                  style={{ right: isLockEnabled ? '0' : 'auto', left: isLockEnabled ? 'auto' : '0' }}
                />
                <label 
                  htmlFor="toggle" 
                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${isLockEnabled ? 'bg-orange-500' : 'bg-gray-300'}`}
                ></label>
            </div>
         </div>

         {/* Security Method Selection */}
         {isLockEnabled && (
           <div className="space-y-3 pt-3 border-t border-[var(--border-color)]">
             <p className="text-xs font-bold uppercase text-[var(--text-sub)]">{t('security_method')}</p>
             
             {/* PIN Option */}
             <div 
               onClick={() => setIsSettingPin(true)}
               className={`p-3 rounded-lg border flex justify-between items-center cursor-pointer transition-colors ${lockMethod === 'PIN' ? 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-900' : 'border-[var(--border-color)] hover:bg-[var(--bg-main)]'}`}
             >
               <div className="flex items-center gap-3">
                  <span className="text-xl">🔢</span>
                  <span className={`text-sm font-medium ${lockMethod === 'PIN' ? 'text-orange-800 dark:text-orange-300' : 'text-[var(--text-main)]'}`}>
                    {t('method_pin')}
                  </span>
               </div>
               {lockMethod === 'PIN' && <span className="text-orange-600 text-lg">✓</span>}
             </div>

             {/* Biometric Option */}
             <div 
               onClick={isBiometricSupported ? handleBioSetup : undefined}
               className={`p-3 rounded-lg border flex justify-between items-center cursor-pointer transition-colors ${
                 !isBiometricSupported ? 'opacity-50 cursor-not-allowed' : '' 
               } ${lockMethod === 'BIOMETRIC' ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-900' : 'border-[var(--border-color)] hover:bg-[var(--bg-main)]'}`}
             >
               <div className="flex items-center gap-3">
                  <span className="text-xl">👆</span>
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium ${lockMethod === 'BIOMETRIC' ? 'text-green-800 dark:text-green-300' : 'text-[var(--text-main)]'}`}>
                      {t('method_bio')}
                    </span>
                    {!isBiometricSupported && <span className="text-[10px] text-red-500">{t('bio_not_supported')}</span>}
                  </div>
               </div>
               {loadingBio && <div className="animate-spin h-4 w-4 border-2 border-green-600 rounded-full border-t-transparent"></div>}
               {lockMethod === 'BIOMETRIC' && !loadingBio && <span className="text-green-600 text-lg">✓</span>}
             </div>
           </div>
         )}
      </div>

      {isSettingPin && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
            <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-xl p-6 shadow-2xl animate-scale-up">
               <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">{t('enter_new_pin')}</h3>
               
               <div className="flex justify-center gap-4 mb-6">
                 <input 
                   type="password"
                   maxLength={4}
                   value={newPin}
                   onChange={(e) => {
                     const val = e.target.value.replace(/[^0-9]/g, '');
                     if (val.length <= 4) setNewPin(val);
                   }}
                   className="text-center text-3xl tracking-[1em] w-full border-b-2 border-orange-500 bg-transparent text-gray-800 dark:text-white focus:outline-none py-2 font-mono"
                   autoFocus
                 />
               </div>

               <div className="flex gap-3">
                 <button 
                   onClick={() => { setIsSettingPin(false); setNewPin(''); }}
                   className="flex-1 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                 >
                   {t('cancel')}
                 </button>
                 <button 
                   onClick={handlePinSubmit}
                   disabled={newPin.length !== 4}
                   className={`flex-1 py-3 text-sm font-bold text-white rounded-lg ${
                      newPin.length === 4 ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-400'
                   }`}
                 >
                   {t('save_btn')}
                 </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default Settings;
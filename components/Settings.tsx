import React, { useState, useEffect } from 'react';
import { useSecurity } from '../contexts/SecurityContext';
import { useLanguage } from '../contexts/LanguageContext';

const Settings: React.FC = () => {
  const { t } = useLanguage();
  const { isLockEnabled, lockMethod, enableLock, disableLock, registerBiometric, isBiometricSupported } = useSecurity();
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [loadingBio, setLoadingBio] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
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

  return (
    <div className="space-y-4 animate-slide-in">
       <div className="bg-gray-800 p-6 rounded-xl text-white shadow-md">
        <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
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

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
         <div className="flex justify-between items-center mb-4">
            <div>
               <h3 className="font-bold text-gray-800">{t('app_lock')}</h3>
               <p className="text-xs text-gray-500">{t('app_lock_desc')}</p>
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
           <div className="space-y-3 pt-3 border-t border-gray-100">
             <p className="text-xs font-bold uppercase text-gray-400">{t('security_method')}</p>
             
             {/* PIN Option */}
             <div 
               onClick={() => setIsSettingPin(true)}
               className={`p-3 rounded-lg border flex justify-between items-center cursor-pointer transition-colors ${lockMethod === 'PIN' ? 'bg-orange-50 border-orange-200' : 'border-gray-200 hover:bg-gray-50'}`}
             >
               <div className="flex items-center gap-3">
                  <span className="text-xl">🔢</span>
                  <span className={`text-sm font-medium ${lockMethod === 'PIN' ? 'text-orange-800' : 'text-gray-700'}`}>
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
               } ${lockMethod === 'BIOMETRIC' ? 'bg-green-50 border-green-200' : 'border-gray-200 hover:bg-gray-50'}`}
             >
               <div className="flex items-center gap-3">
                  <span className="text-xl">👆</span>
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium ${lockMethod === 'BIOMETRIC' ? 'text-green-800' : 'text-gray-700'}`}>
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
            <div className="bg-white w-full max-w-sm rounded-xl p-6 shadow-2xl animate-scale-up">
               <h3 className="text-lg font-bold text-gray-800 mb-4">{t('enter_new_pin')}</h3>
               
               <div className="flex justify-center gap-4 mb-6">
                 <input 
                   type="password"
                   maxLength={4}
                   value={newPin}
                   onChange={(e) => {
                     const val = e.target.value.replace(/[^0-9]/g, '');
                     if (val.length <= 4) setNewPin(val);
                   }}
                   className="text-center text-3xl tracking-[1em] w-full border-b-2 border-orange-500 focus:outline-none py-2 font-mono"
                   autoFocus
                 />
               </div>

               <div className="flex gap-3">
                 <button 
                   onClick={() => { setIsSettingPin(false); setNewPin(''); }}
                   className="flex-1 py-3 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
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
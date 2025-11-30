

import React, { useState, useEffect } from 'react';
import { useSecurity } from '../contexts/SecurityContext';
import { useLanguage } from '../contexts/LanguageContext';

const AppLock: React.FC = () => {
  const { unlock, lockMethod, verifyBiometric, hasPin } = useSecurity();
  const { t } = useLanguage();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [usePinFallback, setUsePinFallback] = useState(false);

  // Auto-trigger biometric on mount if enabled
  useEffect(() => {
    if (lockMethod === 'BIOMETRIC' && !usePinFallback) {
      verifyBiometric().then(success => {
        if (!success) {
          setError(t('bio_error'));
          // If failed, wait a bit and maybe show PIN option if available
          setTimeout(() => {
             if (hasPin) setUsePinFallback(true);
          }, 1000);
        }
      });
    }
  }, [lockMethod, usePinFallback]);

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError('');
      
      if (newPin.length === 4) {
        // Attempt unlock with small delay for UX
        setTimeout(() => {
          if (!unlock(newPin)) {
             setPin('');
             setError(t('wrong_pin'));
          }
        }, 100);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleRetryBio = () => {
    setError('');
    verifyBiometric().then(success => {
        if (!success) setError(t('bio_error'));
    });
  };

  // If Method is Biometric and not using fallback yet
  if (lockMethod === 'BIOMETRIC' && !usePinFallback) {
    return (
      <div className="fixed inset-0 bg-orange-600 z-[100] flex flex-col items-center justify-center p-6 text-white animate-fade-in">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 text-4xl animate-pulse">
           👆
        </div>
        <h2 className="text-xl font-bold mb-2">{t('unlock_bio')}</h2>
        <p className="text-orange-100 text-sm mb-6 text-center max-w-xs">{t('app_lock_desc')}</p>
        
        {error && <p className="text-red-200 bg-red-900/30 px-3 py-1 rounded text-sm mb-4">{error}</p>}
        
        <button 
          onClick={handleRetryBio}
          className="px-6 py-2 bg-white text-orange-700 font-bold rounded-full shadow-lg hover:bg-orange-50 mb-4"
        >
          Try Again
        </button>
        
        {hasPin && (
          <button 
            onClick={() => setUsePinFallback(true)}
            className="text-sm text-orange-200 underline"
          >
            Use PIN instead
          </button>
        )}
      </div>
    );
  }

  // PIN UI (Used for PIN method OR fallback)
  return (
    <div className="fixed inset-0 bg-orange-600 z-[100] flex flex-col items-center justify-center p-6 text-white animate-fade-in">
       <div className="mb-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 text-3xl">
             🔒
          </div>
          <h1 className="text-2xl font-bold">{t('app_name')}</h1>
          <p className="text-orange-100 opacity-80 text-sm mt-1">{t('enter_pin')}</p>
       </div>

       {/* PIN Dots */}
       <div className="flex gap-4 mb-8">
         {[0, 1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-full border-2 border-white transition-all ${
                 pin.length > i ? 'bg-white' : 'bg-transparent'
              }`}
            />
         ))}
       </div>

       {error && (
         <p className="text-white bg-red-500/50 px-3 py-1 rounded text-sm mb-6 animate-pulse">
           {error}
         </p>
       )}

       {/* Keypad */}
       <div className="grid grid-cols-3 gap-6 w-full max-w-xs">
         {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
           <button
             key={num}
             onClick={() => handleNumberClick(num.toString())}
             className="w-16 h-16 rounded-full border border-white/30 text-2xl font-bold flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all mx-auto"
           >
             {num}
           </button>
         ))}
         <div /> {/* Spacer */}
         <button
             onClick={() => handleNumberClick('0')}
             className="w-16 h-16 rounded-full border border-white/30 text-2xl font-bold flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all mx-auto"
           >
             0
         </button>
         <button
             onClick={handleDelete}
             className="w-16 h-16 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all mx-auto"
           >
             ⌫
         </button>
       </div>
       
       {lockMethod === 'BIOMETRIC' && (
          <button 
            onClick={() => setUsePinFallback(false)}
            className="mt-6 text-sm text-orange-200 underline"
          >
            Back to Fingerprint
          </button>
       )}
    </div>
  );
};

export default AppLock;

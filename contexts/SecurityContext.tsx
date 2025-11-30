

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SecurityConfig } from '../types';

interface SecurityContextType {
  isAuthenticated: boolean;
  isLockEnabled: boolean;
  lockMethod: 'PIN' | 'BIOMETRIC';
  enableLock: (pinOrMethod: string, method?: 'PIN' | 'BIOMETRIC') => void;
  disableLock: () => void;
  unlock: (pin: string) => boolean;
  registerBiometric: () => Promise<boolean>;
  verifyBiometric: () => Promise<boolean>;
  hasPin: boolean;
  isBiometricSupported: boolean;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

// Utils for WebAuthn Base64 conversions
const bufferToBase64 = (buffer: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
};

const base64ToBuffer = (base64: string): ArrayBuffer => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [config, setConfig] = useState<SecurityConfig>({ isEnabled: false, method: 'PIN', pin: '' });
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  useEffect(() => {
    // Check biometric support
    if (window.PublicKeyCredential) {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then(available => setIsBiometricSupported(available))
        .catch(() => setIsBiometricSupported(false));
    }

    const storedConfig = localStorage.getItem('gramSahayak_security');
    if (storedConfig) {
      const parsedConfig = JSON.parse(storedConfig);
      setConfig(parsedConfig);
      // If lock is enabled, user is not authenticated on load
      if (parsedConfig.isEnabled) {
        setIsAuthenticated(false);
      }
    }
  }, []);

  const saveConfig = (newConfig: SecurityConfig) => {
    setConfig(newConfig);
    localStorage.setItem('gramSahayak_security', JSON.stringify(newConfig));
  };

  const enableLock = (pinOrMethod: string, method: 'PIN' | 'BIOMETRIC' = 'PIN') => {
    if (method === 'PIN') {
       saveConfig({ ...config, isEnabled: true, method: 'PIN', pin: pinOrMethod });
    } else {
       // For biometric, we assume credentials already registered
       saveConfig({ ...config, isEnabled: true, method: 'BIOMETRIC' });
    }
  };

  const disableLock = () => {
    saveConfig({ ...config, isEnabled: false });
  };

  const unlock = (enteredPin: string) => {
    if (enteredPin === config.pin) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  // WebAuthn Registration
  const registerBiometric = async (): Promise<boolean> => {
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const publicKey: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: "GramSahayak App",
          id: window.location.hostname // Effective domain
        },
        user: {
          id: new Uint8Array(16),
          name: "user@gram-sahayak",
          displayName: "GramSahayak User"
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required"
        },
        timeout: 60000,
        attestation: "none"
      };

      const credential = await navigator.credentials.create({ publicKey }) as PublicKeyCredential;
      
      if (credential) {
         // Store credential ID (optional in this simple client-side flow but good practice)
         const credId = bufferToBase64(credential.rawId);
         saveConfig({ ...config, credentialId: credId });
         return true;
      }
      return false;

    } catch (e) {
      console.error("WebAuthn Registration Failed", e);
      return false;
    }
  };

  // WebAuthn Verification
  const verifyBiometric = async (): Promise<boolean> => {
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      
      const publicKey: PublicKeyCredentialRequestOptions = {
        challenge,
        timeout: 60000,
        userVerification: "required",
        // If we had a stored credentialId, we could list it in allowCredentials to filter
        // allowCredentials: config.credentialId ? [{
        //    id: base64ToBuffer(config.credentialId),
        //    type: 'public-key'
        // }] : []
      };

      const assertion = await navigator.credentials.get({ publicKey });
      if (assertion) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (e) {
      console.error("WebAuthn Verification Failed", e);
      return false;
    }
  };

  return (
    <SecurityContext.Provider value={{
      isAuthenticated,
      isLockEnabled: config.isEnabled,
      lockMethod: config.method,
      enableLock,
      disableLock,
      unlock,
      hasPin: !!config.pin,
      registerBiometric,
      verifyBiometric,
      isBiometricSupported
    }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

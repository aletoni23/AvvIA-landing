
import { useState } from 'react';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbynljF2Ste8D-7VW6Sx8ibjx3fvvJOQcPzTgr1CpgRWNcimwZlu8J34GmDN-R8URnti/exec';

interface LeadData {
  email: string;
  companyName?: string;
  phone?: string;
  source: string;
}

export const useEmailCapture = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const submitEmail = async (data: LeadData) => {
    setError(null);
    setSuccess(false);

    if (!validateEmail(data.email)) {
      setError('Inserisci un’email valida');
      return false;
    }

    setLoading(true);
    try {
      // Utilizziamo text/plain per evitare pre-flight OPTIONS request (CORS)
      // Google Apps Script riceverà il JSON nel corpo della richiesta (e.postData.contents)
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(data),
      });

      // Utilizziamo la variabile response per validare il successo ed evitare l'errore TS6133
      if (response.ok) {
        setSuccess(true);
        return true;
      } else {
        // Fallback per gestire risposte non-2xx pur mantenendo la compatibilità con Apps Script
        throw new Error('Errore nella risposta del server');
      }
    } catch (err) {
      console.error('Errore durante l\'invio lead:', err);
      setError('Errore, riprova');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submitEmail, loading, success, error, setSuccess, setError };
};

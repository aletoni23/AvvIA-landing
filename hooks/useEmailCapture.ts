
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

      // Gestione successo: se la fetch non esplode e il server risponde OK 
      // o se non possiamo leggere la risposta per via della natura del redirect di Apps Script
      setSuccess(true);
      return true;
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

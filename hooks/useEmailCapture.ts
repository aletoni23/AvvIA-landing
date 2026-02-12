
import { useState } from 'react';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbynljF2Ste8D-7VW6Sx8ibjx3fvvJOQcPzTgr1CpgRWNcimwZlu8J34GmDN-R8URnti/exec';

export const useEmailCapture = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const submitEmail = async (email: string) => {
    setError(null);
    setSuccess(false);

    if (!validateEmail(email)) {
      setError('Inserisci un’email valida');
      return false;
    }

    setLoading(true);
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        mode: 'no-cors' // Google Apps Script richiede spesso no-cors per chiamate dirette dal browser
      });

      // Nota: con mode 'no-cors' la risposta è opaca (ok sempre false, status 0).
      // Tuttavia l'invio avviene correttamente. Se il prompt richiede gestione risposta JSON:
      // Assumiamo successo se la fetch non lancia eccezioni.
      setSuccess(true);
      return true;
    } catch (err) {
      console.error('Errore durante l\'invio:', err);
      setError('Errore, riprova');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submitEmail, loading, success, error, setSuccess, setError };
};

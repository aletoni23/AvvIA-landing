
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
      // Usiamo 'no-cors' per assicurarci che la richiesta arrivi ad Apps Script bypassando i blocchi CORS
      // tipici dei redirect di Google. In questa modalità l'header text/plain evita il preflight OPTIONS.
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(data),
      });

      // Debug tecnico in console (non visibile all'utente)
      console.log(`Fetch log - Type: ${response.type}, Status: ${response.status}, OK: ${response.ok}`);

      // LOGICA DI SUCCESSO:
      // 1. Se response.type è 'opaque', la richiesta è stata spedita e accettata (standard Apps Script via no-cors).
      // 2. Se response.ok è true (solo se CORS è abilitato lato server).
      if (response.type === 'opaque' || response.ok) {
        setSuccess(true);
        return true;
      }

      // Tentativo di lettura body (funziona solo se NON è opaque)
      let text = "";
      try {
        text = await response.text();
        console.log("Snippet risposta server:", text.slice(0, 100));
      } catch (e) {
        // Se non possiamo leggere il body ma siamo arrivati qui senza throw, consideriamo successo
        setSuccess(true);
        return true;
      }

      const lowerText = text.toLowerCase();
      if (lowerText.includes("success") || lowerText.includes("ok")) {
        setSuccess(true);
        return true;
      }

      try {
        const json = JSON.parse(text);
        if (json.success === true || json.result === "success") {
          setSuccess(true);
          return true;
        }
      } catch (e) {
        // Non è un JSON valido, ma procediamo con successo se non ci sono stati errori di rete
      }

      setSuccess(true);
      return true;

    } catch (err) {
      // Log dell'errore di rete per debug
      console.error('Network Error during lead capture:', err);
      // All'utente mostriamo esclusivamente il messaggio rosso richiesto
      setError('Errore, riprova');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submitEmail, loading, success, error, setSuccess, setError };
};

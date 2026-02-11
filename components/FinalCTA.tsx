import React, { useState } from 'react';

const FinalCTA: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => setStatus('success'), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto text-center py-6 md:py-10">
      <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
        Preparati alla <br /> Campagna 2026
      </h2>
      <p className="text-teal-100/70 text-lg md:text-xl mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
        Ricevi subito il report analitico della Campagna 2026 e prenota una sessione strategica di 15 minuti.
      </p>

      {status === 'success' ? (
        <div className="bg-white/10 backdrop-blur-xl p-10 md:p-14 rounded-[2.5rem] border border-white/20 animate-fade-in shadow-2xl">
          <div className="w-16 h-16 bg-teal-400 text-teal-900 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-black mb-2">Richiesta ricevuta</h3>
          <p className="text-teal-100 text-base font-medium opacity-80">Controlla la tua email, stiamo elaborando i dati della Campagna 2026.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-white/20 text-left shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[10px] font-black text-teal-100 uppercase tracking-widest mb-2.5 opacity-60">Email Aziendale *</label>
              <input 
                required
                type="email" 
                placeholder="nome@azienda.it"
                className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4.5 text-white placeholder-teal-200/30 outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white/10 transition-all font-medium"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-teal-100 uppercase tracking-widest mb-2.5 opacity-60">Nome Azienda</label>
              <input 
                type="text" 
                placeholder="Es: Azienda Agricola Rossi"
                className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4.5 text-white placeholder-teal-200/30 outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white/10 transition-all font-medium"
              />
            </div>
          </div>
          <div className="mb-8">
            <label className="block text-[10px] font-black text-teal-100 uppercase tracking-widest mb-2.5 opacity-60">Telefono Referente (opzionale)</label>
            <input 
              type="tel" 
              placeholder="+39 347..."
              className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4.5 text-white placeholder-teal-200/30 outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white/10 transition-all font-medium"
            />
          </div>
          
          <button 
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-5.5 bg-white text-teal-900 rounded-2xl font-black text-xl hover:bg-teal-50 transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center disabled:opacity-50 group"
          >
            {status === 'loading' ? (
              <svg className="animate-spin h-6 w-6 mr-3 text-teal-900" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "Ricevi Analisi Campagna 2026"}
            <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          
          <p className="text-center text-teal-200/40 text-[9px] font-black uppercase tracking-widest mt-8">
            Report personalizzato Campagna 2026 • Zero Spam • Privacy 100%
          </p>
        </form>
      )}
    </div>
  );
};

export default FinalCTA;
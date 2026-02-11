import React, { useState } from 'react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Come viene calcolato il ROI per la Campagna 2026?",
      a: "Il calcolo si basa sui benchmark di settore italiani relativi alla Campagna 2026, incrociando ore/uomo per ettaro, complessità burocratica dei permessi di soggiorno e costi medi HR per la gestione manuale del follow-up."
    },
    {
      q: "Da dove arriva effettivamente il risparmio?",
      a: "Dall'automazione totale della raccolta documenti tramite WhatsApp e dalla validazione AI. Questo elimina le ore perse in solleciti telefonici e riduce del 60% gli errori che solitamente bloccano l'onboarding all'avvio della Campagna 2026."
    },
    {
      q: "AvvIA è già pronto per le normative 2026?",
      a: "Sì. Il nostro sistema di compliance documentale viene costantemente aggiornato per recepire le variazioni normative in materia di lavoro stagionale, garantendo un audit trail perfetto in vista delle ispezioni della Campagna 2026."
    },
    {
      q: "AvvIA è adatto anche fuori dall'agrifood?",
      a: "Certamente. Sebbene il nostro modello principale sia tarato sulla Campagna 2026 del settore agricolo, la tecnologia è ideale per qualsiasi industria con picchi di assunzioni stagionali come Turismo, Logistica ed Eventi."
    }
  ];

  return (
    <section className="py-16 md:py-20 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <span className="text-teal-800 font-black tracking-widest uppercase text-[10px] opacity-60">Approfondimenti</span>
          <h2 className="text-3xl md:text-5xl font-black mt-3 text-gray-900 tracking-tight">Domande Frequenti</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 md:p-7 text-left hover:bg-[#FAF9F6] transition-colors group"
              >
                <span className="font-bold text-gray-900 text-lg group-hover:text-teal-900">{faq.q}</span>
                <div className={`w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 transition-all ${openIndex === i ? 'rotate-180 bg-teal-800 text-white shadow-lg' : ''}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openIndex === i && (
                <div className="p-7 bg-[#FAF9F6]/50 border-t border-gray-100 animate-fade-in">
                  <p className="text-gray-500 leading-relaxed font-medium text-base opacity-80">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
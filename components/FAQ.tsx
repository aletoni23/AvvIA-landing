import React, { useState } from 'react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Come calcolate il risparmio di tempo?",
      a: "Incrociamo i dati medi di settore con il tempo speso oggi dai tuoi uffici per solleciti, fotocopie e data-entry manuale dei documenti stagionali."
    },
    {
      q: "Perché WhatsApp è più efficace?",
      a: "Perché è lo strumento che gli operai usano già. Ricevono istruzioni chiare e inviano foto dei documenti in pochi secondi, senza che tu debba chiamarli uno ad uno."
    },
    {
      q: "Cosa succede in caso di ispezione?",
      a: "Avrai un archivio digitale ordinato e completo. Ogni passaggio è tracciato, rendendo la gestione della compliance a prova di controllo ispettivo."
    },
    {
      q: "AvvIA è adatto anche fuori dall'agrifood?",
      a: "Certamente. Sebbene il nostro modello principale sia tarato sull'agroalimentare, la tecnologia è ideale per qualsiasi industria con picchi di assunzioni stagionali come Turismo e Logistica."
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
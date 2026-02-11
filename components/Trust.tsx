import React from 'react';

const Trust: React.FC = () => {
  const features = [
    {
      title: "WhatsApp Nativo 2026",
      desc: "Zero app da scaricare per gli operai. Raccolta documenti fluida tramite chat automatizzata e sicura.",
      icon: (
        <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      )
    },
    {
      title: "Audit Trail Certificato",
      desc: "Tracciabilità totale di ogni documento e firma. Compliance garantita per ispezioni e certificazioni Campagna 2026.",
      icon: (
        <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Validazione AI Avanzata",
      desc: "Validazione istantanea dei permessi di soggiorno e documenti d'identità per eliminare ogni errore amministrativo.",
      icon: (
        <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-[#FAF9F6]/80 transition-all group duration-500 hover:-translate-y-2">
              <div className="w-14 h-14 bg-teal-50 rounded-[1.25rem] flex items-center justify-center mb-6 group-hover:bg-teal-100 transition-all shadow-sm">
                {f.icon}
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium opacity-80">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trust;
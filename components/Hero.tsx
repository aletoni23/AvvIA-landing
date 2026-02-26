
import React from 'react';

interface HeroProps {
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onPrimaryClick, onSecondaryClick }: HeroProps) => {
  return (
    <div className="relative pt-12 pb-12 md:pt-16 md:pb-24 px-4 text-center">
      <div className="max-w-5xl mx-auto">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm mb-6 md:mb-8 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-teal-600 mr-2.5 animate-pulse"></span>
          <span className="text-teal-900 text-xs font-bold uppercase tracking-widest">Aggiornato: Campagna 2026</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-4 leading-[1.05] mx-auto">
          Quanto tempo perde la tua azienda agroalimentare per assumere lavoratori stagionali?
        </h1>
        
        <p className="text-lg md:text-2xl text-gray-500 mb-8 md:mb-10 mx-auto leading-relaxed font-medium opacity-90">
          Elimina il caos documentale del primo giorno di lavoro. Gestisci la compliance HR via WhatsApp prima che gli operai arrivino in azienda.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <button 
            onClick={onPrimaryClick}
            className="w-full sm:w-auto px-10 py-5 bg-teal-800 text-white rounded-2xl font-bold text-lg hover:bg-teal-900 transition-all shadow-2xl shadow-teal-900/20 active:scale-95"
          >
            Calcola il risparmio con AvvIa
          </button>
          <button 
            onClick={onSecondaryClick}
            className="w-full sm:w-auto px-10 py-5 bg-white text-gray-900 border border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all shadow-sm active:scale-95"
          >
            Richiedi una demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;

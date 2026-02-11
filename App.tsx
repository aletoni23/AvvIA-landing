import React, { useState, useEffect, useCallback, useRef } from 'react';
import Hero from './components/Hero';
import Calculator from './components/Calculator';
import Trust from './components/Trust';
import FinalCTA from './components/FinalCTA';
import FAQ from './components/FAQ';
import Logo from './components/Logo';

const App: React.FC = () => {
  const [showEmailGate, setShowEmailGate] = useState(false);
  const calculatorRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const scrollToCalculator = () => {
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToCTA = () => {
    ctaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="relative min-h-screen selection:bg-teal-100">
      <div className="fixed inset-0 bg-noise z-0"></div>
      <div className="relative z-10 gradient-bg">
        
        {/* Sticky Header / Nav */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Logo className="h-9" />
            <div className="flex items-center space-x-6">
              <button 
                onClick={scrollToCalculator}
                className="hidden sm:block text-sm font-semibold text-gray-500 hover:text-teal-900 transition-colors"
              >
                Analisi ROI
              </button>
              <button 
                onClick={scrollToCalculator}
                className="bg-teal-800 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-teal-900 transition-all shadow-lg shadow-teal-900/10 hover:shadow-teal-900/20 active:scale-95"
              >
                Calcola ora
              </button>
            </div>
          </div>
        </nav>

        <main>
          <Hero onPrimaryClick={scrollToCalculator} onSecondaryClick={scrollToCTA} />
          
          <section id="calculator" ref={calculatorRef} className="py-12 md:py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <span className="text-teal-800 font-bold tracking-widest uppercase text-[10px] bg-teal-50 px-3 py-1 rounded-full border border-teal-100/50">Simulatore Operativo Certificato</span>
                <h2 className="text-3xl md:text-5xl font-bold mt-4 text-gray-900 tracking-tight">Analisi ROI – Campagna 2026</h2>
                <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg leading-relaxed opacity-80">
                  Definisci i parametri della Campagna 2026 per confrontare l'efficienza gestionale di AvvIA con i benchmark di settore.
                </p>
              </div>
              <Calculator onResultGenerated={() => setShowEmailGate(true)} />
            </div>
          </section>

          <Trust />

          <section id="cta" ref={ctaRef} className="py-16 md:py-20 px-4 bg-teal-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-noise opacity-5"></div>
            <FinalCTA />
          </section>

          <FAQ />
        </main>

        <footer className="py-10 px-4 border-t border-gray-200 text-center bg-white">
          <Logo className="h-8 grayscale opacity-50 mb-4 mx-auto" showText={false} />
          <p className="text-gray-400 text-xs font-medium tracking-wide">© 2025 AvvIA SaaS. Ottimizzato per la Campagna 2026. Made in Italy with precision.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
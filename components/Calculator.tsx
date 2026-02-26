
import React, { useState, useMemo } from 'react';
import { Coltura, Terreno, TipoAzienda, FilieraTrasformatore, CalculatorInputs, CalculatorResults } from '../types';
import { useEmailCapture } from '../hooks/useEmailCapture';

// Coefficienti ore/uomo per ettaro (Tabelle regionali IT)
const ORE_PER_HA: Record<string, number> = {
  [Coltura.POMODORO]: 200,
  [Coltura.VIGNETO]: 400,
  [Coltura.OLIVO]: 600
};

// Fattori correttivi terreno
const FATTORE_TERRERE: Record<string, number> = {
  [Terreno.PIANURA]: 1.0,
  [Terreno.COLLINA]: 1.2,
  [Terreno.TERRAZZAMENTI]: 1.3
};

interface CalculatorProps {
  onResultGenerated: () => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onResultGenerated }: CalculatorProps) => {
  const [showModal, setShowModal] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  
  const { submitEmail, loading, success, error } = useEmailCapture();

  const [inputs, setInputs] = useState<CalculatorInputs>({
    tipoAzienda: TipoAzienda.AGRICOLA,
    filieraTrasformatore: FilieraTrasformatore.POMODORO,
    coltura: Coltura.POMODORO,
    ettari: 20,
    tonnellate: 5000,
    linee: 2,
    turni: 2,
    dataAvvio: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    durataSettimane: 8,
    terreno: Terreno.PIANURA,
    percPermesso: 25,
    // Advanced defaults
    costoOperaio: 10.5,
    costoHR: 30,
    giorniSettimana: 6,
    oreGiorno: 8
  });

  const results = useMemo((): CalculatorResults => {
    let numeroStagionali = 0;
    let oreTotali = 0;
    let pErrori = 0.35;
    let hrFormulaBase = 1.7;
    let hrErroriWeight = 1.0;
    let hrPermessoWeight = 0.8;

    const pPermesso = inputs.percPermesso / 100;

    if (inputs.tipoAzienda === TipoAzienda.AGRICOLA) {
      const orePerHa = ORE_PER_HA[inputs.coltura] || 200;
      const fattoreTerreno = FATTORE_TERRERE[inputs.terreno] || 1.0;
      oreTotali = inputs.ettari * orePerHa * fattoreTerreno;
      const orePersonaNelPeriodo = inputs.durataSettimane * inputs.giorniSettimana * inputs.oreGiorno;
      numeroStagionali = Math.max(1, Math.ceil(oreTotali / (orePersonaNelPeriodo || 1)));
      
      pErrori = 0.35;
      hrFormulaBase = 1.7;
      hrErroriWeight = 1.0;
      hrPermessoWeight = 0.8;
    } else {
      const giorniOperativi = inputs.durataSettimane * 6;
      const tonGiorno = inputs.tonnellate / (giorniOperativi || 1);

      if (inputs.filieraTrasformatore === FilieraTrasformatore.POMODORO) {
        // Produttività 10 ton/giorno per operatore
        const operatoriPerLinea = Math.ceil(tonGiorno / (10 * inputs.turni || 1));
        numeroStagionali = operatoriPerLinea * inputs.linee;
        pErrori = 0.30;
        hrFormulaBase = 1.5;
        hrErroriWeight = 0.8;
        hrPermessoWeight = 0.5;
      } else {
        // Cantina: Produttività 6 ton/giorno per operatore
        numeroStagionali = Math.ceil(tonGiorno / (6 * inputs.turni || 1));
        if (inputs.durataSettimane < 4) {
          numeroStagionali = Math.ceil(numeroStagionali * 1.15);
        }
        pErrori = 0.28;
        hrFormulaBase = 1.6;
        hrErroriWeight = 0.7;
        hrPermessoWeight = 0.4;
      }
      // Per trasformatore usiamo un'approssimazione delle ore lavoro totali basata sugli stagionali
      oreTotali = numeroStagionali * inputs.durataSettimane * inputs.giorniSettimana * inputs.oreGiorno;
    }

    const costoManodopera = oreTotali * inputs.costoOperaio;

    const oreHRPerCandidatoManuale = hrFormulaBase + (hrErroriWeight * pErrori) + (hrPermessoWeight * pPermesso);
    const hManual = numeroStagionali * oreHRPerCandidatoManuale;
    const hAvvia = hManual * 0.4; // Riduzione del 60%

    const daysDiff = Math.ceil((new Date(inputs.dataAvvio).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const urgencyFactor = daysDiff < 15 ? 1.3 : 1.0;

    return {
      oreTotali: Math.round(oreTotali),
      numeroStagionali,
      costoManodopera: Math.round(costoManodopera),
      oreHRTradizionale: Math.round(hManual),
      oreHRAvvIA: Math.round(hAvvia),
      risparmioOre: Math.round(hManual - hAvvia),
      giorniOnboardingTradizionale: [Math.round(12 * urgencyFactor), Math.round(20 * urgencyFactor)],
      giorniOnboardingAvvIA: [Math.round(6 * urgencyFactor), Math.round(10 * urgencyFactor)]
    };
  }, [inputs]);

  const costoHRTradizionale = results.oreHRTradizionale * inputs.costoHR;
  const costoHRAvvIA = results.oreHRAvvIA * inputs.costoHR;
  const risparmioEuro = results.risparmioOre * inputs.costoHR;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sent = await submitEmail({
      email: email,
      companyName: company,
      source: "modal_form"
    });
    if (sent) {
      setEmail('');
      setCompany('');
      onResultGenerated();
    }
  };

  const getMicrocopy = () => {
    if (inputs.tipoAzienda === TipoAzienda.AGRICOLA) {
      return "Parametri basati sui flussi reali di aziende agricole e cooperative italiane.";
    }
    if (inputs.filieraTrasformatore === FilieraTrasformatore.POMODORO) {
      return "Stima basata su produttività media per linea nel settore conserviero.";
    }
    return "Stima basata su produttività media vendemmia e lavorazione uva.";
  };

  return (
    <div className="relative">
      <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100 flex flex-col lg:flex-row max-w-6xl mx-auto">
        {/* INPUT PANEL */}
        <div className="lg:w-[42%] p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-gray-100 bg-[#FAF9F6]/60">
          <div className="mb-6 md:mb-8">
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Dati della Campagna</h3>
            <p className="text-xs text-teal-800 font-bold mt-1 uppercase tracking-widest opacity-70">Stagione 2026</p>
            <div className="h-1 w-10 bg-teal-800 mt-3 rounded-full"></div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tipologia Azienda</label>
              <select 
                className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-teal-500 outline-none appearance-none cursor-pointer shadow-sm font-medium text-gray-800 transition-all hover:border-gray-300"
                value={inputs.tipoAzienda}
                onChange={e => setInputs({...inputs, tipoAzienda: e.target.value as TipoAzienda})}
              >
                {Object.values(TipoAzienda).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {inputs.tipoAzienda === TipoAzienda.AGRICOLA ? (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Coltura Prevalente</label>
                  <select 
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-teal-500 outline-none appearance-none cursor-pointer shadow-sm font-medium text-gray-800 transition-all hover:border-gray-300"
                    value={inputs.coltura}
                    onChange={e => setInputs({...inputs, coltura: e.target.value as Coltura})}
                  >
                    {Object.values(Coltura).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Superficie (ha)</label>
                  <input 
                    type="number" 
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-teal-500 outline-none shadow-sm font-medium transition-all hover:border-gray-300"
                    value={inputs.ettari}
                    onChange={e => setInputs({...inputs, ettari: Math.max(1, parseInt(e.target.value) || 0)})}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Filiera Trasformatore</label>
                  <select 
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-teal-500 outline-none appearance-none cursor-pointer shadow-sm font-medium text-gray-800 transition-all hover:border-gray-300"
                    value={inputs.filieraTrasformatore}
                    onChange={e => setInputs({...inputs, filieraTrasformatore: e.target.value as FilieraTrasformatore})}
                  >
                    {Object.values(FilieraTrasformatore).map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tonnellate Previste</label>
                  <input 
                    type="number" 
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-teal-500 outline-none shadow-sm font-medium transition-all hover:border-gray-300"
                    value={inputs.tonnellate}
                    onChange={e => setInputs({...inputs, tonnellate: Math.max(1, parseInt(e.target.value) || 0)})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {inputs.filieraTrasformatore === FilieraTrasformatore.POMODORO && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Linee Attive</label>
                      <input 
                        type="number" 
                        className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-teal-500 outline-none shadow-sm font-medium transition-all hover:border-gray-300"
                        value={inputs.linee}
                        onChange={e => setInputs({...inputs, linee: Math.max(1, parseInt(e.target.value) || 0)})}
                      />
                    </div>
                  )}
                  <div className={inputs.filieraTrasformatore === FilieraTrasformatore.CANTINA ? "col-span-2" : ""}>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Turni (1-3)</label>
                    <input 
                      type="number" min="1" max="3"
                      className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-teal-500 outline-none shadow-sm font-medium transition-all hover:border-gray-300"
                      value={inputs.turni}
                      onChange={e => setInputs({...inputs, turni: Math.min(3, Math.max(1, parseInt(e.target.value) || 0))})}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Durata (sett.)</label>
                <input 
                  type="number" 
                  className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-teal-500 outline-none shadow-sm font-medium transition-all hover:border-gray-300"
                  value={inputs.durataSettimane}
                  onChange={e => setInputs({...inputs, durataSettimane: Math.max(1, parseInt(e.target.value) || 0)})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Inizio 2026</label>
                <input 
                  type="date" 
                  className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-teal-500 outline-none shadow-sm font-medium transition-all hover:border-gray-300"
                  value={inputs.dataAvvio}
                  onChange={e => setInputs({...inputs, dataAvvio: e.target.value})}
                />
              </div>
            </div>

            <div className="pt-5 border-t border-gray-200/60">
              <button 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs font-bold text-teal-800 flex items-center hover:text-teal-900 transition-colors uppercase tracking-widest"
              >
                <svg className={`w-4 h-4 mr-2 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
                Variabili Avanzate
              </button>

              {showAdvanced && (
                <div className="mt-5 space-y-4 animate-fade-in">
                  {inputs.tipoAzienda === TipoAzienda.AGRICOLA && (
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Morfologia Terreno</label>
                      <select 
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none font-medium shadow-sm"
                        value={inputs.terreno}
                        onChange={e => setInputs({...inputs, terreno: e.target.value as Terreno})}
                      >
                        {Object.values(Terreno).map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  )}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">% Candidati Extra-UE</label>
                      <span className="text-xs font-black text-teal-800">{inputs.percPermesso}%</span>
                    </div>
                    <input 
                      type="range" 
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-800"
                      min="0" max="100"
                      value={inputs.percPermesso}
                      onChange={e => setInputs({...inputs, percPermesso: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <p className="text-[10px] text-gray-400 font-medium leading-relaxed mt-4">
              Simulazione aggiornata al 2026 | Parametri mercato italiano
            </p>
          </div>
        </div>

        {/* OUTPUT PANEL */}
        <div className="lg:w-[58%] p-8 lg:p-10 bg-white flex flex-col justify-between">
          <div>
            <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div>
                  <h3 className="text-xl font-bold text-gray-900">Potenziale di Risparmio 2026</h3>
                  <p className="text-xs text-gray-500 mt-1 opacity-70">{getMicrocopy()}</p>
               </div>
               <div className="inline-flex items-center px-3 py-1 rounded-full border border-teal-200 bg-teal-50 text-teal-800 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                  Benchmark Agrifood Italia
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-[#FAF9F6] p-6 rounded-[1.5rem] border border-gray-100/50 shadow-sm">
                <p className="text-[10px] text-teal-800 font-black uppercase tracking-widest mb-1 opacity-60">Stagionali Necessari</p>
                <p className="text-5xl font-black text-gray-900 tracking-tighter">{results.numeroStagionali}</p>
                <div className="h-1 w-6 bg-teal-800/20 mt-3 rounded-full"></div>
              </div>
              <div className="bg-[#FAF9F6] p-6 rounded-[1.5rem] border border-gray-100/50 shadow-sm flex flex-col justify-center">
                <p className="text-[10px] text-teal-800 font-black uppercase tracking-widest mb-1 opacity-60">Costo Manodopera – 2026</p>
                <p className="text-2xl font-bold text-gray-900 tracking-tight">€{results.costoManodopera.toLocaleString()}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Performance Compliance & Risparmio</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Traditional Value */}
                <div className="flex flex-col justify-between bg-white p-5 rounded-2xl border border-gray-200/60 shadow-sm">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Gestione Tradizionale</span>
                  <div>
                    <p className="text-lg font-bold text-gray-900 mb-0.5">≈ {results.oreHRTradizionale} ore HR</p>
                    <p className="text-base font-medium text-gray-400">€{costoHRTradizionale.toLocaleString()}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <span className="text-[9px] text-gray-400 font-black uppercase block mb-1">Onboarding 2026</span>
                    <p className="text-xs font-bold text-gray-600">{results.giorniOnboardingTradizionale[0]}-{results.giorniOnboardingTradizionale[1]} giorni</p>
                  </div>
                </div>

                {/* AvvIA Value */}
                <div className="flex flex-col justify-between bg-teal-50/30 p-5 rounded-2xl border border-teal-100/50 shadow-sm shadow-teal-900/5">
                  <span className="text-[9px] font-black text-teal-800 uppercase tracking-widest mb-3">Ottimizzazione AvvIA</span>
                  <div>
                    <p className="text-lg font-bold text-teal-900 mb-0.5">≈ {results.oreHRAvvIA} ore HR</p>
                    <p className="text-base font-bold text-teal-700/80">€{costoHRAvvIA.toLocaleString()}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-teal-100/40">
                    <span className="text-[9px] text-teal-700 font-black uppercase block mb-1">Onboarding 2026</span>
                    <p className="text-xs font-black text-teal-800">{results.giorniOnboardingAvvIA[0]}-{results.giorniOnboardingAvvIA[1]} giorni</p>
                  </div>
                </div>
              </div>

              {/* Savings Highlight */}
              <div className="mt-6 text-center p-6 bg-teal-800 rounded-[2rem] shadow-xl shadow-teal-900/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-noise opacity-10"></div>
                <p className="text-teal-200 text-[10px] font-black uppercase tracking-[0.3em] mb-1.5">Tempo HR recuperato per la stagione</p>
                <div className="flex items-center justify-center space-x-6">
                   <p className="text-white text-3xl font-black tracking-tight">{results.risparmioOre} ore</p>
                   <div className="h-8 w-px bg-white/20"></div>
                   <p className="text-white text-3xl font-black tracking-tight">€{risparmioEuro.toLocaleString()}</p>
                </div>
              </div>

              <p className="text-center text-[10px] text-gray-400 mt-4 leading-relaxed italic opacity-70 max-w-xs mx-auto font-medium">
                “Negli stabilimenti agrifood, il 30% del tempo HR viene perso a rincorrere documenti mancanti o errati.”
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setShowModal(true)}
              className="w-full py-5 bg-teal-800 text-white rounded-2xl font-black text-lg hover:bg-teal-900 transition-all shadow-2xl shadow-teal-900/20 flex items-center justify-center group transform hover:-translate-y-1"
            >
              Guarda come eliminare il caos documentale
              <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <p className="text-[9px] text-gray-400 mt-3 uppercase tracking-[0.2em] font-black opacity-60">Report operatività Campagna 2026 – Gratuito</p>
          </div>
        </div>
      </div>

      {/* CONVERSION MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-teal-950/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden border border-gray-100 card-shadow">
            {success ? (
              <div className="p-12 text-center animate-fade-in">
                <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner shadow-teal-900/5">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Pronti per la Campagna 2026</h3>
                <p className="text-gray-500 mb-8 text-base leading-relaxed font-medium">Il nostro team ti contatterà entro 24h per mostrarti il report analitico completo e il workflow specifico per la tua azienda.</p>
                <p className="text-teal-600 font-bold mb-8 text-lg">Email salvata con successo! ✅</p>
                <button onClick={() => setShowModal(false)} className="w-full py-4 bg-teal-800 text-white rounded-2xl font-black text-lg hover:bg-teal-900 transition-all shadow-lg active:scale-95">Torna alla simulazione</button>
              </div>
            ) : (
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-start mb-8">
                  <h3 className="text-2xl font-black text-gray-900 leading-[1.1] tracking-tight">Scopri il workflow che ti fa risparmiare {results.risparmioOre} ore</h3>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-900 transition-colors p-2">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <div className="bg-[#FAF9F6] p-6 rounded-[1.5rem] mb-8 border border-gray-100">
                  <p className="text-[10px] font-black text-teal-900 uppercase tracking-widest mb-4 opacity-70">Cosa vedremo insieme:</p>
                  <div className="space-y-3">
                    {[
                      "Il flusso WhatsApp automatico Campagna 2026",
                      "Il sistema di controllo documentale AI multi-lingua",
                      "Il confronto passo-passo con la tua gestione attuale",
                      "Setup demo personalizzata sui tuoi ettari o linee"
                    ].map((text, i) => (
                      <div key={i} className="flex items-center text-sm text-gray-700 font-bold">
                        <svg className="w-4 h-4 text-teal-600 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        {text}
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5 ml-1">Email Aziendale Certificata</label>
                    <input 
                      required type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="nome@azienda.it"
                      className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-gray-900 focus:ring-2 focus:ring-teal-500 outline-none transition-all shadow-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5 ml-1">Ragione Sociale (opzionale)</label>
                    <input 
                      type="text" value={company} onChange={e => setCompany(e.target.value)}
                      placeholder="Es: Azienda Agricola..." 
                      className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-sm outline-none shadow-sm font-medium" 
                    />
                  </div>
                  
                  {error && <p className="text-red-600 text-xs font-bold text-center mt-2">{error}</p>}
                  
                  <button 
                    disabled={loading}
                    className="w-full py-4.5 bg-teal-800 text-white rounded-xl font-black text-lg hover:bg-teal-900 transition-all shadow-2xl shadow-teal-900/20 active:scale-95 disabled:opacity-50 mt-4 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Generando report...
                      </>
                    ) : "Ricevi analisi Campagna 2026"}
                  </button>
                </form>
                
                <p className="text-[9px] text-gray-400 text-center mt-6 italic font-medium opacity-60">
                  Privacy Policy: I tuoi dati sono protetti e utilizzati esclusivamente per la finalità di consulenza operativa Campagna 2026.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;

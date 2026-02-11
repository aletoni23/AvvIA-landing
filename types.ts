
export enum TipoAzienda {
  AGRICOLA = 'Azienda Agricola',
  TRASFORMATORE = 'Trasformatore'
}

export enum FilieraTrasformatore {
  POMODORO = 'Pomodoro da Industria',
  CANTINA = 'Cantina Vinicola'
}

export enum Coltura {
  POMODORO = 'Pomodoro da industria',
  VIGNETO = 'Vigneto',
  OLIVO = 'Olivo'
}

export enum Terreno {
  PIANURA = 'Pianura',
  COLLINA = 'Collina (acclivi)',
  TERRAZZAMENTI = 'Terrazzamenti'
}

export interface CalculatorInputs {
  tipoAzienda: TipoAzienda;
  filieraTrasformatore?: FilieraTrasformatore;
  coltura: Coltura;
  ettari: number;
  tonnellate: number;
  linee: number;
  turni: number;
  dataAvvio: string;
  durataSettimane: number;
  terreno: Terreno;
  percPermesso: number;
  // Advanced hidden inputs
  costoOperaio: number;
  costoHR: number;
  giorniSettimana: number;
  oreGiorno: number;
}

export interface CalculatorResults {
  oreTotali: number;
  numeroStagionali: number;
  costoManodopera: number;
  oreHRTradizionale: number;
  oreHRAvvIA: number;
  risparmioOre: number;
  giorniOnboardingTradizionale: [number, number];
  giorniOnboardingAvvIA: [number, number];
}

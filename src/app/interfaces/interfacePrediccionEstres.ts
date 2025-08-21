export interface AtributosEntrada {
  EMG: number;
  ECG: number;
  RESP: number;
  TEMP: number;
  EDA: number;
}

export interface ResultadoPrediccion {
  estado: string;
}

export interface AtributosEntradaAnsiedd {
  ecg: number;
  gsr: number; //eda
  skt: number; //temp
  resp: number;
}

export interface ResultadoPrediccionAnsiedad {
  estado: string;
}


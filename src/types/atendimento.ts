export interface Atendimento {
  id: string;
  timestamp: Date;
  certificadoEmitido: boolean;
  
  // Se certificado emitido
  paraQuem?: 'parceiro' | 'dimas' | 'outros';
  quemOutros?: string;
  tipoOutros?: 'agr_indisponivel' | 'emissao_interna' | 'cliente_final';
  
  // Se certificado não emitido
  motivoNaoEmitido?: 'desistencia' | 'match_biometrico';
  
  // Campos comuns
  dificuldades: boolean;
  justificativaDificuldades?: string;
  emissaoDiaSeguinte: boolean;
  quantidadeProximoDia?: number;
}

export interface ResumoAtendimentos {
  emissoesParceiros: number;
  emissoesDimas: number;
  emissoesOutros: number;
  desistencias: number;
  matchBiometrico: number;
  totalEmissoes: number;
  dificuldades: string[];
  emissoesProximoDia: number;
}

export interface Plano {
  codigo: "START" | "BUILD" | "SCALE" | "RECOVERY"
  nome: string
  setup_valor: number
  mensal_valor?: number
}

export interface DiagnosticoResultadoResponse {
  plano: Plano
  justificativa: string
  next_action: "pagamento"
}

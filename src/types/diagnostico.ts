export type DiagnosticoStatus = "em_andamento" | "finalizado"

export interface DiagnosticoStartResponse {
  diagnostico_id: string
  current_step: number
  total_steps: number
}

export interface DiagnosticoStepRequest {
  step: number
  resposta: Record<string, any>
}

export interface DiagnosticoStepResponse {
  status: DiagnosticoStatus
  current_step: number
  next_step: string
}

export interface DiagnosticoStatusResponse {
  status: DiagnosticoStatus
  current_step: number
  total_steps: number
}

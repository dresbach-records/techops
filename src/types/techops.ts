export type HealthStatus = "ok" | "warning" | "down"

export interface TechOpsResponse {
  api: HealthStatus
  db: HealthStatus
  ia: HealthStatus
  webhooks: HealthStatus
  ultimos_erros: number
}

export interface TechOpsErro {
  timestamp: string
  mensagem: string
}

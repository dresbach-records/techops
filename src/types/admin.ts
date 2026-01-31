export interface AdminDashboardResponse {
  clientes_ativos: number
  planos: Record<string, number>
  alertas: number
}

export interface AdminClienteItem {
  id: string
  nome: string
  email: string
  plano: string
  status: string
  risco: "baixo" | "medio" | "alto"
}

export interface AdminClienteDetalhe {
  id: string
  nome: string
  plano: string
  status: string
  modulos: string[]
  diagnostico: {
    finalizado: boolean
    resumo: string
  }
}

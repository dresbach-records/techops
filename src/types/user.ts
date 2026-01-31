export type UserRole = "admin" | "consultor" | "cliente"

export type UserStatus = "ativo" | "bloqueado" | "cancelado"

export type UserFlow = "diagnostico" | "pagamento" | "painel"

export interface UserMeResponse {
  id: string
  nome: string
  email: string
  role: UserRole
  status: UserStatus
  flow: UserFlow
}

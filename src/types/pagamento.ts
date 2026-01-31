export type MetodoPagamento = "pix" | "boleto" | "credito"

export type PagamentoStatus = "aguardando" | "confirmado" | "falhou"

export interface CriarPagamentoRequest {
  tipo: "setup" | "mensal"
  metodo: MetodoPagamento
}

export interface CriarPagamentoResponse {
  payment_id: string
  status: PagamentoStatus
  checkout_url: string
}

export interface PagamentoStatusResponse {
  status: PagamentoStatus
  plano_liberado: boolean
}

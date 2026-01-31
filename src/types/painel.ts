export type ModuloPainel =
  | "visao-geral"
  | "diagnostico"
  | "roadmap"
  | "arquitetura"
  | "tech-ops"
  | "ia"
  | "seguranca"
  | "consultoria"
  | "documentos"
  | "suporte";

export interface PainelResponse {
  plano: string
  status: "ativo" | "bloqueado"
  modulos: ModuloPainel[]
}

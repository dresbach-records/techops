export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
  flow: "diagnostico" | "pagamento" | "painel";
};

export type Plan = {
  codigo: "START" | "BUILD" | "SCALE" | "RECOVERY";
  nome: string;
  setup_valor: number;
  mensal_valor: number;
};

export type DiagnosticResult = {
  plano: Plan;
  justificativa: string;
  next_action: string;
};

export type PaymentCreationResponse = {
  payment_id: string;
  status: 'aguardando' | 'confirmado' | 'falhou';
  checkout_url: string;
};

export type DashboardOverviewCard = {
  title: string;
  value: string;
  description?: string;
  icon: string;
};

export type DashboardNextStep = {
  title: string;
  description: string;
  status: string;
};

export type DashboardProjectDocument = {
    title: string;
    icon: string;
    link: string;
}

export type DashboardData = {
  welcomeMessage: string;
  welcomeSubtext: string;
  overviewCards: DashboardOverviewCard[];
  nextSteps: DashboardNextStep[];
  projectDocuments: DashboardProjectDocument[];
  modules: string[];
};

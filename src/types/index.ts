export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
  isPaid: boolean;
  payment_pending_boleto?: boolean;
  plan?: 'START' | 'BUILD' | 'SCALE' | 'RECOVERY';
};

export type Plan = {
  key: 'START' | 'BUILD' | 'SCALE' | 'RECOVERY';
  name: string;
  description: string;
  setupFee: number;
  monthlyFee: number;
  minMonths: number;
  features: string[];
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

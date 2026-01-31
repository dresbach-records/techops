export type AppUser = {
  id: string;
  name: string;
  email: string;
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

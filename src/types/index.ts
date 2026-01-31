export type AppUser = {
  id: string;
  name: string;
  email: string;
  isPaid: boolean;
  payment_pending_boleto?: boolean;
};

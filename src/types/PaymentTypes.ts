export type PaymentTypes =
  | "cheque"
  | "UPI"
  | "cash"
  | "bankTransfer";

export const PAYMENT_TYPES_ARRAY = [
  "cheque",
  "UPI",
  "cash",
  "bankTransfer",
] as const;

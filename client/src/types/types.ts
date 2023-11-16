export type TUser = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  accessToken?: string;
  linkedBanks?: {};
  next_cursor?: string;
  transactions?: [];
  transactionsCategorized?: [];
  categories?: string[];
};

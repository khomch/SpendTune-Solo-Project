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

export type TTransaction = {
  id: string;
  name: string;
  logo_url: string | null;
  amount: number;
  currency: string;
  date: string;
  categories: string[];
  payment_channel: string;
  user_category: string;
};

export type TTokenStore = {
  expiration: string;
  link_token: string;
  request_id: string;
};


export type AuthProps = {
  children?: any //TODO change this any
  tokenStore: TTokenStore | null;
  setTokenStore: Function;
};

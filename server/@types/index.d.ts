import { Document } from "mongoose";
import { Transaction } from "plaid";

export interface TUser extends Document {
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  accessToken?: string,
  linkedBanks?: string[],
  next_cursor?: string,
  transactions?: TTransaction[],
  transactionsCategorized?: TTransaction[],
  categories?: string[]
}

/* 
export type TTransaction  = {
  id: string,
  name: string,
  logo_url: string,
  amount: number,
  currency: string,
  date: string,
  categories: string[],
  payment_channel: string
}
 */

interface TTransaction extends Transaction {
  id: transaction.transaction_id,
  name: transaction.name,
  logo_url: transaction.logo_url,
  amount: transaction.amount,
  currency: transaction.iso_currency_code,
  date: transaction.authorized_date,
  user_category? : string[],
  categories: transaction.category,
  payment_channel: transaction.payment_channel,
}




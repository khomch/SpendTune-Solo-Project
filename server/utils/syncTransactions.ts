import { Transaction } from 'plaid';
import { TTransaction, TUser } from '../@types';
import apiClient from '../API/plaidClient';

export default async function syncTransactions(user: TUser) {
  console.log('user.accessToken: ', user.accessToken);
  console.log('user.next_cursor: ', user.next_cursor);
  let response = await apiClient.transactionsSync({
    access_token: user.accessToken || '',
    cursor: user.next_cursor || '',
  });
  console.log('response: ', response);
  
  if (response.data.next_cursor) {
    user.next_cursor = response.data.next_cursor;
    await user.save();
  }

  console.log('response.data.added.length: ', response.data.added.length);
  if (!response.data.added.length) return;

  const transactions = response.data.added;
  const spendings = transactions.filter(
    (transaction) => transaction.amount > 0
  );
  const newEntries = spendings.map((transaction) =>
    parseTransactionToType(transaction)
  );

  const prevTransactions = user.transactions ? user.transactions : [];
  user.transactions = [...prevTransactions, ...newEntries];
  // @ts-ignore
  const updatedUser = await user.save({ new: true });
  return updatedUser;
}

function parseTransactionToType(transaction: Transaction): TTransaction {
  return {
    ...transaction,
    id: transaction.transaction_id,
    name: transaction.name,
    logo_url: transaction.logo_url,
    amount: transaction.amount,
    currency: transaction.iso_currency_code,
    date: transaction.date,
    categories: transaction.category,
    payment_channel: transaction.payment_channel,
  };
}

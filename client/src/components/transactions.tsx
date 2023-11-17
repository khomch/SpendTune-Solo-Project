import { useCombinedStore } from '../Store';
import { TTransaction } from '../types/types';
import Transaction from './transaction';

function Transactions() {
  const loggedUser = useCombinedStore((state) => state.logged);
  const transactions = loggedUser?.transactions;
  const transactionsCategorized = loggedUser?.transactionsCategorized;

  return loggedUser && transactions ? (
    <div className="transactions">
      {loggedUser.linkedBanks && (
        <h3 className="user-prompt">
          Please sync your bank to get transactions
        </h3>
      )}
      {loggedUser.linkedBanks && !transactions.length && (
        <h3 className="user-prompt">Sync transactions to start</h3>
      )}
      {transactions.length > 0 && <h2>Transactions to categorize</h2>}
      <div className="transactions-list">
        {transactions.length > 0 &&
          transactions.map((transaction: TTransaction) => {
            return (
              <div key={transaction.id}>
                <Transaction transaction={transaction} />
              </div>
            );
          })}
      </div>
      {transactions.length === 0 &&
        transactionsCategorized &&
        transactionsCategorized.length > 0 && (
          <h2>No more transactions to categorize</h2>
        )}
    </div>
  ) : (
    <p>Data has not been loaded</p>
  );
}

export default Transactions;

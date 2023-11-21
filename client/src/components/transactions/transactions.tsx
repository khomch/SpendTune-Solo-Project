import { useCombinedStore } from '../../Store';
import { TTransaction } from '../../types/types';
import Transaction from '../transaction/transaction';
import './transactions.css';

function Transactions() {
  const loggedUser = useCombinedStore((state) => state.logged);
  const transactions = loggedUser?.transactions;
  const transactionsCategorized = loggedUser?.transactionsCategorized;

  return loggedUser && transactions ? (
    <div className='transactions'>
      {loggedUser.linkedBanks && (
        <>
          {!transactions.length ? (
            <h3 className='transactions__prompt'>Sync transactions to start</h3>
          ) : (
            <>
              <div className='transactions__head'>
                <h2 className='transactions__title'>Uncategorised Payments</h2>
                <h3 className='transactions__prompt'>
                  Sync your bank to get new transactions
                </h3>
              </div>
              <table className='transactions__table'>
                <thead>
                  <tr className='transactions__header-row'>
                    <th className='transactions__header'>Date</th>
                    <th className='transactions__header'>Amount</th>
                    <th className='transactions__header'>Payment Channel</th>
                    <th className='transactions__header'>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction: TTransaction) => (
                    <Transaction
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))}
                </tbody>
              </table>
            </>
          )}
          {!transactions.length &&
            transactionsCategorized &&
            transactionsCategorized.length && (
              <h2 className='transactions__title'>
                No more transactions to categorize
              </h2>
            )}
        </>
      )}
    </div>
  ) : (
    <p>Data has not been loaded</p>
  );
}

export default Transactions;

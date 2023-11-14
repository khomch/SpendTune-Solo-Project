import { useCombinedStore } from "../Store";
import Transaction from "./transaction";

function Transactions() {

  const loggedUser = useCombinedStore(state => state.logged);
  const transactions = loggedUser.transactions;
  const transactionsCategorized = loggedUser.transactionsCategorized;

  return (
    <div className="transactions">
      {
        !loggedUser.linkedBanks &&
        <h3 className="user-prompt">Please sync your bank to get transactions</h3>
      }
      {
        loggedUser.linkedBanks &&
        !transactions.length &&
        <h3 className="user-prompt">Sync transactions to start</h3>
      }
      {
        transactions.length > 0 &&
        <h2>Transactions to categorize</h2>
      }
      { transactions.length > 0 &&
        transactions.map(transaction => {
          return (
            <div key={transaction.id} >
              <Transaction transaction={transaction} />
            </div>
          )
        })
      }
      { transactions.length == 0 &&
        transactionsCategorized.length > 0 &&
        <p>No more transactions to categorize</p>}
    </div>
  )
}

export default Transactions;
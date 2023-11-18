import { useState } from 'react';
import { useCombinedStore } from '../Store';
import { assignCategory } from '../apiService';
import { TTransaction } from '../types/types';

type TransactionProps = {
  transaction: TTransaction;
};

function Transaction(props: TransactionProps) {
  const { transaction } = props;
  const [selectedCategory, setSelectedCategory] = useState('');
  const loggedUser = useCombinedStore((state) => state.logged);
  const token = useCombinedStore((state) => state.token);
  const setLoggedUser = useCombinedStore((state) => state.setLoggedUser);

  async function handleCategoryAssign() {
    if (selectedCategory === '') {
      console.log('Please choose category');
      return;
    }
    if (token) {
      const assignCategoryData = {
        category: selectedCategory,
        id: transaction.id,
        token: token,
      };
      const updatedUser = await assignCategory(assignCategoryData);
      setLoggedUser({ user: updatedUser, token });
    }
  }

  return (
    <div className="transaction">
      <div className="row">
        {transaction.logo_url && (
          <img className="logo" src={transaction.logo_url} alt="logo" />
        )}
        {!transaction.logo_url && (
          <img className="no-logo" src="/No_image_available.svg" alt="logo" />
        )}
      </div>
      <div className="row">
        <div className="transac-details">
          <p>
            Name: <span className="bold">{transaction.name}</span>
          </p>
          <p>
            Date: <span className="bold">{transaction.date}</span>
          </p>
          <p>
            Amount:{' '}
            <span className="bold">
              {transaction.amount + ' ' + transaction.currency}
            </span>
          </p>
          <p>
            Payment Channel:{' '}
            <span className="bold">{transaction.payment_channel}</span>
          </p>
        </div>
      </div>
      <div className="row">
        <div className="transac-category">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Please choose category</option>
            {loggedUser &&
              loggedUser.categories &&
              loggedUser.categories.map((category) => {
                return (
                  <option key={category} value={category}>
                    {category}
                  </option>
                );
              })}
          </select>
          <button className="btn btn--short" onClick={handleCategoryAssign}>
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}

export default Transaction;

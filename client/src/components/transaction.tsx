import { useState } from 'react';
import { useCombinedStore } from '../Store';
import { assignCategory } from '../apiService';
import { TTransaction } from '../types/types';
import './transaction.css';


type TransactionProps = {
  transaction: TTransaction;
};

function Transaction(props: TransactionProps) {
  const { transaction } = props;
  const [selectedCategory, setSelectedCategory] = useState('');
  const loggedUser = useCombinedStore((state) => state.logged);
  const token = useCombinedStore((state) => state.token);
  const setLoggedUser = useCombinedStore((state) => state.setLoggedUser);
  const setAuthToken = useCombinedStore((state) => state.setAuthToken);

  async function handleCategoryAssign(e:React.ChangeEvent<HTMLSelectElement>) {
    console.log('e.target.value :>> ', e.target.value);
    if (e.target.value === '') {
      console.log('Please choose category');
      return;
    }
    setSelectedCategory(e.target.value);
    if (token) {
      const assignCategoryData = {
        category: selectedCategory,
        id: transaction.id,
        token: token,
      };
      const updatedUser = await assignCategory(assignCategoryData);
      setLoggedUser(updatedUser);
      setAuthToken(token);
    }
  }

  return (
    <tr className='transaction__row'>
      <td className='transaction__td transaction__date'>{transaction.date}</td>
      <td className='transaction__td transaction__details'>
        {transaction.logo_url ? (
          <img
            className='transaction__logo'
            src={transaction.logo_url}
            alt='logo'
          />
        ) : (
          <img
            className='transaction__logo'
            src='/No_image_available.svg'
            alt='No logo found'
          />
        )}
        <div className='transaction__amount'>
          <p className='transaction__name'>{transaction.name}</p>
          <p className='transaction__value'>
            {transaction.amount} {transaction.currency}
          </p>
        </div>
      </td>
      <td className='transaction__td transaction__channel'>{transaction.payment_channel}</td>
      <td className='transaction__td transaction__category'>
        <select
          value={selectedCategory}
          onChange={handleCategoryAssign}
          className='transaction__dropdown'
        >
          <option value=''>Uncategorised</option>
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
      </td>
    </tr>
  );
}

export default Transaction;

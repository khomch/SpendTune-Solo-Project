import { useState } from "react";
import { useCombinedStore } from "../Store";
import { assignCategory } from "../apiService";

function Transaction({transaction}) {

  const loggedUser = useCombinedStore(state => state.logged);
  const setLoggedUser = useCombinedStore(state => state.setLoggedUser);

  const [selectedCategory, setSelectedCategory] = useState('');

  async function handleCategoryAssign() {
    if (selectedCategory === '') {
      console.log('Please choose category');
      return;
    }
    const updatedUser = await assignCategory(selectedCategory, transaction.id);
    setLoggedUser(updatedUser);
  }

    return (
        <>
          <div className="transac_logo">
            <img src={transaction.logo_url} alt={transaction.name} />
          </div>
          <div className="transac_details">
            <p>Name: {transaction.name}</p>
            <p>Date: {transaction.date}</p>
            <p>Amount: {transaction.amount + ' ' + transaction.currency }</p>
            <p>Payment Channel: {transaction.payment_channel}</p>
          </div>
          <div className="transac_category">
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} >
              <option value=''>Please choose category</option>
            { loggedUser.categories.map(category => {
              return (
                <option key={category} value={category}>{category}</option>
              )
            })}
            </select>
            <button onClick={handleCategoryAssign}>Assign</button>
          </div>

        </>
    );
}

export default Transaction;
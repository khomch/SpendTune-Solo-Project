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
        <div className="transaction">
          <div className="row">
              { transaction.logo_url &&
                <img className="logo" src={transaction.logo_url} alt="logo" />
              }
              { !transaction.logo_url &&
                <img className="no-logo" src="/No_image_available.svg" alt="logo" />
              }
          </div>
          <div className="row">
            <div className="transac-details">
              <p>Name: <span className="bold">{transaction.name}</span></p>
              <p>Date: <span className="bold">{transaction.date}</span></p>
              <p>Amount: <span className="bold">{transaction.amount + ' ' + transaction.currency }</span></p>
              <p>Payment Channel: <span className="bold">{transaction.payment_channel}</span></p>
            </div>
          </div>
          <div className="row">
            <div className="transac-category">
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} >
                <option value=''>Please choose category</option>
              { loggedUser.categories.map(category => {
                return (
                  <option key={category} value={category}>{category}</option>
                  )
                })}
              </select>
              <button className="assign-btn" onClick={handleCategoryAssign}>Assign</button>
            </div>
          </div>

        </div>
    );
}

export default Transaction;
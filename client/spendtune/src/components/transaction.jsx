import { useState } from "react";
import { useCombinedStore } from "../Store";

function Transaction({transaction}) {

  const loggedUser = useCombinedStore(state => state.logged);

  const [selectedCategory, setSelectedCategory] = useState('--ASSIGN CATEGORY--');

  function handleCategorySubmit() {

  }

    return (
        <>
          <div className="transac_logo">
            <img src={transaction.logo_url} alt={transaction.name} />
          </div>
          <div className="transac_details">
            <p>Name: {transaction.name}</p>
            <p>Date: {transaction.date}</p>
            <p>Amount: {transaction.amount}</p>
            <p>Payment Channel: {transaction.payment_channel}</p>
          </div>
          <div className="transac_category">
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} />
            { loggedUser.categories.map(category => {
              return (
                <option key={category} value={category}>{category}</option>
              )
            })}
            <button onClick={handleCategorySubmit}>Assign</button>
          </div>

        </>
    );
}

export default Transaction;
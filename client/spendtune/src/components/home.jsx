import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLinkToken, syncTransactions } from '../plaidService';
import { addCategory } from '../apiService';
import { useCombinedStore } from '../Store';
import Transactions from './transactions';
import Chart from './chart';

function Home(props) {
  // global states
  const loggedUser = useCombinedStore(state => state.logged);
  const setLoggedUser = useCombinedStore(state => state.setLoggedUser);
  // local states
  const [addCategoryClicked, setAddCategoryClicked] = useState(false);
  const [categoryInput, setCategoryInput] = useState('');

  const navigate = useNavigate();

  console.log(loggedUser.categories)

  async function handleSync() {
    const linkToken = await getLinkToken();
    props.setTokenStore(linkToken);
    navigate('/sync');
  }

  async function handleTransactions() {
    const updatedUser = await syncTransactions();
    if (typeof updatedUser === 'string') {
      console.log(updatedUser);
      return;
    }
    setLoggedUser(updatedUser);
    console.log('Plaid API - Transactions synced');
  }

  function handleCatClicked() {
    setAddCategoryClicked(addCategoryClicked => !addCategoryClicked);
  }
  //TODO - make check for category name case insensitive
  async function handleAddCategory() {
    if (loggedUser.categories.length &&
        loggedUser.categories.includes(categoryInput)) {
      console.log('Category already exists');
      return
    } else {
      const updatedUser = await addCategory({category: categoryInput});
      setLoggedUser(updatedUser);
      setAddCategoryClicked(false);
      setCategoryInput('');
    }
  }

  return (
    <div className="home">
      <h1>Dashboard</h1>
      <p>
        Hello {loggedUser.firstName} {loggedUser.lastName}
      </p>
      { !loggedUser.linkedBanks &&
        <p>No banks synced</p>
      }
      <button onClick={handleSync}>Sync bank</button>
      { loggedUser.linkedBanks &&
        <button onClick={handleTransactions}>Sync transactions</button>
      }
      <button onClick={handleCatClicked}>Add category</button>
      { addCategoryClicked &&
        <div className="add_cat">
          <input
            type="text"
            placeholder="Category name"
            value={categoryInput}
            onChange={e => setCategoryInput(e.target.value)}
          />
          <button onClick={handleAddCategory}>Add</button>
        </div>
      }
      <Chart />
      <Transactions />
    </div>
  )
}

export default Home;
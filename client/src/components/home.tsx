import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCombinedStore } from '../Store';
import { addCategory } from '../apiService';
import { getLinkToken, syncTransactions } from '../plaidService';
import { TTokenStore } from '../types/types';
import Chart from './chart';
import Transactions from './transactions';

type HomeProps = {
  tokenStore: TTokenStore | null;
  setTokenStore: Function;
};

function Home(props: HomeProps) {
  // global states
  const loggedUser = useCombinedStore((state) => state.logged);
  const authToken = useCombinedStore((state) => state.token);
  const setLoggedUser = useCombinedStore((state) => state.setLoggedUser);
  // local states
  const [addCategoryClicked, setAddCategoryClicked] = useState(false);
  const [categoryInput, setCategoryInput] = useState('');

  const navigate = useNavigate();

  async function handleSync() {
    const linkToken = authToken && (await getLinkToken(authToken));
    props.setTokenStore(linkToken);
    navigate('/sync');
  }

  async function handleSyncTransactions() {
    const updatedUser = authToken && (await syncTransactions(authToken));
    if (updatedUser && updatedUser._id) {
      setLoggedUser(updatedUser);
      console.log('Plaid API - Transactions synced');
      return;
    }
    console.log('Issue while syncing transactions -->', updatedUser);
    return;
  }

  function handleCatClicked() {
    setAddCategoryClicked((addCategoryClicked) => !addCategoryClicked);
  }

  async function handleAddCategory() {
    if (
      loggedUser &&
      loggedUser.categories &&
      loggedUser.categories.includes(categoryInput)
    ) {
      console.log('Category already exists');
      return;
    } else if (categoryInput.length < 3) {
      console.log('Category name must be at least 3 characters');
      return;
    } else {
      const updatedUser =
        authToken &&
        (await addCategory({
          category: categoryInput.toLowerCase(),
          token: authToken,
        }));
      setLoggedUser(updatedUser);
      setAddCategoryClicked(false);
      setCategoryInput('');
    }
  }
  return loggedUser ? (
    <div className="dashboard">
      <div className="home">
        <h2>Dashboard</h2>
        <p className="greeting">
          Hello {loggedUser.firstName} {loggedUser.lastName}
        </p>
        <button onClick={handleSync}>
          {loggedUser.linkedBanks ? 'Sync another bank' : 'Sync bank'}
        </button>
        {loggedUser.linkedBanks && (
          <button onClick={handleSyncTransactions}>Sync transactions</button>
        )}
        {loggedUser.transactions && (
          <button className="add-cat-btn" onClick={handleCatClicked}>
            Add category
          </button>
        )}
        {addCategoryClicked && (
          <div className="add-cat">
            <input
              type="text"
              placeholder="your category name"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
            />
            <button className="add-btn" onClick={handleAddCategory}>
              Add
            </button>
          </div>
        )}
        {loggedUser.transactions &&
          loggedUser.categories &&
          !addCategoryClicked && (
            <h3 className="user-prompt">Add category to start</h3>
          )}
      </div>
      <Chart />
      <div>
        {loggedUser.transactions && loggedUser.transactions?.length > 0 && (
          <Transactions />
        )}
      </div>
    </div>
  ) : (
    <p>Please log-in to see the Dashboard</p>
  );
}

export default Home;

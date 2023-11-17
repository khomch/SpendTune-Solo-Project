import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLinkToken, syncTransactions } from '../plaidService';
import { addCategory } from '../apiService';
import { useCombinedStore } from '../Store';
import Transactions from './transactions';
import Chart from './chart';
import { TTokenStore } from '../types/types';

type HomeProps = {
  tokenStore: TTokenStore | null;
  setTokenStore: Function;
};

function Home(props: HomeProps) {
  // global states
  const loggedUser = useCombinedStore((state) => state.logged);
  const token = useCombinedStore((state) => state.token);
  const setLoggedUser = useCombinedStore((state) => state.setLoggedUser);
  console.log('loggedUser: ', loggedUser);
  // local states
  const [addCategoryClicked, setAddCategoryClicked] = useState(false);
  const [categoryInput, setCategoryInput] = useState('');

  const navigate = useNavigate();

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
    token && setLoggedUser({ user: updatedUser, token: token });
    console.log('Plaid API - Transactions synced');
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
      console.log('token: ', token);
      const updatedUser =
        token &&
        (await addCategory({
          category: categoryInput.toLowerCase(),
          token,
        }));
      token && setLoggedUser({ user: updatedUser, token });
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
          <button onClick={handleTransactions}>Sync transactions</button>
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

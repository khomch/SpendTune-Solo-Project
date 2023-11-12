import { useNavigate } from 'react-router-dom';

import { getLinkToken, syncTransactions } from '../plaidService';
import { useCombinedStore } from '../Store';
import Transactions from './transactions';

function Home(props) {

  const loggedUser = useCombinedStore(state => state.logged);
  const setLoggedUser = useCombinedStore(state => state.setLoggedUser);

  const navigate = useNavigate();

  console.log(loggedUser)

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
    console.log(updatedUser.transactions);
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
      <button>Add category</button>
      <Transactions />
    </div>
  )
}

export default Home;
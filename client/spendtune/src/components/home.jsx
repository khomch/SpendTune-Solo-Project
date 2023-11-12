import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getLinkToken } from '../plaidService';
import { useCombinedStore } from '../Store';

function Home(props) {

  const storedLoggedUser = useCombinedStore(state => state.fetchLoggedUser);
  const loggedUser = useCombinedStore(state => state.logged);
  const linkedBanks = loggedUser ? loggedUser.linkedBanks : null;

  const navigate = useNavigate();

  useEffect(() => {
    async function checkLoggedUser() {
      await storedLoggedUser();
      if (!loggedUser) {
        navigate('/');
        return;
      }
    }
    checkLoggedUser();
  }, [])

  async function handleSync() {
    const linkToken = await getLinkToken();
    props.setTokenStore(linkToken);
    navigate('/sync');
  }

  return (
    <div className="home">
      <h1>Home</h1>
      <p>
        Hello
        {' ' + loggedUser.firstName + ' ' + loggedUser.lastName}
      </p>
      { !linkedBanks &&
        <p>No banks synced</p>
      }
      <button onClick={handleSync}>Sync your bank</button>

    </div>
  )
}

export default Home;
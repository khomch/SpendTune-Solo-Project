import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getLoggedUser } from '../apiService';
import { getLinkToken } from '../plaidService';

function Home(props) {

  const navigate = useNavigate();

  const [linkedAccounts, setLinkedAccounts] = useState({})

  useEffect( () => {
    async function checkLoggedUser() {
      const loggedUser = await getLoggedUser();
      props.setLogged(loggedUser);
      if (!loggedUser) {
        navigate('/');
      }
    }
    checkLoggedUser();
  }, [])

  const user = {}

  if (props.logged) {
    user.firstName = props.logged.firstName
    user.lastName = props.logged.lastName
  }

  async function handleSync() {
    const linkToken = await getLinkToken();
    console.log(linkToken)
  }

  return (
    <div className="home">
      <h1>Home</h1>
      <p>Hello
      { user.firstName + ' ' + user.lastName }
      </p>
      { Object.keys(linkedAccounts).length === 0 &&
      <p>No bank accounts synced</p>
      }
      <button onClick={handleSync}>Sync your bank account</button>

    </div>
  )
}

export default Home;
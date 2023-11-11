import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getLoggedUser } from '../apiService';
import { getLinkToken } from '../plaidService';

function Home(props) {

  const navigate = useNavigate();

  const [linkedBanks, setLinkedBanks] = useState({})

  useEffect( () => {
    async function checkLoggedUser() {
      const loggedUser = await getLoggedUser();
      props.setLogged(loggedUser);
      if (!loggedUser) {
        navigate('/');
      }
      // if ( Object.keys(linkedBanks).length !== 0 ) {
      //   const {...linkedBanks} = props.loggedUser.linkedBanks
      //   setLinkedBanks((prevState) => ({
      //     ...prevState,
      //     ...linkedBanks
      //   }))
      // }
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
    props.setTokenStore(linkToken);
    navigate('/sync');
  }

  return (
    <div className="home">
      <h1>Home</h1>
      <p>
        Hello
        {' ' + user.firstName + ' ' + user.lastName}
      </p>
      { Object.keys(linkedBanks).length === 0 &&
        <p>No banks synced</p>
      }
      <button onClick={handleSync}>Sync your bank</button>

    </div>
  )
}

export default Home;
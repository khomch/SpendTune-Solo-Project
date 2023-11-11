import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getLoggedUser } from '../apiService';
import { getLinkToken } from '../plaidService';

function Home(props) {

  const navigate = useNavigate();

  const [linkedBanks, setLinkedBanks] = useState({})

  useEffect(() => {
    async function checkLoggedUser() {
      // Get currently logged user from the server
      const loggedUser = await getLoggedUser();
      if (!loggedUser) {
        navigate('/');
        return;
      }
      // Save logged user retrieved from server in the dashboards component state
      props.setLogged(loggedUser);
    }
    checkLoggedUser();
    setLinkedBanks(props.logged ? props.logged.linkedBanks : {})
  }, [])

  // useEffect(() => {
  //   if (localStorage.length === 0) {
  //     console.log('if')
  //     localStorage.setItem('banks', JSON.stringify(linkedBanks));
  //   } else {
  //     console.log('else')
  //   }
  // }, []);

  // console.log(JSON.parse(localStorage.getItem('banks')))

  // const test = {
  //   bank1: "QyRJNx9dD7Tx7EQxo7GwTeMA6B51MLFpREoAp",
  //   bank2: "WVa66nx48WhEGaQem4kRU38pPwmdEXtlqK8pJ",
  //   bank3: "VEakyy5XoJuwA61xmwR3hVBEd7ggmEcWNe1Bp"
  // }
  // useEffect(() => {
  //   const localStorageData = JSON.parse(localStorage.getItem('banks'));
  //   if(localStorageData) {
  //       setLinkedBanks(localStorageData);
  //     }
  //   },[]);

  //   useEffect(() => {
  //       localStorage.setItem('banks', JSON.stringify(linkedBanks));
  //     },[linkedBanks]);


        // localStorage.setItem('banks', JSON.stringify(props.logged.linkedBanks))

        // console.log(JSON.parse(localStorage.getItem('banks')))

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
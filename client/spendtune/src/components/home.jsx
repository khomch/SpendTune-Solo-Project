import { useState, useEffect } from 'react';
import { getLoggedUser } from '../apiService';
import { useNavigate } from 'react-router-dom';

function Home(props) {

  const navigate = useNavigate();

  const [linkedAccounts, setLinkedAccounts] = useState({})

  useEffect( () => {
    async function checkLoggedUser() {
      const loggedUser = await getLoggedUser();
      props.setLogged(loggedUser);
    }
    checkLoggedUser();
  }, [])

  const user = {}

  if (props.logged) {
    user.firstName = props.logged.firstName
    user.lastName = props.logged.lastName
  }

  // TODO - handle bank account sync

  async function handleSync(event) {
    console.log('lets sync some shit')
  }

  async function handleGoToLogin(event) {
    navigate('/');
  }

  return (
    <div className="home">
      <h1>Home</h1>
      <p>Hello {
        user.firstName ?
        user.firstName + ' ' + user.lastName :
        'stranger' }
      </p>
      { Object.keys(linkedAccounts).length === 0 &&
      props.logged &&
      <p>No bank accounts synced</p>
      }
      { props.logged &&
      <button onClick={handleSync}>Sync your bank account</button>
      }
      { !props.logged &&
      <div>
      <p>Please go back to login page</p>
      <button onClick={handleGoToLogin}>go to login</button>
      </div>
      }
    </div>
  )
}

export default Home;
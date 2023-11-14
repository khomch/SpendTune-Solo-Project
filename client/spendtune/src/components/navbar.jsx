import { logout } from '../apiService';
import { useNavigate } from 'react-router-dom';
import { useCombinedStore } from '../Store';

function Navbar() {

  const loggedUser = useCombinedStore(state => state.logged);
  const setLoggedUser = useCombinedStore(state => state.setLoggedUser);
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    setLoggedUser(null);
    navigate('/');
  }

  return (
    <div className="navbar">
      {/* <h1>SpendTune</h1> */}
      <img src="/logo.svg" alt="" />
      { loggedUser &&
      <button onClick={handleLogout}>Logout</button>
      }
    </div>
  )
}

export default Navbar;
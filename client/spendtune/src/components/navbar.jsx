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
      <img src="/logo.svg" alt="spendtune logo" />
      { loggedUser &&
      <button className="logout-btn"onClick={handleLogout}>Logout</button>
      }
    </div>
  )
}

export default Navbar;
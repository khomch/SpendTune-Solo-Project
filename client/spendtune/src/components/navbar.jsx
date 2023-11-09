import { logout } from '../apiService';
import { useNavigate } from 'react-router-dom';

function Navbar(props) {

  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    props.setLogged(null);
    navigate('/');
  }

  return (
    <div className="navbar">
      <h1>SpendTune</h1>
      { props.logged &&
      <button onClick={handleLogout}>Logout</button>
      }
    </div>
  )
}

export default Navbar;
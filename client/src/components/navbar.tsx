import { logout } from '../apiService';
import { useNavigate } from 'react-router-dom';
import { useCombinedStore } from '../Store';
import './navbar.css';
import { getLinkToken, syncTransactions } from '../plaidService';
import { AuthProps } from '../types/types';




function Navbar({tokenStore, setTokenStore}:AuthProps) {
  const loggedUser = useCombinedStore((state) => state.logged);
  const authToken = useCombinedStore((state) => state.token);
  const setLoggedUser = useCombinedStore((state) => state.setLoggedUser);
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    setLoggedUser(null);
    navigate('/');
  }

  async function handleSync() {
    const linkToken = authToken && (await getLinkToken(authToken));
    setTokenStore(linkToken);
    navigate('/sync');
  }

  async function handleSyncTransactions() {
    const updatedUser = authToken && (await syncTransactions(authToken));
    if (updatedUser && updatedUser._id) {
      setLoggedUser(updatedUser);
      console.log('Plaid API - Transactions synced');
      return;
    }
    console.log('Issue while syncing transactions -->', updatedUser);
    return;
  }

  return (
    <div className='navbar'>
      <img className='navbar__img' src='/logo.svg' alt='Spendtune logo' />
      
      {loggedUser && (
        <p className='greeting'>
          Hello {loggedUser.firstName + loggedUser.lastName}
        </p>
      )}
      
      {loggedUser && (
        <button className='btn' onClick={handleSync}>
          {loggedUser.linkedBanks ? 'Sync another bank' : 'Sync bank'}
        </button>
      )}

      {loggedUser && loggedUser.linkedBanks && (
        <button className='btn' onClick={handleSyncTransactions}>
          Sync transactions
        </button>
      )}

      {loggedUser && (
        <button className='btn navbar__btn--small' onClick={handleLogout}>
          Logout
        </button>
      )}
    </div>
  );
}

export default Navbar;

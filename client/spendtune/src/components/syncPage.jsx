import { useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useNavigate } from 'react-router-dom';

import { exchangePublicToken } from '../plaidService';
import { useCombinedStore } from '../Store';

function SyncPage(props) {

  const setLoggedUser = useCombinedStore(state => state.setLoggedUser);

  const navigate = useNavigate();
  const linkToken = props.tokenStore.link_token;

  const { open } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token) => {
      const updatedUser = await exchangePublicToken(public_token)
      setLoggedUser(updatedUser);
      console.log('Plaid API - Link successful');
      navigate('/home');
    },
  });

  useEffect( () => {
    open()
  }, [open])

  return (
    <div className='sync'>
      <h3>Please wait for Plaid's widget to load.</h3>
      <div>
        <p>You can also use the button to load widget manually.</p>
        <button onClick={() => open()}>Load widget</button>
      </div>
    </div>
  );
}

export default SyncPage;
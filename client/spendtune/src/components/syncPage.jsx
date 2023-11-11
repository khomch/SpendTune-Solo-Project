import { useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useNavigate } from 'react-router-dom';

import { exchangePublicToken } from '../plaidService';

function SyncPage(props) {

  const navigate = useNavigate();
  const linkToken = props.tokenStore.link_token;

  const { open } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token) => {
      await exchangePublicToken(public_token)
      console.log('Plaid API - Link successful');
      navigate('/home');
    },
  });

  useEffect( () => {
    open()
  }, [open])

  return (
    <div>
      <h3>Please wait for Plaid's widget to load.</h3>
      <div>
        <p>You can also use the button to load widget manually.</p>
        <button onClick={() => open()}>Load widget</button>
      </div>
    </div>
  );
}

export default SyncPage;
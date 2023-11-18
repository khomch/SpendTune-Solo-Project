import { useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useNavigate } from 'react-router-dom';

import { exchangePublicToken } from '../plaidService';
import { useCombinedStore } from '../Store';
import { TTokenStore } from '../types/types';

type SyncPageProps = {
  tokenStore: TTokenStore | null;
};

function SyncPage(props: SyncPageProps) {
  const authToken = useCombinedStore((state) => state.token);
  const { tokenStore } = props;
  console.log('props: ', props);
  const setLoggedUser = useCombinedStore((state) => state.setLoggedUser);

  const navigate = useNavigate();
  const linkToken = tokenStore && tokenStore.link_token;
  console.log('linkToken: ', linkToken);

  const { open } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token) => {
      const updatedUser =
        authToken && (await exchangePublicToken(public_token, authToken));
      setLoggedUser(updatedUser);
      console.log('Plaid API - Link successful');
      navigate('/home');
    },
  });

  useEffect(() => {
    open();
  }, [open]);

  function goBack() {
    navigate('/home');
  }

  return (
    <div className="sync">
      <h3>Please wait for Plaid&aposs widget to load</h3>
      <p className="widget-prompt">
        You can also use the button to load widget manually.
      </p>
      <button onClick={() => open()}>Load widget</button>
      <button onClick={goBack}>Back</button>
    </div>
  );
}

export default SyncPage;

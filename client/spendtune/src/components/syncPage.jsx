import { useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';

function SyncPage(props) {

  const linkToken = props.tokenStore.link_token;
  console.log(linkToken)

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token, metadata) => {
      // send public_token to server
      console.log('Link successful. Public Token:', public_token);
    },
  });

  useEffect( () => {
    open()
  }, [open])

  // // Use the `open` and `ready` functions as needed in your component

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
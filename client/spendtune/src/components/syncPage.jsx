import React, { useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';

function SyncPage(props) {

  const linkToken = props.tokenStore;
  console.log(linkToken)

  // const { open, ready } = usePlaidLink({
  //   token: 'link-sandbox-620844ab-afee-4014-aeac-f30a52f98d52',
  //   onSuccess: (public_token, metadata) => {
  //     // send public_token to server
  //     console.log('Link successful. Public Token:', public_token);
  //   },
  // });

  // // Use the `open` and `ready` functions as needed in your component

  return (
    <h1>sync works</h1>
    // <div>
    //   <button onClick={() => open()}>Open Plaid Link</button>
    // </div>
  );
}

export default SyncPage;
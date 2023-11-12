const baseUrl = 'http://localhost:3001';

async function getLinkToken() {
  try {
    const getToken = await fetch(baseUrl + '/api/create_link_token')
    const linkToken = await getToken.json();
    return linkToken;
  } catch {
    console.log('Issue occured on Link Token request ');
  }
}

async function exchangePublicToken(token) {
  try {
    const response = await fetch(baseUrl + '/api/exchange_public_token', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token })
    })
    const updatedUser = await response.json();
    return updatedUser;
  } catch {
    console.log('Issue occured while sending Public Token to the server ');
  }
}

async function syncTransactions() {
  try {
    const response = await fetch(baseUrl + '/api/sync_transactions', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      }
    })
    const updatedUser = await response.json();
    return updatedUser;
  } catch {
    console.log('Issue occured while syncing transactions ');
  }
}

export { getLinkToken, exchangePublicToken, syncTransactions };
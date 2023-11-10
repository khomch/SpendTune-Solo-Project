const baseUrl = 'http://localhost:3001';

async function getLinkToken() {
  try {
    const getToken = await fetch(baseUrl + '/api/create_link_token')
    const linkToken = await getToken.json();
    return linkToken;
  } catch(error) {
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
      body: JSON.stringify({token})
    })
  } catch(error) {
    console.log('Issue occured while sending Public Token to the server ');
  }
}

export { getLinkToken, exchangePublicToken };
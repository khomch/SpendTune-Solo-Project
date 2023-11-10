const baseUrl = 'http://localhost:3001';

async function getLinkToken() {
  try {
    const getToken = await fetch(baseUrl + '/api/create_link_token')
    const linkToken = await getToken.json();
    return linkToken;
  } catch(error) {
    console.log('Issue occured on Link Token request ' + error);
  }
}

async function sendPublicToken(token) {
  console.log(typeof token + ' ' + token)
  try {
    await fetch(baseUrl + '/api/process_public_token', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(token)
    })
    // TODO add necessary logic
  } catch(error) {
    console.log('Issue occured while sending Public Token to the server ' + error);
  }
}

export { getLinkToken, sendPublicToken };
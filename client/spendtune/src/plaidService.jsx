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

export { getLinkToken };
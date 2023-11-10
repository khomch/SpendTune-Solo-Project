import { useNavigate } from "react-router-dom";

const baseUrl = 'http://localhost:3001';
// TODO navigate to sync page
async function getLinkToken() {
  try {
    const getToken = await fetch(baseUrl + '/api/create_link_token')
    const linkToken = await getToken.json();
  } catch(error) {
    console.log('Issue occured on Link Token request ' + error);
  }
}

export { getLinkToken };
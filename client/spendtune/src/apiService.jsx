
const baseUrl = 'http://localhost:3001';

async function logUser({ email, password }) {
  try {
    const userData = await fetch(baseUrl + '/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({email, password})
    })
    const user = await userData.json();
    return user;
  } catch (error) {
    console.log('We have a problem:' + error)
  }
}

export { logUser }
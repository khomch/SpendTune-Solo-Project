import { useState } from 'react';
import { logUser } from '../apiService'

function Login(props) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const login = { email, password };
    const user = await logUser(login);
    props.setLogged(user);
  }

  function handleEmail(event) {
    setEmail(event.target.value);
  }

  function handlePassword(event) {
    setPassword(event.target.value);
  }

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        <ul>
          <li>
            <label htmlFor="email">email: </label>
            <input type="email"
            name='email'
            value={email}
            onChange={handleEmail}
            />
          </li>
          <li>
            <label htmlFor="password">password: </label>
            <input type="password"
            name='password'
            value={password}
            onChange={handlePassword}
            />
          </li>
          <li>
            <button type="submit">login</button>
          </li>
        </ul>
      </form>
    </div>
  )
}

export default Login;
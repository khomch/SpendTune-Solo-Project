import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logUser } from '../apiService'

function Login(props) {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  async function handleSubmit(event) {
    event.preventDefault();
    const login = { email, password };
    const user = await logUser(login);
    setEmail('');
    setPassword('');
    if (!user.error) {
      props.setLogged(user);
      navigate('/home');
    }
  }

  // HANDLERS COULD BE REFACTORED INTO SINGLE UNIVERSAL HANDLER

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
            <button type="submit">Login</button>
          </li>
        </ul>
      </form>
      <p>Don't have an account yet?</p>
      <button onClick={() => navigate('/register')}>Register</button>
    </div>
  )
}

export default Login;
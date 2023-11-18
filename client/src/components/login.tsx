import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logUser } from '../apiService';
import { useCombinedStore } from '../Store';
import '../styles/sign-in.css'


function Login() {
  const setLogged = useCombinedStore((state) => state.setLoggedUser);
  const setAuthToken = useCombinedStore((state) => state.setAuthToken);

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const login = { email, password };
    const loginData = await logUser(login);
    setEmail('');
    setPassword('');
    if (!loginData.error) {
      setLogged(loginData.user);
      setAuthToken(loginData.token);
      navigate('/home');
    }
  }

  // HANDLERS COULD BE REFACTORED INTO SINGLE UNIVERSAL HANDLER

  function handleEmail(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function handlePassword(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  return (
    <div className="sign-in">
      <form onSubmit={handleSubmit}>
        <ul className='sign-in__fields'>
          <li>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleEmail}
              autoComplete="email"
              placeholder="email"
            />
          </li>
          <li>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handlePassword}
              autoComplete="current-password"
              placeholder="password"
            />
          </li>
        </ul>
        <button className='btn' type="submit">Login</button>
      </form>
      <h4>Don&apos;t have an account yet?</h4>
      <button className='btn' onClick={() => navigate('/register')}>Register</button>
    </div>
  );
}

export default Login;

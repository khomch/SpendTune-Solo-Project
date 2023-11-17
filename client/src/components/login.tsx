import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logUser } from '../apiService';
import { useCombinedStore } from '../Store';

function Login() {
  // const fetchLogged = useCombinedStore((state) => state.fetchLoggedUser);
  const setLogged = useCombinedStore((state) => state.setLoggedUser);

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const login = { email, password };
    const user = await logUser(login);
    setEmail('');
    setPassword('');
    if (!user.error) {
      // fetchLogged();
      setLogged(user);
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
    <div className="login">
      <form onSubmit={handleSubmit}>
        <ul>
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
        <button type="submit">Login</button>
      </form>
      <h4>Don&apos;t have an account yet?</h4>
      <button onClick={() => navigate('/register')}>Register</button>
    </div>
  );
}

export default Login;

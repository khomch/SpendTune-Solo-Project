import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { register } from '../apiService';
import { useCombinedStore } from '../Store';

function Register() {

  const setLogged = useCombinedStore(state => state.fetchLoggedUser);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const user = { email, password, firstName, lastName};
    const registeredUser = await register(user);
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    if ( !registeredUser.error ) {
        await setLogged();
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
  function handleFirstName(event) {
    setFirstName(event.target.value);
  }
  function handleLastName(event) {
    setLastName(event.target.value);
  }

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <ul>
          <li>
            <label htmlFor="email">email: </label>
            <input type="email" name='email' value={email} onChange={handleEmail} />
          </li>
          <li>
            <label htmlFor="password">password: </label>
            <input type="password" name='password' value={password} onChange={handlePassword} />
          </li>
          <li>
            <label htmlFor="firstName">first name: </label>
            <input type="text" name='firstName' value={firstName} onChange={handleFirstName} />
          </li>
          <li>
            <label htmlFor="lastName">last name: </label>
            <input type="text" name='lastName' value={lastName} onChange={handleLastName} />
          </li>
          <li>
            <button type="submit">Register</button>
          </li>
        </ul>
      </form>
    </div>
  )
}

export default Register;
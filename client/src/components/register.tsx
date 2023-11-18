import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { register } from '../apiService';
import { useCombinedStore } from '../Store';
import { TUser } from '../types/types';
import '../styles/sign-in.css'


function Register() {
  const setLogged = useCombinedStore((state) => state.setLoggedUser);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const user: TUser = { email, password, firstName, lastName };
    const registeredUser = await register(user);
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    if (!registeredUser.error) {
      setLogged(registeredUser);
      navigate('/home');
    }
  }

  function goBack() {
    navigate('/');
  }

  // HANDLERS COULD BE REFACTORED INTO SINGLE UNIVERSAL HANDLER

  function handleEmail(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }
  function handlePassword(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }
  function handleFirstName(event: React.ChangeEvent<HTMLInputElement>) {
    setFirstName(event.target.value);
  }
  function handleLastName(event: React.ChangeEvent<HTMLInputElement>) {
    setLastName(event.target.value);
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
              placeholder="email"
            />
          </li>
          <li>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handlePassword}
              placeholder="password"
            />
          </li>
          <li>
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleFirstName}
              placeholder="first name"
            />
          </li>
          <li>
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleLastName}
              placeholder="last name"
            />
          </li>
        </ul>
      </form>
      <button className='btn' type="submit" onClick={handleSubmit}>
        Register
      </button>
      <button className='btn' onClick={goBack}>Back</button>
    </div>
  );
}

export default Register;

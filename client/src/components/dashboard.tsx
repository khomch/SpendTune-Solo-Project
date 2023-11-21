import { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './login';
import Register from './register';
import Home from './home';
import SyncPage from './syncPage';
import { useCombinedStore } from '../Store';
import { TTokenStore } from '../types/types';
import Navbar from './navbar';

function Dashboard() {
  const [tokenStore, setTokenStore] = useState<TTokenStore | null>(null);
  const loggedUser = useCombinedStore((state) => state.logged);
  console.log('loggedUser: ', loggedUser);

  return (
    <>
      <Navbar tokenStore={tokenStore} setTokenStore={setTokenStore}></Navbar>
      <Routes>
        <Route
          path='/'
          element={
            loggedUser ? (
              <Home/>
            ) : (
              <Navigate replace to={'/login'} />
            )
          }
        />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route
          path='/home'
          element={
            loggedUser ? (
              <Home/>
            ) : (
              <Navigate replace to={'/'} />
            )
          }
        />
        <Route
          path='/sync'
          element={
            loggedUser ? (
              <SyncPage tokenStore={tokenStore} />
            ) : (
              <Navigate replace to={'/home'} />
            )
          }
        />
        <Route path='*' element={<Navigate replace to='/home' />} />
      </Routes>
    </>
  );
}

export default Dashboard;

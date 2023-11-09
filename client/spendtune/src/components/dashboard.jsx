import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Login from './login';
import Register from './register';
import Home
 from './home';
function Dashboard(props) {
  return (
    <div className="dashboard">
    <Routes>
      <Route
        path="/"
        element={<Login setLogged={props.setLogged}/>}
      />
      <Route
        path="/register"
        element={<Register setLogged={props.setLogged}/>}
      />
      <Route
        path="/home"
        element={<Home logged={props.logged} setLogged={props.setLogged}/>}
      />
    </Routes>
    </div>
  )
}

export default Dashboard;
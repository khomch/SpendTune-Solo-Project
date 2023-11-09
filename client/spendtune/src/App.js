import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './components/login';
import Register from './components/register';
import Dashboard  from './components/dashboard';

function App() {

  const [logged, setLogged] = useState(null);

  return (
    <div className="App">
        <h1>Spend Tune</h1>
        { logged === null &&
          <div>
              <Login setLogged={setLogged}/>
              <Register setLogged={setLogged}/>
          </div>
        }
        {
          logged !== null &&
          <Dashboard logged={logged} setLogged={setLogged}/>
        }
        <h1>Learning Router</h1>
        <Router>
          <Routes>
            <Route path="/login" exact component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/dashboard" component={Dashboard} />
          </Routes>
        </Router>
    </div>
  );
};

export default App;

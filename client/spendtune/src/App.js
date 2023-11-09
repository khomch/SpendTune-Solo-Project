import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Login from './components/login';
import Register from './components/register';
import Dashboard  from './components/dashboard';

function App() {

  const [logged, setLogged] = useState(null);

  return (
    <div className="App">
      <Router>
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
      </Router>
    </div>
  );
};

export default App;

import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Navbar from './components/navbar'
import Dashboard  from './components/dashboard';

function App() {

  const [logged, setLogged] = useState(null);

  return (
    <div className="App">
        <Router>
          <Navbar logged={logged} setLogged={setLogged}/>
          <Dashboard logged={logged} setLogged={setLogged}/>
        </Router>
    </div>
  );
};

export default App;

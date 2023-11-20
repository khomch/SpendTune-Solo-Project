import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/navbar';
import Dashboard from './components/dashboard';

function App() {
  return (
    <Router>
      <Dashboard />
    </Router>
  );
}

export default App;

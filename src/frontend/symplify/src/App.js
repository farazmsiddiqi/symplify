import './App.css';
import Login from './LoginComponent/Login.js';
import Register from './RegisterComponent/Register.js'
import Home from './HomeComponent/Home.js'
import Symptoms from './SymptomsComponent/Symptoms.js'


import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
    <div className="App">
      <header className="App-header">
      <nav>
          <ul>
            <li><Link  to="/">home</Link></li>
            <li><Link  to="/login">login</Link></li>
          </ul>
        </nav>
      </header>

      <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/" element={<Home/>}/>
          <Route path="/symptoms" element={<Symptoms/>}/>
        </Routes>

    </div>
    </BrowserRouter>
  );
}

export default App;

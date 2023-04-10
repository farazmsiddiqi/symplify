import './App.css';
import Login from './LoginComponent/Login.js';
import Register from './RegisterComponent/Register.js'
import Home from './HomeComponent/Home.js'
import Symptoms from './SymptomsComponent/Symptoms.js'
import SymptomDetail from './SymptomDetailComponent/SymptomDetail.js'

import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import { useEffect, useState } from "react";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  async function checkLoggedIn()  {
    try {
        const response = await fetch('http://127.0.0.1:5000/whoami', {
            method: 'GET',
            credentials: 'include'
        }
        )
        const user = await response.text();
        if (response.status >= 400 && response.status < 600) {
          throw new Error("Bad response from server");
      }
        setIsLoggedIn(true);
    }
    catch (error) {
        console.log(error);
    }
    }
    
    checkLoggedIn();

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
    <div className="App">
      <header className="App-header">
      <nav>
          <ul>
            <li><Link  to="/">home</Link></li>
            {isLoggedIn === false && (<li><Link  to="/login">login</Link></li>)}
            {isLoggedIn === true && (<li><Link  to="/symptoms" >symptoms</Link></li>)}
          </ul>
        </nav>
      </header>

      <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/" element={<Home/>}/>
          <Route path="/symptoms" element={<Symptoms/>}/>
          <Route path="/symptom/:id" element={<SymptomDetail/>}/>
        </Routes>

    </div>
    </BrowserRouter>
  );
}

export default App;

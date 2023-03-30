import React, {useState, useEffect} from 'react';
import './Login.css';
import { Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleLogin(event) {
    event.preventDefault();
    // perform login action with username and password
    console.log(`Logging in with username: ${username} and password: ${password}`);
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" value={username} onChange={handleUsernameChange} /><br/><br/>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" value={password} onChange={handlePasswordChange} /><br/><br/>
        <button type="submit">Login</button>
      </form>
      <br />
      <Link to="/register">Create an Account</Link>
    </div>
  );
}

export default Login;
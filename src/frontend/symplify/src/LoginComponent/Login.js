import React, {useState, useEffect} from 'react';
import './Login.css';
import { Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleLogin(event) {
    event.preventDefault();
    if (username == "" && password == "") {
      setErrorMessage("Missing fields: username, password")
    } else if (username == "") {
      setErrorMessage(`Missing field: username`);
    } else if (password == "") {
      setErrorMessage("Missing field: password")
    } else {
    // perform login action with username and password
    console.log(`Logging in with username: ${username} and password: ${password}`);
    // Check that user/password is not null

    const data = {
      username: username,
      password: password
    };

    fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            },
        credentials: 'include',
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.status >= 400 && response.status < 600) {
          throw new Error("Bad response from server");
        }
        console.log(response);
        // Account successfully made -> redirect
        window.open("/symptoms");
    })
    .catch(error => {
        console.error(error);
        setErrorMessage("Username or password is incorrect.");
    }); }
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
      { errorMessage &&
        <h3 className="error"> {errorMessage } </h3> }
      <br />
      <Link to="/register">Create an Account</Link>
    </div>
  );
}

export default Login;
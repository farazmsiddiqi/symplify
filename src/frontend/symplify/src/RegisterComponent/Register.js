import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Register.css';

/*TODO: 
Validate login info (require username, pass,email),
 make username unique, redirect upon success/failure,
Validate password when logging in and redirect (strong password)
Search bar for symptoms after logging in 
Search for symptoms // Check current symptoms (add/delete)
Updates - 
*/
function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [userCount, setUserCount] = useState();
  const [errorMessage, setErrorMessage] = useState("");

  // Removed since user_id no longer exists.
  // useEffect(() => {
  //   fetch('http://127.0.0.1:5000/user_count')
  //   .then(response => response.text())
  //   .then(data => {
  //   setUserCount(parseInt(data));
  //   });
  // }, []) 

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleCreateAccount(event) {
    event.preventDefault();
    if (username == "" && password == "") {
      setErrorMessage("Missing fields: username, password")
    } else if (username == "") {
      setErrorMessage(`Missing field: username`);
    } else if (password == "") {
      setErrorMessage("Missing field: password")
    } else {
    // Check username, email, password not null
    // send username, email, and password to flask backend
    // Define the data object to be sent in the POST request
    const data = {
    table: "User",
    username: username,
    email: email,
    password: password
  };

  // Make the POST request to the Flask backend
    fetch('http://127.0.0.1:5000/insert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.status >= 400 && response.status < 600) {
          throw new Error("Bad response from server");
        }
        console.log(response);
        // Account successfully made -> redirect
        window.open("/login", "_self");
    })
    .catch(error => {
        console.error(error);
        setErrorMessage("Username already exists. Please select a new username.");
    });
    //setUserCount(userCount+1);
  }
  }

  return (
    <div>
      <h2>Create an Account</h2>
      <form onSubmit={handleCreateAccount}>
        <label htmlFor="username">Username: &ensp;</label>
        <input type="text" id="username" name="username" value={username} onChange={handleUsernameChange} /><br/><br/>
        <label htmlFor="email">Email: &ensp;</label>
        <input type="email" id="email" name="email" value={email} onChange={handleEmailChange} /><br/><br/>
        <label htmlFor="password">Password: &ensp;</label>
        <input type="password" id="password" name="password" value={password} onChange={handlePasswordChange} /><br/><br/>
        { errorMessage &&
        <h3 className="error"> {errorMessage } </h3> }
        <button type="submit">Create Account</button>
      </form>
      <br />
      <Link to="/login">Back to Login</Link>
    </div>
  );
}

export default Register;
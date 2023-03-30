import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
  const [userCount, setUserCount] = useState();

  useEffect(() => {
    fetch('http://127.0.0.1:5000/user_count')
    .then(response => response.text())
    .then(data => {
    setUserCount(parseInt(data));
    });
  }, []) 

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
    // send username, email, and password to flask backend
    // Define the data object to be sent in the POST request
  const data = {
    table: "User",
    user_id: userCount + 1,
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
        console.log(response);
        // Account successfully made -> redirect
        window.open("/login");
    })
    .catch(error => {
        console.error(error);
    });
    setUserCount(userCount+1);
  }

  return (
    <div>
      <h2>Create an Account</h2>
      <form onSubmit={handleCreateAccount}>
        <label htmlFor="username">Username: </label>
        <input type="text" id="username" name="username" value={username} onChange={handleUsernameChange} /><br/><br/>
        <label htmlFor="email">Email: </label>
        <input type="email" id="email" name="email" value={email} onChange={handleEmailChange} /><br/><br/>
        <label htmlFor="password">Password: </label>
        <input type="password" id="password" name="password" value={password} onChange={handlePasswordChange} /><br/><br/>
        <button type="submit">Create Account</button>
      </form>
      <br />
      <Link to="/login">Back to Login</Link>
    </div>
  );
}

export default Register;
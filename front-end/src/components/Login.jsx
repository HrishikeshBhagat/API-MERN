import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate()
  useEffect(()=>{
    const auth = localStorage.getItem('user')
    if(auth){
        navigate('/')
    }
  },[])

  const handleLogin= async ()=>{
    console.log('logged in ',email,password)
    let result = await fetch('http://localhost:5000/login', {
        method:'post',
        body:JSON.stringify({email,password}),
        headers:{
            'Content-Type':'application/json'
        },
    })
    if (result.ok) {
        result = await result.json();
        console.log(result);
        if(result.auth){
          localStorage.setItem('user', JSON.stringify(result.user))
          localStorage.setItem('token', JSON.stringify(result.auth))
          navigate('/')
        }
    } else {
        const errorResponse = await result.json();
        setError(errorResponse.msg);
    }

  }


  return (
    <>
      <div className="Login">
          <div>
            <label htmlFor="username">Email:</label>
            <input
              className="inputBox"
              type="email"
              id="email"
              name="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password">Password:</label>
            <input
              className="inputBox"
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <p style={{color:'crimson'}}>{error && <div className="error">{error}</div>}</p>
          <button className="loginButton" type="button" onClick={handleLogin}>Login</button>
      </div>
    </>
  );
};

export default Login;

// const handleSubmit = (event) => {
//     event.preventDefault(); // Prevents default form submission behavior
//     // Do something with the username and password, like submitting to a login API
//     console.log("Username:", username);
//     console.log("Password:", password);
//     // You can add your logic to send the username and password to the server for authentication here
//   };


{/* <div className="Login">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              className="inputBox"
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password">Password:</label>
            <input
              className="inputBox"
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <button className="loginButton" type="submit">Login</button>
        </form>
      </div>  */}
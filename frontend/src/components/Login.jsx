import React, { useState } from "react";
import RoomIcon from "@mui/icons-material/Room";
import CancelIcon from "@mui/icons-material/Cancel";
import "./login.css";
import { useRef } from "react";

function Login({ setShowLogin , myStorage ,setCurrentUsername }) {
  const [error, setError] = useState(false);

  const nameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      let result = await fetch("http://localhost:8000/api/users/login", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "content-type": "application/json",
        },
      });

      result = await result.json();
      console.log(result);

      if (!result.username) {
        setError(true);
      }else{
        myStorage = localStorage.setItem("user",JSON.stringify(result));
        setCurrentUsername(result.username)
        setShowLogin(false)
      }

    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="loginContainer">
      <div className="logo">
        <RoomIcon />
        LamaPin
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" ref={nameRef} />
        <input type="password" placeholder="password" ref={passwordRef} />
        <button className="loginButton">Login</button>
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <CancelIcon className="loginCancel" onClick={() => setShowLogin(false)} />
    </div>
  );
}

export default Login;

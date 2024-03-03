import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import "./login.css"

const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    !isAuthenticated && (
    <div className="login-container">
        <img src="/speakbite_logo.png" alt="SpeakBites" className="logo"/>
        <button className="login-button" onClick={() => loginWithRedirect()}>Log In / Sign Up</button>
    </div>
    )
  );
};

export default LoginButton;
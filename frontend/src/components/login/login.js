import React from "react";
import "./login.css"
import {useAuth0} from "@auth0/auth0-react";

const Login = () => {
    const {logInWithRedirect, isAuthenticated} = useAuth0();
    // Component body
    return (
        !isAuthenticated && (
            <div className="login-container">
            <button className="login-button" onClick={() => logInWithRedirect()}>
            Login
            </button>
            </div>
        )
    );
}

export default Login;
import React from "react";
import { useState } from "react";
import "./login.css"

import ControlPanel from "../controlPanel/controlPanel";

function Login() {
    // State variables
    const [loggedIn, setLoggedIn] = useState(false);

    // Handler functions
    const handleLogin = () => {
        setLoggedIn(true);
    };

    const handleLogout = () => {
        setLoggedIn(false);
    };

    // Component body
    return (
        <div className="login-container">
            {!loggedIn ? (
                <button className="login-button" onClick={handleLogin}>Login</button>
            ) : (
                <ControlPanel handleLogout={handleLogout}/>
            )}
        </div>
    );
}

export default Login;
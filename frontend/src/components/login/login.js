import React from "react";
import "./login.css"

function Login({handleLogin}) {
    // Component body
    return (
        <div className="login-container">
            <button className="login-button" onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;
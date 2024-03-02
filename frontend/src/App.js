import React from "react";
import { useState } from "react";

import ControlPanel from "./components/controlPanel/controlPanel";
import Login from "./components/login/login";

function App() {
  // State variables
  const [loggedIn, setLoggedIn] = useState(false);

  // Handler functions
  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  return (
    <div>
      {!loggedIn ? (
          <Login handleLogin={handleLogin}/>
      ) : (
          <ControlPanel handleLogout={handleLogout}/>
      )}
    </div>
  );
}

export default App;

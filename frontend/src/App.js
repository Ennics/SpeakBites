import React from "react";
import { useState } from "react";

import ControlPanel from "./components/controlPanel/controlPanel";
import LoginButton from "./components/login/login";
import LogoutButton from "./components/logout/logout";

function App() {

  return (
    <div>
      <LoginButton />
      <LogoutButton />
      {/* {!loggedIn ? (
          <Login handleLogin={handleLogin}/>
      ) : (
          <ControlPanel handleLogout={handleLogout}/>
      )} */}
    </div>
  );
}

export default App;

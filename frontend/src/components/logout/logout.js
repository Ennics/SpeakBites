import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import ControlPanel from "../controlPanel/controlPanel";

const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth0();

  return (
    isAuthenticated && (
        <div> 
            <button onClick={() => logout({ returnTo: window.location.origin })}>
        Log Out
      </button>
      <ControlPanel/></div>
    )
    );
};

export default LogoutButton;
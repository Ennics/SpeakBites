import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import "./controlPanel.css"

const ControlPanel = () => {
  const { logout, isAuthenticated } = useAuth0();

  return (
    isAuthenticated && (
        <div className="control-panel-container">
            <button className="logout-button" onClick={() => logout({ returnTo: window.location.origin })}>
                Log Out
            </button>
        </div>
    )
    );
};

export default ControlPanel;
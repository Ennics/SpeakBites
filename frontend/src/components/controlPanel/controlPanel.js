import React from "react";
import "./controlPanel.css"

function ControlPanel({handleLogout}) {
    // Component body
    return (
        <div className="control-panel-container">
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default ControlPanel;
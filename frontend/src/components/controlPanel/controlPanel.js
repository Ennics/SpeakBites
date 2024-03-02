import React from "react";
import "./controlPanel.css";

function ControlPanel({ handleLogout }) {
    // Handler function for starting ordering
    const handleStartOrdering = () => {
        // Add logic to switch to the customer UI
        console.log("Start Ordering");
    };

    return (
        <div className="control-panel-container">
            <header className="control-panel-header">
                <h1>SpeakBites</h1>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </header>
            <div className="menu-management-panel">
                {/* Add menu management UI here */}
                <h2>Menu Management</h2>
                {/* Include fields for adding, editing, and deleting menu items */}
            </div>
            <div className="order-history-panel">
                {/* Add order history UI here */}
                <h2>Order History</h2>
                {/* Display list of previous orders */}
            </div>
            <div className="start-ordering-button">
                <button className="start-ordering-button" onClick={handleStartOrdering}>Start Ordering</button>
            </div>
        </div>
    );
}

export default ControlPanel;

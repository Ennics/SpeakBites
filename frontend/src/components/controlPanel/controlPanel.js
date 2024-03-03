import { useAuth0 } from "@auth0/auth0-react";
import React, { useState } from "react";
import "./controlPanel.css";

const ControlPanel = () => {
    const { logout, isAuthenticated } = useAuth0();
    const [transcript, setTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isOrdering, setIsOrdering] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [orderID, setOrderID] = useState(1);
    const [fulfilledOrders, setFulfilledOrders] = useState([]);
  
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  
    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
    };
  
    const startListening = () => {
      recognition.start();
      setIsListening(true);
      setIsOrdering(true);
    };
  
    const stopListening = () => {
      recognition.stop();
      setIsListening(false);
      setIsOrdering(false);
    
      // Send the transcript to the backend
      fetch('http://127.0.0.1:5000/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_message: transcript })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Handle the received data
        // Assuming the data structure is as expected
        const newOrder = {
          orderID: orderID,
          items: data.bot_response.orders
        };
        // Update state with the new order
        setOrders([...orders, newOrder]);
        setOrderID(orderID + 1); // Increment orderID
      })
      .catch(error => console.error('Error:', error));
    };
  
    const addItemToMenu = () => {
      const itemName = window.prompt("Enter item name:");
      if (!itemName) return; // Exit if item name is empty or user cancels
      let price;
      do {
        price = parseFloat(window.prompt("Enter item price:"));
      } while (isNaN(price)); // Keep prompting until valid price is entered
      const newItem = { itemName, price };
      setMenuItems([...menuItems, newItem]);
    };
  
    const removeItemFromMenu = (index) => {
      const updatedMenu = [...menuItems];
      updatedMenu.splice(index, 1);
      setMenuItems(updatedMenu);
    };
  
    const deleteOrder = (index) => {
      const updatedOrders = [...orders];
      updatedOrders.splice(index, 1);
      setOrders(updatedOrders);
    };
  
    const completeOrder = (index) => {
      const orderToComplete = orders[index];
      const updatedOrders = [...orders];
      updatedOrders.splice(index, 1);
      setOrders(updatedOrders);
      setFulfilledOrders([...fulfilledOrders, orderToComplete]);
    };

  return (
    isAuthenticated && (
      <div className="control-panel-container">
        <div className="nav-bar-container">
          <img src="/speakbite_logo.png" alt="SpeakBites" className="logo"/>
          <button className="logout-button" onClick={() => logout({ returnTo: window.location.origin })}>
            Log Out
          </button>
        </div>
        <div className="control-panel-body-container">
          <div className="control-panel-body-left">
            <h2>
                Orders
            </h2>
            <div className="orders-container">
                <div className="queued-order-container">
                    <h3>
                        Orders In Progress:
                    </h3>
                    {orders.map((order, index) => (
                        <div key={index} classNam="queued-order">
                            <img src="/red_trash_icon.png" alt="Remove" onClick={() => deleteOrder(index)} className="remove-icon"/>
                            <img src="/check_icon.png" alt="Complete" onClick={() => completeOrder(index)} className="check-icon"/>
                            <span>
                            Order ID: {order.orderID} -{" "}
                            {order.items.map((item, i) => (
                                <span key={i}>
                                {item.item_name} ({item.quantity}){order.items.length - 1 !== i && ", "}
                                </span>
                            ))}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="filled-orders-container">
                    <h3>
                        Completed Orders:
                    </h3>
                    {fulfilledOrders.map((order, index) => (
                        <div key={index}>
                            <p>
                            Order ID: {order.orderID} -{" "}
                            {order.items.map((item, i) => (
                                <span key={i}>
                                {item.item_name} ({item.quantity}){order.items.length - 1 !== i && ", "}
                                </span>
                            ))}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
          </div>
          <div className="control-panel-body-right">
            <div className="menu-list">
                Menu
                {menuItems.map((item, index) => (
                    <div key={index} className="menu-item">
                        <img src="/red_trash_icon.png" alt="Remove" onClick={() => removeItemFromMenu(index)} className="red-trash-icon"/>
                        <p className="item-price">${item.price.toFixed(2)}</p>
                        <p className="item-name">{item.itemName}</p>
                    </div>
                ))}
            </div>
            <button className="modify-menu-button" onClick={addItemToMenu}>
              Add Item
            </button>
            <button className="take-order-button" onClick={startListening} disabled={isListening}>
              Take Order
            </button>
            {isOrdering && (
              <div className="ordering-indicator">
                <p>
                    Menu
                </p>
                {menuItems.map((item, index) => (
                <div key={index} className="menu-item">
                    <p className="item-price">${item.price.toFixed(2)}</p>
                    <p className="item-name">{item.itemName}</p>
                </div>
                ))}
                Hello! What would you like to order today?
                <button className="stop-order-button" onClick={stopListening} disabled={!isListening}>
                  Stop Order
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default ControlPanel;

import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from "react";
import "./controlPanel.css";

const ControlPanel = () => {
    const { logout, isAuthenticated, user } = useAuth0();
    const [transcript, setTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isOrdering, setIsOrdering] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [orderID, setOrderID] = useState(1);
    const [fulfilledOrders, setFulfilledOrders] = useState([]);

    const fetchMenuItems = () => {
        fetch('/get-menu-items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: user.sub })
        })
        .then(response => response.json())
        .then(data => setMenuItems(data.menu_items))
        .catch(error => console.error('Error fetching menu items:', error));
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchMenuItems();
        }
      }, [isAuthenticated]);
  
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
    
      fetch('/order', {
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
        const newOrder = {
          orderID: orderID,
          items: data.bot_response.orders
        };
        setOrders([...orders, newOrder]);
        setOrderID(orderID + 1);
      })
      .catch(error => console.error('Error:', error));
    };
  
    const addItemToMenu = () => {
        const itemName = window.prompt("Enter item name:");
        if (!itemName) return;
        let price;
        do {
            price = parseFloat(window.prompt("Enter item price:"));
        } while (isNaN(price));
        const newItem = { itemName, price };
    
        fetch("/add-menu-items", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: "github|84345327", menu_item: newItem }),
        })
            .then(response => response.json())
            .then(data => {
                setMenuItems([...menuItems, newItem]);
            })
            .catch(error => console.error('Error adding menu item:', error));
    };
  
    const removeItemFromMenu = (index) => {
        const updatedMenu = [...menuItems];
        updatedMenu.splice(index, 1);
        setMenuItems(updatedMenu);
      
        fetch('/remove-menu-item', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            index,
            user_id: user.sub
          })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to remove item from menu');
          }
        })
        .catch(error => {
          console.error('Error removing item from menu:', error);
          setMenuItems([...menuItems]);
        });
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

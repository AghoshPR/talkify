import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ChatRooms.css";

const ChatRooms = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  // Mock data for UI presentation
  const roomName = "General Discussion"; // In real app, fetch from backend using `id`
  
  const mockMessages = [
    { id: 1, sender: "Alice", text: "Hey everyone! Welcome to the new room.", time: "10:00 AM", isMe: false },
    { id: 2, sender: "Bob", text: "Thanks! The new UI looks amazing.", time: "10:02 AM", isMe: false },
    { id: 3, sender: "You", text: "Glad you like it! Let's start chatting.", time: "10:05 AM", isMe: true },
    { id: 4, sender: "Charlie", text: "Has anyone checked the new features yet?", time: "10:06 AM", isMe: false },
  ];

  const mockUsers = ["Alice", "Bob", "Charlie", "You"];

  const handleExit = () => {
    navigate("/home");
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    // In real app, send message via websocket here
    setMessage("");
  };

  return (
    <div className="chat-container">
      {/* Sidebar for Online Users */}
      <aside className="chat-sidebar">
        <div className="sidebar-header">
          <h2>Talkify</h2>
        </div>
        
        <div className="users-list-container">
          <h3 className="users-title">Online Users ({mockUsers.length})</h3>
          <ul className="users-list">
            {mockUsers.map((user, index) => (
              <li key={index} className={`user-item ${user === "You" ? "current-user" : ""}`}>
                <div className="user-avatar">{user.charAt(0)}</div>
                <span className="user-name">{user}</span>
                <span className="status-dot"></span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="chat-main">
        <header className="chat-header">
          <div className="room-info">
            <h2 className="chat-room-name">{roomName}</h2>
            <span className="room-id">Room ID: {id || "123"}</span>
          </div>
          <button className="exit-btn" onClick={handleExit}>
            Exit Room
          </button>
        </header>

        <div className="messages-container">
          {mockMessages.map((msg) => (
            <div key={msg.id} className={`message-wrapper ${msg.isMe ? "message-mine" : "message-other"}`}>
              {!msg.isMe && <div className="message-avatar">{msg.sender.charAt(0)}</div>}
              <div className="message-content">
                {!msg.isMe && <span className="message-sender">{msg.sender}</span>}
                <div className="message-bubble">
                  <p>{msg.text}</p>
                </div>
                <span className="message-time">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>

        <form className="message-input-area" onSubmit={handleSendMessage}>
          <input
            type="text"
            className="message-input"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button 
            type="submit" 
            className="send-btn"
            disabled={!message.trim()}
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
};

export default ChatRooms;

import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Api from "../Services/Api";
import "./ChatRooms.css";

const ChatRooms = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const currentUsername = localStorage.getItem("username");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleExit = () => {
    navigate("/home");
  };

  useEffect(() => {
    // FETCH OLD MESSAGES
    const fetchMessages = async () => {
      try {
        const res = await Api.get(`chat/messages/${id}/`);

        const formattedMessages = res.data.map((msg) => ({
          id: msg.id,

          sender: msg.sender,

          text: msg.content,

          time: new Date(msg.timestamp).toLocaleTimeString(),

          isMe: msg.sender === currentUsername,
        }));

        setMessages(formattedMessages);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMessages();

    const fetchRoomDetails = async () => {
      try {
        const res = await Api.get(`rooms/${id}/`);

        setRoomName(res.data.name);

        setRoomDescription(res.data.description);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRoomDetails();

    // =========================
    // WEBSOCKET URL
    // =========================

    let socketUrl = "";

    // LOCAL DEVELOPMENT
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      socketUrl = `ws://127.0.0.1:8000/ws/chat/${id}/`;
    }

    // PRODUCTION
    else {
      const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";

      socketUrl = `${wsProtocol}://talkify.aghosh.site/ws/chat/${id}/`;
    }

    // WEBSOCKET CONNECTION
    socketRef.current = new WebSocket(socketUrl);

    socketRef.current.onopen = () => {
      console.log("WebSocket Connected");
      socketRef.current.send(
        JSON.stringify({
          type: "join",
          username: currentUsername,
        }),
      );
    };

    // RECEIVE MESSAGE
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "user_list_update") {
        setOnlineUsers(data.users);
      } else if (data.message) {
        const newMessage = {
          id: Date.now(),
          sender: data.sender,
          text: data.message,
          time: new Date().toLocaleTimeString(),
          isMe: data.sender === currentUsername,
        };

        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    return () => {
      socketRef.current.close();
    };
  }, [id, currentUsername]);

  // SEND MESSAGE
  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    socketRef.current.send(
      JSON.stringify({
        message: message,

        sender: currentUsername,
      }),
    );

    setMessage("");
  };

  return (
    <div className="chat-container">
      {/* SIDEBAR */}

      <aside className="chat-sidebar">
        <div className="sidebar-header">
          <h2>Talkify</h2>
        </div>

        <div className="users-list-container">
          <h3 className="users-title">Online Users ({onlineUsers.length})</h3>

          <ul className="users-list">
            {onlineUsers.map((user, index) => (
              <li
                key={index}
                className={`user-item ${user === currentUsername ? "current-user" : ""}`}
              >
                <div className="user-avatar">{user.charAt(0)}</div>

                <span className="user-name">{user}</span>

                <span className="status-dot"></span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* MAIN CHAT */}

      <main className="chat-main">
        <header className="chat-header">
          <div className="room-info">
            <h2 className="chat-room-name">{roomName}</h2>

            <p className="room-description">{roomDescription}</p>

            <span className="room-id">Room ID: {id}</span>
          </div>

          <button className="exit-btn" onClick={handleExit}>
            Exit Room
          </button>
        </header>

        {/* MESSAGES */}

        <div className="messages-container">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message-wrapper ${
                msg.isMe ? "message-mine" : "message-other"
              }`}
            >
              {!msg.isMe && (
                <div className="message-avatar">{msg.sender.charAt(0)}</div>
              )}

              <div className="message-content">
                {!msg.isMe && (
                  <span className="message-sender">{msg.sender}</span>
                )}

                <div className="message-bubble">
                  <p>{msg.text}</p>
                </div>

                <span className="message-time">{msg.time}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}

        <form className="message-input-area" onSubmit={handleSendMessage}>
          <input
            type="text"
            className="message-input"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button type="submit" className="send-btn" disabled={!message.trim()}>
            Send
          </button>
        </form>
      </main>
    </div>
  );
};

export default ChatRooms;

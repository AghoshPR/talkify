import React, { useEffect, useState } from "react";
import Api from "../Services/Api";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/authSlice";
import "./Home.css";

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      const res = await Api.get("rooms/");
      setRooms(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    try {
      setLoading(true);
      await Api.post("rooms/", {
        name: roomName,
        description: description,
      });

      setRoomName("");
      setDescription("");
      setIsModalOpen(false);
      fetchRooms();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="nav-logo">Talkify</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="page-header">
          <h2 className="page-title">Available Rooms</h2>
          <button className="add-room-btn" onClick={() => setIsModalOpen(true)}>
            + Add Room
          </button>
        </div>

        {/* Rooms Grid */}
        <div className="rooms-grid">
          {rooms.length === 0 ? (
            <div className="no-rooms">
              <p>No rooms available. Create one to get started!</p>
            </div>
          ) : (
            rooms.map((room) => (
              <div className="room-card" key={room.id}>
                <h3 className="room-name">{room.name}</h3>
                <p className="room-desc">
                  {room.description || "No description provided."}
                </p>
                <button 
                  className="join-btn"
                  onClick={() => handleJoinRoom(room.id)}
                >
                  Join Room
                </button>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Create Room Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create a New Room</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                &times;
              </button>
            </div>
            
            <form className="modal-form" onSubmit={handleCreateRoom}>
              <div className="form-group">
                <label htmlFor="roomName">Room Name</label>
                <input
                  id="roomName"
                  type="text"
                  value={roomName}
                  placeholder="e.g. General Discussion"
                  onChange={(e) => setRoomName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={description}
                  placeholder="What is this room about?"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading || !roomName.trim()}
              >
                {loading ? "Creating..." : "Create Room"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
import { BrowserRouter, Routes, Route } from "react-router-dom";



import ProtectedRoute from "./Components/ProtectedRoute";
import Login from "./Components/Pages/Login";
import Register from "./Components/Pages/Register";
import Home from "./Components/Pages/Home";
import ChatRooms from "./Components/ChatRoom/ChatRooms";

function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/room/:id"
          element={
            <ProtectedRoute>
              <ChatRooms />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

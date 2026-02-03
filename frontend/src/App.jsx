import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login"; 
import Signup from "./pages/Signup"; // Import this!
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} /> {/* Add this! */}
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
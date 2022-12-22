import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CampusDiscovery from "./pages/CampusDiscovery";
import Register from "./pages/Register";
import NoPage from "./pages/NoPage";
import Dashboard from "./pages/Dashboard";
import MapView from "./pages/MapView";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./pages/Login";
import { getJWT } from "./util/JWTHelpers";

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
            <Route index element={<CampusDiscovery />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="dashboard" element={getJWT() != null ? <Dashboard /> : <Navigate to="/login"></Navigate>} />
            <Route path="dashboard/map" element={getJWT() != null ? <MapView /> : <Navigate to="/login"></Navigate>} />
            <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
  );
}

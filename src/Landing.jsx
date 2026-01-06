import { Route, Routes, Navigate } from "react-router-dom";
import LandingPage from "./componant/LandingPage";
import Login from "./componant/auth/Login";
import Signup from "./componant/auth/Signup";

function Landing() {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default Landing;

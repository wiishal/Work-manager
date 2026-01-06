import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AuthGate from "./AuthGate";

console.log("in main");
ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<AuthGate />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

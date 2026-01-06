import "./App.css";
import "../src/style/listDetail.css";
import "../src/style/listDetail.css";
import Nav from "./componant/Nav";
import Today from "./pages/Today";
import Upcoming from "./pages/Upcoming";
import Expenses from "./pages/Expenses.jsx";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import TagDetails from "./componant/tags/TagDetails.jsx";
import ListDetails from "./componant/list/ListDetails.jsx";

function App({ user }) {
  console.log("in app");
  return (
    <div className="main">
      <Nav currUser={user} />
      <Routes>
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/" element={<Today />} />
        <Route path="/Upcoming" element={<Upcoming />} />
        <Route path="/Expenses" element={<Expenses />} />
        <Route path="/Lists/:item" element={<ListDetails />} />
        <Route path="/Tags/:tag" element={<TagDetails />} />
      </Routes>
    </div>
  );
}

export default App;

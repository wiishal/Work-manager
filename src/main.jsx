import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Landing from "./auth/Landing.jsx";
import { validateViaToken } from "./services/authService.js";

const Main = () => {
  const [user, setUserName] = useState("");
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    async function validateUser() {
      if (!logged) {
        const token = localStorage.getItem("token");
        if (!token) {
          setLogged(false);
          return;
        }
        const responce = await validateViaToken(token);
        setUserName(responce.data.user);
        if (responce) {
          setLogged(true);
        }
      }
    }
    validateUser();
  }, []);

  if (logged == null) return <div>loading!!!</div>;
  return (
    <>
      {logged ? (
        <App user={user} />
      ) : (
        <Landing setUserName={setUserName} setLogged={setLogged} />
      )}
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);

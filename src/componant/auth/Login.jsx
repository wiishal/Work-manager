import { useState } from "react";
import { login } from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login({ setLogged, setUserName }) {
  const [user, setUser] = useState({ username: "", password: "" });
  const { setUser: setLogin } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function setUserDetails(e, field) {
    setUser((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  }

  async function handleLoginClick() {
    const isInputEmpty = checkInput(user);
    if (isInputEmpty) {
      alert("Check inputs");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await login(user);

      const token = response.token;
      localStorage.setItem("token", token);
      setLogin(response.user);
      navigate("/");
    } catch (error) {
      console.error("Error during login:", error);
      if (error.response.status == 403) {
        setError("Invalid username and password");
      } else {
        setError("Internal Server Error!");
      }
      setIsProcessing(false);
    } finally {
      setIsProcessing(false);
    }
  }
  function checkInput(data) {
    const isEmpty = Object.values(data).some((detail) => detail === "");
    return isEmpty;
  }

  return (
    <div class="login-main">
      <div className="login-logo">
        <p onClick={() => navigate("/")} className="login-name">
          TODO
        </p>
      </div>
      <div className="login-bmain">
        <div className="login-tagline">
          <p className="login-tagLineText">
            Empower your <p> productivity</p>
          </p>
        </div>

        <div className="login-div">
          {error && <div>{error}</div>}
          <div className="userInput-div">
            <label className="username-lable" htmlFor="username">
              User Name
            </label>
            <input
              onChange={(e) => {
                setUserDetails(e, "username");
              }}
              className="username-input"
              type="text"
            />
          </div>

          <div className="passwordInput-div">
            <label className="password-lable" htmlFor="password">
              Password
            </label>
            <input
              onChange={(e) => {
                setUserDetails(e, "password");
              }}
              className="password-input"
              type="text"
            />
          </div>

          <div className="loginBtn-div">
            <button className="loginBtn" onClick={handleLoginClick}>
              {isProcessing ? "processing..." : "log in"}
            </button>
            <Link to="/signup">Create an Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

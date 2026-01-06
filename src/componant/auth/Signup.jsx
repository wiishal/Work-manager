import { useState } from "react";
import { signUp } from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Signup() {
  const [user, setUser] = useState({ username: "", password: "" });
  const { setUser: LoginUser } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  function setUserDetails(e, field) {
    setUser((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  }

  async function handleSignUpClick() {
    const isInputEmpty = checkInput(user);
    if (isInputEmpty) {
      alert("Check inputs");
      return;
    }
    setIsProcessing(true);
    try {
      const response = await signUp(user);
      const token = response.token;
      localStorage.setItem("token", token);
      LoginUser(response.user);
      navigate("/");
    } catch (error) {
      console.error("Error during login:", error);
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
            {/* Start Organizing Now!" */}
            Start <p> Organizing</p> Now!
          </p>
        </div>
        <div className="login-div">
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
          <div>
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
          </div>
          <div className="loginBtn-div">
            <button className="loginBtn" onClick={handleSignUpClick}>
              {isProcessing ? "processing..." : "Sign in"}
            </button>
            <Link to="/login">Already have an Accout</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

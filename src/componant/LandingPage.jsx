import "../style/Login.css"
import "../style/landingpage.css"
import { useNavigate } from "react-router";

export default function LandingPage() {
 const navigate = useNavigate();
  return (
    <div className="landing-main">
      <div className="landing-page">
        {/* landing bar */}
        <div className="landing-bar">
          <div className="landing-logo">
            <p className="landing-name">MANAGER</p>
          </div>
          <div className="landing-login">
            <button
              onClick={() => navigate("/login")}
              className="landing-loginBtn"
            >
              Log in
            </button>
          </div>
        </div>
        {/* main */}
        <div className="landing-headline">
          <p className="landing-headlineMain">Organize Your Life in Seconds</p>
          <p className="landing-secondaryLine">Plan. Prioritize. Achieve</p>
          <div className="landing-signup">
            <button
              onClick={() => navigate("/signup")}
              className="landing-signBtn"
            >
              Get Started
            </button>
          </div>
        </div>
        <div className="landing-footer">
          <a href="https://github.com/wiishal/Work-manager">
            <img
              src="https://res.cloudinary.com/ddg85vpnk/image/upload/v1739965625/github_hqeyh9.png"
              width={20}
              alt=""
            />
          </a>
          <p>demo version</p>
        </div>
      </div>
    </div>
  );

}
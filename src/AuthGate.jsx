import Landing from "./Landing";
import App from "./App";
import { useAuth } from "./context/AuthContext";
const AuthGate = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Landing />;
  }

  return <App user={user} />;
};

export default AuthGate;

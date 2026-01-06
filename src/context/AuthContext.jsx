import { createContext, useContext, useEffect, useState } from "react";
import { validateViaToken } from "../services/authService";
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function validate() {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);

        return;
      }
      try {
        const res = await validateViaToken(token);
        setUser(res.user);
      } catch (error) {
        localStorage.removeItem("token");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
    console.log("in auth");
    validate();
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("ctx needs to be in AuthContext");
  }
  return ctx;
};

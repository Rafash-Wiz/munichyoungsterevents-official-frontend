import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const data = await apiRequest("/api/auth/me");
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  const value = {
    user,
    setUser,
    isAuthLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

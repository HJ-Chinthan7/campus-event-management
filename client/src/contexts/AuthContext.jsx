import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          delete api.defaults.headers.common["Authorization"];
          setUser(null);
          setToken(null);
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(interceptor);
  }, []);


  useEffect(() => {
    const initAuth = () => {
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const userData = localStorage.getItem("user");
        if (userData) setUser(JSON.parse(userData));
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password, userType) => {
    try {
      const endpoint =
        userType === "admin"
          ? "/api/auth/admin/login"
          : "/api/auth/student/login";

      const response = await api.post(endpoint, { email, password });
      const { token: newToken, user: userData } = response.data;

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));
      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      setToken(newToken);
      setUser(userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/api/auth/student/register", userData);
      const { token: newToken, user: newUser } = response.data;

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(newUser));
      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      setToken(newToken);
      setUser(newUser);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
    navigate("/student/login"); 
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isStudent: !user?.role || user?.role !== "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../utils/apiConfig";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("userData"));

        if (!storedUser?._id) {
          setLoading(false);
          return;
        }

        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/users/get-user-by-id/${storedUser._id}`,
          {
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        setUser(res.data);
        setPermissions(res.data.permissions);
      } catch (err) {
        console.error("Auth load failed", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
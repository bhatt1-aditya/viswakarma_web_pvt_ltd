import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import API_BASE_URL from "../utils/apiConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("userData");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [permissions, setPermissions] = useState(() => {
    try {
      const stored = localStorage.getItem("userData");
      return stored ? JSON.parse(stored)?.permissions || null : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async (userId, tokenOverride) => {
    try {
      const storedUserData = JSON.parse(localStorage.getItem("userData") || "{}");
      const id = userId || user?._id || storedUserData?._id;

      if (!id) {
        setLoading(false);
        return null;
      }

      const token = tokenOverride || localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/users/get-user-by-id/${id}`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.data) {
        setUser(res.data);
        setPermissions(res.data.permissions || {});
        localStorage.setItem("userData", JSON.stringify(res.data));
        return res.data;
      }
    } catch (err) {
      console.warn("Auth sync check:", err?.message || err);
    } finally {
      setLoading(false);
    }
    return null;
  }, [user?._id]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = (userData, token) => {
    if (token) {
      localStorage.setItem("token", token);
    }
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
      setUser(userData);
      setPermissions(userData.permissions || {});
      if (userData._id) {
        refreshUser(userData._id, token);
      }
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setPermissions(null);
  };

  const roleName = (
    user?.role?.name ||
    (typeof user?.role === "string" ? user.role : "")
  )
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

  const isSuperAdmin = ["superadmin"].includes(roleName);
  const isAdmin = ["admin", "superadmin"].includes(roleName);
  const isTelecaller = roleName === "telecaller";
  const isPM = ["projectmanager", "pm"].includes(roleName);
  const isDeveloper = ["developer", "dev"].includes(roleName);
  const isQA = ["qatester", "qa"].includes(roleName);
  const isClient = ["client"].includes(roleName) || user?.isClient === true;

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        loading,
        login,
        logout,
        refreshUser,
        roleName,
        isSuperAdmin,
        isAdmin,
        isTelecaller,
        isPM,
        isDeveloper,
        isQA,
        isClient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;

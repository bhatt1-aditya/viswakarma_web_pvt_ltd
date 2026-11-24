import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthLayout from "./routes/middleware/AuthLayout";
import NonAuthLayout from "./routes/middleware/NonAuthLayout";
import { authRoutes, nonAuthRoutes, userRoutes } from "./routes/AllRoutes";
import UserLayout from "./routes/middleware/UserLayout";
import AuthProvider from "./context/AuthContext";
import SocketProvider from "./context/SocketContext";
import { Toaster } from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

axios.defaults.withCredentials = true;

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1500,
      once: true,
      offset: 90,
    });
    AOS.refresh();
  }, []);

  const renderAuthRoutes = (routes) => {
    return routes.map((route, idx) => (
      <Route
        key={idx}
        path={route.path}
        element={<AuthLayout>{route.component}</AuthLayout>}
      />
    ));
  };

  // Renders non-authenticated routes
  const renderNonAuthRoutes = (routes) => {
    return routes.map((route, idx) => (
      <Route
        key={idx}
        path={route.path}
        element={<NonAuthLayout>{route.component}</NonAuthLayout>}
      />
    ));
  };

  const renderUserRoutes = (routes) => {
    return routes.map((route, idx) => (
      <Route
        key={idx}
        path={route.path}
        element={<UserLayout>{route.component}</UserLayout>}
      />
    ));
  };

  return (
    <React.Fragment>
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider>
            <div>
              <Routes>
                {renderNonAuthRoutes(nonAuthRoutes)}
                {renderAuthRoutes(authRoutes)}
                {renderUserRoutes(userRoutes)}
              </Routes>
              <Toaster position="top-right" />
            </div>
          </SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </React.Fragment>
  );
};

export default App;

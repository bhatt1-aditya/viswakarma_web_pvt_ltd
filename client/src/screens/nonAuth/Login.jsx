import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import ButtonLoader from "../../components/common/ButtonLoader";
import API_BASE_URL from "../../utils/apiConfig";

const Login = () => {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    identifier: "",
    password: "",
    general: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let valid = true;
    const newErrors = { identifier: "", password: "", general: "" };

    if (!identifier.trim()) {
      newErrors.identifier = "Email or 10-digit phone number is required.";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const cleanIdentifier = identifier.trim();
      const res = await axios.post(
        `${API_BASE_URL}/users/login-user`,
        { identifier: cleanIdentifier, password },
        {
          withCredentials: true,
        }
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      localStorage.setItem("userData", JSON.stringify(res.data.user || res.data.data));
      navigate("/dashboard");
    } catch (error) {
      setErrors({
        identifier: "",
        password: "",
        general: error.response?.data?.message || "Invalid credentials or network issue",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE (IMAGE + BRANDING) */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-[#082B59] via-[#0756A5] to-[#071426] items-center justify-center overflow-hidden">
        {/* Animated Background Circle */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 6 }}
          className="absolute w-[450px] h-[450px] bg-[#FF6900]/15 rounded-full blur-3xl"
        />

        <div className="relative z-10 text-center text-white px-10 max-w-lg">
          <Link to="/" className="inline-block mb-6">
            <img
              src="/leadLogo.png"
              alt="Vishwakarma Web Logo"
              className="h-16 w-auto mx-auto object-contain brightness-125"
            />
          </Link>

          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-extrabold mb-3 text-white"
          >
            Vishwakarma Web Console
          </motion.h1>

          <motion.p
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-blue-200 leading-relaxed"
          >
            Secure enterprise access for administrators and personnel. Manage all 108 services, live demos, leads, and operational workflows.
          </motion.p>

          <div className="mt-8 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-left text-xs space-y-1">
            <p className="font-bold text-[#FF8A00]">Default System Credentials:</p>
            <p className="text-gray-200">Email: <span className="font-mono text-white">admin@vishwakarmaweb.com</span></p>
            <p className="text-gray-200">Phone: <span className="font-mono text-white">9876543210</span></p>
            <p className="text-gray-200">Password: <span className="font-mono text-white">adminpassword123</span></p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE (FORM) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0756A5] hover:text-[#FF6900] transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Website</span>
            </Link>
            <span className="text-[10px] font-mono text-gray-400">Portal v2.0</span>
          </div>

          <h2 className="text-2xl font-bold text-[#082B59] mb-1">
            Welcome Back 👋
          </h2>
          <p className="text-xs text-gray-500 mb-6">
            Sign in to manage services, leads, and systems
          </p>

          {errors.general && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-xs font-medium border border-red-200">
              {errors.general}
            </div>
          )}

          {/* Identifier Input */}
          <div className="mb-4">
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Email Address or Phone Number
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="admin@vishwakarmaweb.com or 9876543210"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className={`w-full p-3 rounded-xl border text-xs focus:outline-none transition-colors ${
                  errors.identifier
                    ? "border-red-500"
                    : "border-gray-200 focus:border-[#0756A5]"
                }`}
              />
            </div>
            {errors.identifier && (
              <p className="text-red-500 text-[11px] mt-1">{errors.identifier}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className={`w-full p-3 rounded-xl border text-xs focus:outline-none transition-colors ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-200 focus:border-[#0756A5]"
                }`}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-[11px] mt-1">{errors.password}</p>
            )}
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full py-3.5 bg-[#0756A5] hover:bg-[#082B59] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <ButtonLoader /> : "Sign In to Admin Console"}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

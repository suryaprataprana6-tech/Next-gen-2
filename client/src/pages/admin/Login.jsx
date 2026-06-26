import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BarChart3, Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";

function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (error) setError("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const result = await login(formData.email.trim(), formData.password);
      if (result.success) {
        navigate("/admin/dashboard");
      } else {
        setError(result.message || "Invalid credentials.");
      }
    } catch (err) {
      setError("Server connection failure. Please verify the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 font-sans relative overflow-hidden">
      {/* Background glow graphics */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/10 blur-[100px] -z-10 animate-float-1"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-secondary/10 blur-[100px] -z-10 animate-float-2"></div>

      <div className="w-full max-w-[440px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Top Header Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/20 mb-4 animate-pulse">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h2 className="font-headings font-extrabold text-xl sm:text-2xl text-slate-800 dark:text-white mb-1.5 tracking-tight">
            Admin Panel Login
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Sign in to manage your NextGen Digital portal
          </p>
        </div>

        {/* Error notification alert */}
        {error && (
          <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl p-3 mb-6">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-red-600 dark:text-red-400 font-medium leading-normal text-left">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 text-left">
          {/* Email input field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@nextgendigital.com"
                className="w-full text-xs py-3 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 focus:border-primary focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-primary/10 outline-none transition-all dark:text-white"
              />
            </div>
          </div>

          {/* Password input field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full text-xs py-3 pl-10 pr-10 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 focus:border-primary focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-primary/10 outline-none transition-all dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me and Forgot Password row */}
          <div className="flex items-center justify-between text-xs py-1">
            <label className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium select-none cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary"
              />
              <span>Remember Me</span>
            </label>
            <span
              onClick={() => alert("Default account settings: admin@nextgendigital.com / Admin@123")}
              className="text-primary hover:underline font-semibold cursor-pointer"
            >
              Forgot Password?
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs py-3.5 rounded-xl shadow-md hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none transition-all duration-200 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Demo credentials hint */}
        <div className="mt-8 border-t border-slate-100 dark:border-slate-800/80 pt-4 flex flex-col items-center gap-1">
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Demo Access</p>
          <div className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 w-full flex flex-col gap-1">
            <p className="text-[10px] text-slate-500 dark:text-slate-450 text-center font-medium leading-none">
              Email: <span className="font-bold text-slate-700 dark:text-slate-300">admin@nextgendigital.com</span>
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-450 text-center font-medium leading-none">
              Password: <span className="font-bold text-slate-700 dark:text-slate-300">Admin@123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Zap,
} from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden auth-bg"
    >
      {/* Animated mesh background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        {/* Mouse follow glow */}
        <div
          className="mouse-glow"
          style={{
            left: `${mousePos.x}%`,
            top: `${mousePos.y}%`,
          }}
        />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 auth-grid-overlay pointer-events-none" />

      <div className={`relative z-10 w-full max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-8 items-center transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

        {/* LEFT — Branding */}
        <div className="hidden lg:flex flex-col gap-10 px-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="logo-icon">
              <Zap className="w-7 h-7 text-white" fill="white" />
            </div>
            <span className="text-3xl font-black tracking-tight text-white">
              Chat<span className="text-gradient">Sphere</span>
            </span>
          </div>

          {/* Hero text */}
          <div className="space-y-4">
            <h1 className="text-6xl font-black leading-tight text-white">
              Your world,<br />
              <span className="text-gradient">connected.</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed max-w-sm">
              Real-time messaging with people that matter. Fast, secure, and beautifully designed.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3">
            {["⚡ Real-time", "🔒 Encrypted", "📸 Media sharing", "🌍 Always online"].map((f) => (
              <span key={f} className="feature-pill">{f}</span>
            ))}
          </div>

          {/* Floating chat bubbles preview */}
          <div className="space-y-3 mt-2">
            {[
              { msg: "Hey! Just sent you the files 📎", time: "2m ago", right: false },
              { msg: "Got it, looks great! 🔥", time: "1m ago", right: true },
              { msg: "Let's hop on a call later?", time: "just now", right: false },
            ].map((b, i) => (
              <div
                key={i}
                className={`flex ${b.right ? "justify-end" : "justify-start"} chat-preview-bubble`}
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className={`px-4 py-2.5 rounded-2xl text-sm font-medium max-w-xs ${
                  b.right
                    ? "bg-gradient-to-r from-pink-500 to-violet-600 text-white rounded-br-sm"
                    : "bg-white/10 backdrop-blur border border-white/10 text-white rounded-bl-sm"
                }`}>
                  {b.msg}
                  <span className="block text-[10px] opacity-50 mt-0.5 text-right">{b.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Login card */}
        <div className="w-full max-w-md mx-auto">
          <div className="glass-card">

            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="logo-icon-sm">
                <Zap className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="text-xl font-black text-white">
                Chat<span className="text-gradient">Sphere</span>
              </span>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-black text-white mb-1">Welcome back 👋</h2>
              <p className="text-white/50 text-sm">Sign in to continue your conversations</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Email
                </label>
                <div className={`input-wrap ${focused === "email" ? "input-focused" : ""}`}>
                  <Mail className="w-4 h-4 text-white/40 shrink-0" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="bg-transparent flex-1 text-white placeholder:text-white/25 outline-none text-sm"
                    value={formData.email}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused("")}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Password
                </label>
                <div className={`input-wrap ${focused === "password" ? "input-focused" : ""}`}>
                  <Lock className="w-4 h-4 text-white/40 shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="bg-transparent flex-1 text-white placeholder:text-white/25 outline-none text-sm"
                    value={formData.password}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused("")}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="cta-btn w-full mt-2"
              >
                {isLoggingIn ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In
                    <span className="text-lg">→</span>
                  </span>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-white/50 text-sm">
                No account?{" "}
                <Link to="/signup" className="text-pink-400 hover:text-pink-300 font-semibold transition-colors">
                  Create one free →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
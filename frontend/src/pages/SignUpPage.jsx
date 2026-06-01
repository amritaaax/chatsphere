import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, User, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);

  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const { signup, isSigningUp } = useAuthStore();

  useEffect(() => { setMounted(true); }, []);

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

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm() === true) signup(formData);
  };

  // Password strength
  const getStrength = (pw) => {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 6) s++;
    if (pw.length >= 10) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };
  const strength = getStrength(formData.password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Elite"][strength];
  const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#ec4899"][strength];

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden auth-bg"
    >
      {/* Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div
          className="mouse-glow"
          style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }}
        />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 auth-grid-overlay pointer-events-none" />

      <div className={`relative z-10 w-full max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-8 items-center transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

        {/* LEFT — Branding */}
        <div className="hidden lg:flex flex-col gap-8 px-8">
          <div className="flex items-center gap-3">
            <div className="logo-icon">
              <Zap className="w-7 h-7 text-white" fill="white" />
            </div>
            <span className="text-3xl font-black tracking-tight text-white">
              Chat<span className="text-gradient">Sphere</span>
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl font-black leading-tight text-white">
              Join the<br />
              <span className="text-gradient">conversation.</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed max-w-sm">
              Create your free account in seconds. No credit card, no nonsense — just pure messaging.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4 mt-2">
            {[
              { icon: "✦", label: "Create your account", sub: "Takes less than a minute" },
              { icon: "⚡", label: "Find your people", sub: "Search and connect instantly" },
              { icon: "🔥", label: "Start chatting", sub: "Real-time, always fast" },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-4 signup-step" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-lg shrink-0">
                  {step.icon}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{step.label}</p>
                  <p className="text-white/40 text-xs">{step.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {["⚡ Real-time", "🔒 Encrypted", "📸 Media sharing", "🌍 Always online"].map((f) => (
              <span key={f} className="feature-pill">{f}</span>
            ))}
          </div>
        </div>

        {/* RIGHT — Card */}
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

            <div className="mb-7">
              <h2 className="text-2xl font-black text-white mb-1">Create account ✨</h2>
              <p className="text-white/50 text-sm">Free forever. No credit card needed.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Full Name</label>
                <div className={`input-wrap ${focused === "name" ? "input-focused" : ""}`}>
                  <User className="w-4 h-4 text-white/40 shrink-0" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="bg-transparent flex-1 text-white placeholder:text-white/25 outline-none text-sm"
                    value={formData.fullName}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused("")}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Email</label>
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
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Password</label>
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

                {/* Password strength bar */}
                {formData.password && (
                  <div className="space-y-1 pt-1">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((i) => (
                        <div
                          key={i}
                          className="h-1 flex-1 rounded-full transition-all duration-300"
                          style={{ background: i <= strength ? strengthColor : "rgba(255,255,255,0.1)" }}
                        />
                      ))}
                    </div>
                    <p className="text-xs font-semibold" style={{ color: strengthColor }}>
                      {strengthLabel}
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSigningUp}
                className="cta-btn w-full mt-2"
              >
                {isSigningUp ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Create Free Account
                    <span className="text-lg">→</span>
                  </span>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-white/50 text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-pink-400 hover:text-pink-300 font-semibold transition-colors">
                  Sign in →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
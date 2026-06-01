import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, Settings, User, Zap } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-root">
      <div className="navbar-inner">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="logo-icon-sm">
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          <span className="text-base font-black text-white hidden sm:block">
            Chat<span className="text-gradient">Sphere</span>
          </span>
        </Link>

        {/* Nav actions */}
        {authUser && (
          <div className="flex items-center gap-1">

            <Link to="/settings" className={`navbar-btn ${isActive("/settings") ? "navbar-btn-active" : ""}`}>
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-semibold">Settings</span>
            </Link>

            <Link to="/profile" className={`navbar-btn ${isActive("/profile") ? "navbar-btn-active" : ""}`}>
              {authUser.profilePic ? (
                <img
                  src={authUser.profilePic}
                  alt="avatar"
                  className="w-5 h-5 rounded-lg object-cover"
                />
              ) : (
                <User className="w-4 h-4" />
              )}
              <span className="hidden sm:inline text-xs font-semibold">Profile</span>
            </Link>

            <div className="w-px h-5 bg-white/10 mx-1" />

            <button onClick={logout} className="navbar-btn navbar-logout">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-semibold">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
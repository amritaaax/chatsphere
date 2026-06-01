import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Shield, Calendar, CheckCircle, Zap } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const memberSince = authUser.createdAt?.split("T")[0];

  // Profile completion
  const fields = [
    !!authUser.profilePic,
    !!authUser.fullName,
    !!authUser.email,
  ];
  const completion = Math.round((fields.filter(Boolean).length / fields.length) * 100);

  return (
    <div className="profile-page-root">
      <div className="profile-page-inner">

        {/* ── Cover + Avatar ── */}
        <div className="profile-cover">
          <div className="profile-cover-bg" />
          <div className="profile-cover-content">
            {/* Avatar */}
            <div className="profile-avatar-wrap">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="profile-avatar-img"
              />
              <label
                htmlFor="avatar-upload"
                className={`profile-camera-btn ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
                title="Update photo"
              >
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
              {/* Online dot */}
              <span className="profile-online-dot" />
            </div>

            {/* Name + status */}
            <div className="text-center mt-3">
              <h1 className="text-2xl font-black text-white">{authUser.fullName}</h1>
              <p className="text-white/50 text-sm mt-1">{authUser.email}</p>
              {isUpdatingProfile && (
                <p className="text-pink-400 text-xs mt-1 animate-pulse">Uploading photo...</p>
              )}
            </div>

            {/* Stat pills */}
            <div className="flex gap-3 mt-4 flex-wrap justify-center">
              <div className="profile-stat-pill">
                <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400 text-xs font-semibold">Active</span>
              </div>
              <div className="profile-stat-pill">
                <Shield className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-violet-400 text-xs font-semibold">Verified</span>
              </div>
              <div className="profile-stat-pill">
                <Calendar className="w-3.5 h-3.5 text-white/40" />
                <span className="text-white/40 text-xs font-semibold">Since {memberSince}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Profile completion ── */}
        <div className="profile-card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white/80 text-sm font-bold">Profile Completion</p>
              <p className="text-white/35 text-xs">Fill in details to complete your profile</p>
            </div>
            <span className="text-2xl font-black text-gradient">{completion}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${completion}%`,
                background: "linear-gradient(90deg, #ec4899, #7c3aed)",
              }}
            />
          </div>
          {completion < 100 && (
            <p className="text-white/30 text-xs mt-2">
              Add a profile photo to reach 100% ✨
            </p>
          )}
        </div>

        {/* ── Info cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          <div className="profile-info-card">
            <div className="profile-info-icon">
              <User className="w-4 h-4 text-pink-400" />
            </div>
            <div className="min-w-0">
              <p className="text-white/35 text-xs font-semibold uppercase tracking-wider mb-1">Full Name</p>
              <p className="text-white font-semibold text-sm truncate">{authUser.fullName}</p>
            </div>
          </div>

          <div className="profile-info-card">
            <div className="profile-info-icon">
              <Mail className="w-4 h-4 text-violet-400" />
            </div>
            <div className="min-w-0">
              <p className="text-white/35 text-xs font-semibold uppercase tracking-wider mb-1">Email</p>
              <p className="text-white font-semibold text-sm truncate">{authUser.email}</p>
            </div>
          </div>

          <div className="profile-info-card">
            <div className="profile-info-icon">
              <Calendar className="w-4 h-4 text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-white/35 text-xs font-semibold uppercase tracking-wider mb-1">Member Since</p>
              <p className="text-white font-semibold text-sm">{memberSince}</p>
            </div>
          </div>

          <div className="profile-info-card">
            <div className="profile-info-icon">
              <Zap className="w-4 h-4 text-yellow-400" fill="currentColor" />
            </div>
            <div className="min-w-0">
              <p className="text-white/35 text-xs font-semibold uppercase tracking-wider mb-1">Account Plan</p>
              <p className="text-white font-semibold text-sm">Free Forever ✨</p>
            </div>
          </div>
        </div>

        {/* ── Security note ── */}
        <div className="profile-security-card">
          <Shield className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-white/70 text-sm font-semibold">Your data is secure</p>
            <p className="text-white/30 text-xs mt-0.5">
              All messages are transmitted securely. Profile data is encrypted at rest.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
import { useEffect, useState, useMemo } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Search, X, Zap, Users, ArrowLeft } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => { getUsers(); }, [getUsers]);

  const filteredUsers = useMemo(() => {
    let list = showOnlineOnly ? users.filter((u) => onlineUsers.includes(u._id)) : users;
    if (search.trim()) list = list.filter((u) => u.fullName.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [users, onlineUsers, showOnlineOnly, search]);

  const onlineCount = onlineUsers.filter((id) => users.some((u) => u._id === id)).length;

  if (isUsersLoading) return <SidebarSkeleton />;

  // On mobile: hide sidebar when a chat is selected
  const mobileHidden = selectedUser ? "hidden md:flex" : "flex";

  return (
    <aside className={`${mobileHidden} md:flex flex-col sidebar-root`}>

      {/* Header */}
      <div className="sidebar-header">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="logo-icon-sm">
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-base font-black text-white">
              Chat<span className="text-gradient">Sphere</span>
            </span>
          </div>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-semibold">{onlineCount} online</span>
          </span>
        </div>

        {/* Search */}
        <div className="sidebar-search">
          <Search className="w-3.5 h-3.5 text-white/30 shrink-0" />
          <input
            type="text"
            placeholder="Search contacts..."
            className="bg-transparent flex-1 text-white text-sm placeholder:text-white/25 outline-none min-w-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-white/30 hover:text-white/60 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Toggle */}
        <div className="flex items-center gap-2 mt-3">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div
              onClick={() => setShowOnlineOnly(!showOnlineOnly)}
              className={`w-8 h-4 rounded-full transition-all duration-300 relative cursor-pointer ${showOnlineOnly ? "bg-pink-500" : "bg-white/10"}`}
            >
              <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-300 ${showOnlineOnly ? "left-4" : "left-0.5"}`} />
            </div>
            <span className="text-xs text-white/50">Online only</span>
          </label>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto sidebar-scroll py-2">
        <div className="flex items-center gap-2 px-4 pb-2">
          <Users className="w-3 h-3 text-white/30" />
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
            Contacts · {filteredUsers.length}
          </span>
        </div>

        {filteredUsers.map((user) => {
          const isOnline = onlineUsers.includes(user._id);
          const isActive = selectedUser?._id === user._id;
          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`sidebar-contact ${isActive ? "sidebar-contact-active" : ""}`}
            >
              <div className="relative shrink-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="w-11 h-11 rounded-2xl object-cover ring-2 ring-white/5"
                />
                {isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full ring-2 ring-[#0a0a0f]" />
                )}
              </div>
              <div className="flex flex-col flex-1 min-w-0 text-left">
                <span className={`text-sm font-semibold truncate ${isActive ? "text-white" : "text-white/80"}`}>
                  {user.fullName}
                </span>
                <span className={`text-xs truncate mt-0.5 ${isOnline ? "text-green-400/70" : "text-white/30"}`}>
                  {isOnline ? "● Active now" : "○ Tap to message"}
                </span>
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
              <Search className="w-5 h-5 text-white/20" />
            </div>
            <p className="text-white/30 text-sm font-medium">No contacts found</p>
            {search && (
              <button onClick={() => setSearch("")} className="text-pink-400/70 text-xs mt-1 hover:text-pink-400 transition-colors">
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
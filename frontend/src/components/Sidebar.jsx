import { useEffect, useState, useMemo } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Search, X, Zap, Users } from "lucide-react";

const formatSidebarTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, messages } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = useMemo(() => {
    let list = showOnlineOnly
      ? users.filter((u) => onlineUsers.includes(u._id))
      : users;
    if (search.trim()) {
      list = list.filter((u) =>
        u.fullName.toLowerCase().includes(search.toLowerCase())
      );
    }
    return list;
  }, [users, onlineUsers, showOnlineOnly, search]);

  if (isUsersLoading) return <SidebarSkeleton />;

  const onlineCount = onlineUsers.filter((id) =>
    users.some((u) => u._id === id)
  ).length;

  return (
    <aside className="sidebar-root h-full flex flex-col">
      <div className="sidebar-header">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="logo-icon-sm">
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-base font-black text-white hidden lg:block tracking-tight">
              Chat<span className="text-gradient">Sphere</span>
            </span>
          </div>
          <span className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-bold">{onlineCount} online</span>
          </span>
        </div>

        <div className="hidden lg:flex sidebar-search">
          <Search className="w-3.5 h-3.5 text-white/30 shrink-0" />
          <input
            type="text"
            placeholder="Search contacts..."
            className="bg-transparent flex-1 text-white text-sm placeholder:text-white/25 outline-none min-w-0 font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-white/30 hover:text-white/60 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-2 mt-3">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div
              onClick={() => setShowOnlineOnly(!showOnlineOnly)}
              className={`w-8 h-4 rounded-full transition-all duration-300 relative cursor-pointer ${
                showOnlineOnly ? "bg-pink-500" : "bg-white/10"
              }`}
            >
              <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-300 shadow-sm ${
                showOnlineOnly ? "left-4" : "left-0.5"
              }`} />
            </div>
            <span className="text-xs text-white/40 group-hover:text-white/65 transition-colors font-semibold">
              Online only
            </span>
          </label>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto sidebar-scroll py-2">
        <div className="hidden lg:flex items-center gap-2 px-4 pb-2.5 pt-1">
          <Users className="w-3 h-3 text-white/20" />
          <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.12em]">
            Direct Messages · {filteredUsers.length}
          </span>
        </div>

        {filteredUsers.map((user) => {
          const isOnline = onlineUsers.includes(user._id);
          const isActive = selectedUser?._id === user._id;
          const lastMsg = null;
          const unread = 0;

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`sidebar-contact ${isActive ? "sidebar-contact-active" : ""}`}
            >
              <div className="sidebar-avatar-wrap">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="sidebar-avatar-img"
                />
                {isOnline && <span className="sidebar-online-dot" />}
              </div>

              <div className="sidebar-contact-info hidden lg:flex">
                <div className="sidebar-contact-top">
                  <span className="sidebar-contact-name">{user.fullName}</span>
                  {lastMsg?.createdAt && (
                    <span className="sidebar-contact-time">
                      {formatSidebarTime(lastMsg.createdAt)}
                    </span>
                  )}
                </div>
                <div className="sidebar-contact-bottom">
                  <span className="sidebar-contact-preview">
                    {isOnline ? (
                      <span className="flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400" style={{ flexShrink: 0 }} />
                        Active now
                      </span>
                    ) : (
                      "Tap to message"
                    )}
                  </span>
                  {unread > 0 && (
                    <span className="sidebar-unread-badge">{unread}</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-14 px-4 text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/07 flex items-center justify-center">
              <Search className="w-5 h-5 text-white/20" />
            </div>
            <div>
              <p className="text-white/30 text-sm font-bold mb-1">No contacts found</p>
              {search && (
                <button onClick={() => setSearch("")} className="text-pink-400/60 text-xs hover:text-pink-400 transition-colors font-semibold">
                  Clear search
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="hidden lg:flex items-center gap-2 px-4 py-3 border-t border-white/5">
        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        <span className="text-[11px] text-white/25 font-semibold">You're online</span>
      </div>
    </aside>
  );
};

export default Sidebar;
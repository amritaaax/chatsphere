import { X, Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="chat-header-root">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile back button */}
        <button
          onClick={() => setSelectedUser(null)}
          className="md:hidden chat-header-btn mr-1"
        >
          <ArrowLeft className="w-5 h-5 text-white/70" />
        </button>

        <div className="relative shrink-0">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullName}
            className="w-9 h-9 md:w-10 md:h-10 rounded-2xl object-cover ring-2 ring-white/10"
          />
          {isOnline && (
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full ring-2 ring-[#0d0d14]" />
          )}
        </div>

        <div className="min-w-0">
          <h3 className="text-white font-bold text-sm truncate leading-tight">{selectedUser.fullName}</h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            {isOnline ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-semibold">Active now</span>
              </>
            ) : (
              <span className="text-white/35 text-xs">Offline</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button className="chat-header-btn hidden sm:flex" title="Voice call"><Phone className="w-4 h-4" /></button>
        <button className="chat-header-btn hidden sm:flex" title="Video call"><Video className="w-4 h-4" /></button>
        <button className="chat-header-btn" title="More"><MoreVertical className="w-4 h-4" /></button>
        <div className="w-px h-5 bg-white/10 mx-1 hidden md:block" />
        <button onClick={() => setSelectedUser(null)} className="chat-header-btn chat-header-close hidden md:flex" title="Close">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
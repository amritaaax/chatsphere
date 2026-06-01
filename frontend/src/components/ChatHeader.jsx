import { X, Phone, Video, MoreVertical } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="chat-header-root">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="relative shrink-0">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullName}
            className="chat-header-avatar"
          />
          {isOnline && (
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0a0a10]"
              style={{ boxShadow: "0 0 6px rgba(34,197,94,0.6)" }}
            />
          )}
        </div>

        <div className="min-w-0 flex flex-col gap-0.5">
          <h3 className="text-white font-black text-sm tracking-tight truncate leading-none">
            {selectedUser.fullName}
          </h3>
          <div className="flex items-center gap-1.5">
            {isOnline ? (
              <>
                <span
                  className="w-1.5 h-1.5 rounded-full bg-green-400"
                  style={{ boxShadow: "0 0 4px rgba(34,197,94,0.8)" }}
                />
                <span className="text-green-400 text-[11px] font-bold tracking-wide">Active now</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-white/15" />
                <span className="text-white/30 text-[11px] font-semibold">Offline</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-0.5 shrink-0">
        <button className="chat-header-btn chat-header-call" title="Voice call">
          <Phone className="w-4 h-4" />
        </button>
        <button className="chat-header-btn chat-header-video" title="Video call">
          <Video className="w-4 h-4" />
        </button>
        <button className="chat-header-btn" title="More options">
          <MoreVertical className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-white/10 mx-1.5" />
        <button
          onClick={() => setSelectedUser(null)}
          className="chat-header-btn chat-header-close"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
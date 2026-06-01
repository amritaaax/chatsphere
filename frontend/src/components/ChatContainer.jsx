import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const REACTIONS = ["❤️", "👍", "😂", "😮", "😢", "🔥"];

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [hoveredMsg, setHoveredMsg] = useState(null);
  const [reactions, setReactions] = useState({});

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleReact = (msgId, emoji) => {
    setReactions((prev) => {
      if (prev[msgId] === emoji) { const next = { ...prev }; delete next[msgId]; return next; }
      return { ...prev, [msgId]: emoji };
    });
    setHoveredMsg(null);
  };

  const groupedMessages = messages.reduce((acc, msg) => {
    const date = new Date(msg.createdAt).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  if (isMessagesLoading) {
    return (
      <div className="chat-container-root">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="chat-container-root">
      <ChatHeader />

      <div className="chat-messages-area">
        {Object.entries(groupedMessages).map(([date, dayMessages]) => (
          <div key={date}>
            <div className="chat-date-divider">
              <span>{date === new Date().toDateString() ? "Today" : date}</span>
            </div>

            {dayMessages.map((message, idx) => {
              const isMine = message.senderId === authUser._id;
              const isLast = idx === dayMessages.length - 1;
              const nextMsg = dayMessages[idx + 1];
              const isGrouped = nextMsg && nextMsg.senderId === message.senderId;
              const reaction = reactions[message._id];

              return (
                <div
                  key={message._id}
                  ref={isLast ? messageEndRef : null}
                  className={`chat-msg-row ${isMine ? "chat-msg-row-mine" : "chat-msg-row-theirs"}`}
                  onMouseEnter={() => setHoveredMsg(message._id)}
                  onMouseLeave={() => setHoveredMsg(null)}
                  onTouchStart={() => setHoveredMsg(message._id)}
                >
                  {!isMine && (
                    <div className={`chat-avatar ${isGrouped ? "chat-avatar-hidden" : ""}`}>
                      <img src={selectedUser.profilePic || "/avatar.png"} alt="avatar"
                        className="w-7 h-7 md:w-8 md:h-8 rounded-xl object-cover ring-1 ring-white/10" />
                    </div>
                  )}

                  <div className={`chat-bubble-wrap ${isMine ? "items-end" : "items-start"}`}>
                    {hoveredMsg === message._id && (
                      <div className={`reaction-picker-row ${isMine ? "reaction-row-mine" : "reaction-row-theirs"}`}>
                        {REACTIONS.map((emoji) => (
                          <button key={emoji} onClick={() => handleReact(message._id, emoji)}
                            className={`reaction-pick-btn ${reaction === emoji ? "reaction-pick-btn-active" : ""}`}>
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}

                    {message.image && (
                      <div className={`chat-img-wrap ${isMine ? "chat-img-mine" : "chat-img-theirs"}`}>
                        <img src={message.image} alt="Attachment" className="chat-img" />
                      </div>
                    )}

                    {message.text && (
                      <div className={`chat-bubble ${isMine ? "chat-bubble-mine" : "chat-bubble-theirs"} ${isGrouped ? (isMine ? "chat-bubble-mine-grouped" : "chat-bubble-theirs-grouped") : ""}`}>
                        <p className="chat-bubble-text">{message.text}</p>
                      </div>
                    )}

                    {reaction && (
                      <button onClick={() => handleReact(message._id, reaction)} className="reaction-badge">
                        {reaction}
                      </button>
                    )}

                    {!isGrouped && (
                      <span className="chat-timestamp">
                        {formatMessageTime(message.createdAt)}
                        {isMine && <span className="ml-1 text-pink-400/60">✓✓</span>}
                      </span>
                    )}
                  </div>

                  {isMine && (
                    <div className={`chat-avatar ${isGrouped ? "chat-avatar-hidden" : ""}`}>
                      <img src={authUser.profilePic || "/avatar.png"} alt="avatar"
                        className="w-7 h-7 md:w-8 md:h-8 rounded-xl object-cover ring-1 ring-white/10" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40">
            <div className="text-4xl">💬</div>
            <p className="text-white/50 text-sm font-medium">No messages yet. Say hi!</p>
          </div>
        )}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
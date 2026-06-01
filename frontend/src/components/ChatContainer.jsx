import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const REACTIONS = ["❤️", "👍", "😂", "😮", "😢", "🔥"];

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
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
      if (prev[msgId] === emoji) {
        const next = { ...prev };
        delete next[msgId];
        return next;
      }
      return { ...prev, [msgId]: emoji };
    });
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
        <div className="chat-messages-inner">
          {messages.length === 0 ? (
            <div className="chat-empty-state">
              <div className="chat-empty-icon">💬</div>
              <div className="text-center">
                <p className="text-white/60 text-sm font-bold mb-1">Start the conversation</p>
                <p className="text-white/25 text-xs font-medium">Say hi to {selectedUser.fullName} 👋</p>
              </div>
            </div>
          ) : (
            Object.entries(groupedMessages).map(([date, dayMessages]) => (
              <div key={date}>
                <div className="chat-date-divider">
                  <span>{date === new Date().toDateString() ? "Today" : date}</span>
                </div>

                {dayMessages.map((message, idx) => {
                  const isMine = message.senderId === authUser._id;
                  const isLast = idx === dayMessages.length - 1;
                  const nextMsg = dayMessages[idx + 1];
                  const prevMsg = dayMessages[idx - 1];
                  const isGroupedWithNext = nextMsg && nextMsg.senderId === message.senderId;
                  const isGroupedWithPrev = prevMsg && prevMsg.senderId === message.senderId;
                  const isGroupStart = !isGroupedWithPrev;
                  const reaction = reactions[message._id];

                  return (
                    <div
                      key={message._id}
                      ref={isLast ? messageEndRef : null}
                      className={`chat-msg-row ${isMine ? "chat-msg-row-mine" : "chat-msg-row-theirs"} ${isGroupStart ? "chat-msg-group-start" : ""}`}
                      onMouseEnter={() => setHoveredMsg(message._id)}
                      onMouseLeave={() => setHoveredMsg(null)}
                    >
                      {!isMine && (
                        <div className={`chat-avatar ${isGroupedWithNext ? "chat-avatar-hidden" : ""}`}>
                          <img
                            src={selectedUser.profilePic || "/avatar.png"}
                            alt="avatar"
                            className="w-8 h-8 rounded-xl object-cover"
                            style={{ border: "1.5px solid rgba(255,255,255,0.08)", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
                          />
                        </div>
                      )}

                      <div className={`chat-bubble-wrap ${isMine ? "items-end" : "items-start"}`}>
                        {hoveredMsg === message._id && (
                          <div className={`reaction-picker-row ${isMine ? "reaction-row-mine" : "reaction-row-theirs"}`}>
                            {REACTIONS.map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => handleReact(message._id, emoji)}
                                className={`reaction-pick-btn ${reaction === emoji ? "reaction-pick-btn-active" : ""}`}
                              >
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
                          <div className={`chat-bubble ${isMine ? "chat-bubble-mine" : "chat-bubble-theirs"} ${
                            isGroupedWithNext ? (isMine ? "chat-bubble-mine-grouped" : "chat-bubble-theirs-grouped") : ""
                          }`}>
                            <p className="chat-bubble-text">{message.text}</p>
                          </div>
                        )}

                        {reaction && (
                          <button onClick={() => handleReact(message._id, reaction)} className="reaction-badge">
                            {reaction}
                          </button>
                        )}

                        {!isGroupedWithNext && (
                          <div className="chat-timestamp">
                            <span>{formatMessageTime(message.createdAt)}</span>
                            {isMine && <span className="chat-read-check">✓✓</span>}
                          </div>
                        )}
                      </div>

                      {isMine && (
                        <div className={`chat-avatar ${isGroupedWithNext ? "chat-avatar-hidden" : ""}`}>
                          <img
                            src={authUser.profilePic || "/avatar.png"}
                            alt="avatar"
                            className="w-8 h-8 rounded-xl object-cover"
                            style={{ border: "1.5px solid rgba(236,72,153,0.25)", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
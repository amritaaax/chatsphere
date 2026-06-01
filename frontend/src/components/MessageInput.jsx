import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Smile } from "lucide-react";
import toast from "react-hot-toast";

const EMOJI_LIST = [
  "😀","😂","😍","🥰","😎","🤔","😢","😡","🥳","😴",
  "👍","👎","❤️","🔥","✨","🎉","💯","🙏","👀","💀",
  "😭","🤣","😊","😋","🤩","😏","🥺","😤","🤯","😇",
  "🫡","🫶","💪","🤝","✌️","🫠","😈","👻","🤑","🎯",
  "🐐","💅","🧢","💎","⚡","🌈","🍕","🚀","🎮","💬",
];

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    try {
      await sendMessage({ text: text.trim(), image: imagePreview });
      setText(""); setImagePreview(null); setShowEmoji(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) { console.error("Failed to send message:", error); }
  };

  const insertEmoji = (emoji) => {
    const input = inputRef.current;
    if (!input) { setText((t) => t + emoji); return; }
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const newText = text.slice(0, start) + emoji + text.slice(end);
    setText(newText);
    setTimeout(() => { input.selectionStart = input.selectionEnd = start + emoji.length; input.focus(); }, 0);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file?.type.startsWith("image/")) { toast.error("Only image files supported"); return; }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) handleSendMessage(e);
    if (e.key === "Escape") setShowEmoji(false);
  };

  return (
    <div
      className={`msg-input-root ${isDragging ? "msg-input-dragging" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="msg-drop-overlay">
          <div className="flex flex-col items-center gap-2">
            <Image className="w-8 h-8 text-pink-400" />
            <span className="text-white font-semibold text-sm">Drop image to send</span>
          </div>
        </div>
      )}

      {imagePreview && (
        <div className="px-1 pt-2 pb-1">
          <div className="relative inline-block">
            <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-xl ring-2 ring-pink-500/40" />
            <button onClick={removeImage} type="button"
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>
      )}

      {showEmoji && (
        <div className="emoji-picker">
          <div className="flex flex-wrap gap-1">
            {EMOJI_LIST.map((emoji) => (
              <button key={emoji} type="button" onClick={() => insertEmoji(emoji)} className="emoji-btn">{emoji}</button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="msg-input-form">
        <button type="button" onClick={() => setShowEmoji((v) => !v)}
          className={`msg-icon-btn ${showEmoji ? "msg-icon-btn-active" : ""}`}>
          <Smile className="w-5 h-5" />
        </button>

        <input
          ref={inputRef}
          type="text"
          placeholder="Message..."
          className="msg-text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button type="button" onClick={() => fileInputRef.current?.click()}
          className={`msg-icon-btn ${imagePreview ? "msg-icon-btn-active" : ""}`}>
          <Image className="w-5 h-5" />
        </button>
        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />

        <button type="submit" disabled={!text.trim() && !imagePreview} className="msg-send-btn">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
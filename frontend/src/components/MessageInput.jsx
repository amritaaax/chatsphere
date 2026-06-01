import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Smile } from "lucide-react";
import toast from "react-hot-toast";

const EMOJI_CATEGORIES = [
  {
    label: "😀 Faces",
    emojis: ["😀","😁","😂","🤣","😃","😄","😅","😆","😉","😊","😋","😎","😍","🥰","😘","🤩","😏","😒","😞","😔","😟","😕","🙁","😣","😖","😫","😩","🥺","😢","😭","😤","😠","😡","🤬","🤯","😳","🥵","🥶","😱","😨","😰","😓","🤗","🤔","🫡","🤭","😶","😐","😑","😬","🙄","😯","😦","😧","😮","😲","🥱","😴","🤤","😪","😵","🤐","🥴","🤢","🤮","🤧","😷","🤒","🤕"]
  },
  {
    label: "👋 Hands",
    emojis: ["👋","🤚","🖐","✋","🖖","👌","🤌","🤏","✌️","🤞","🫰","🤙","💪","🦾","🖕","☝️","👆","👇","👈","👉","👍","👎","✊","👊","🤛","🤜","👏","🫶","🙌","👐","🤲","🙏","✍️","💅","🤳"]
  },
  {
    label: "❤️ Hearts",
    emojis: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❤️‍🔥","❤️‍🩹","💕","💞","💓","💗","💖","💘","💝","💟","☮️","✝️","🔥","✨","⭐","🌟","💫","⚡","🎉","🎊","🎈"]
  },
  {
    label: "😂 Memes",
    emojis: ["💀","☠️","👻","👽","🤖","💩","🤡","👾","🎭","😈","👿","🗿","🫠","🥸","🤠","🥳","🤑","🧐","🫥","😶‍🌫️","🫨","🥹","🫢","🫣","🤫","🫤","😮‍💨","😵‍💫","🫥"]
  },
  {
    label: "🚀 Vibes",
    emojis: ["🚀","💯","🔥","⚡","💎","👑","🏆","🎯","🎮","🎸","🎧","💻","📱","⌨️","🖥️","🌈","🦋","🐐","💅","🫶","🤝","💪","🧠","👀","🫡","🔮","🌙","☀️","🌊","🏔️"]
  },
];

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Images only"); return; }
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
      setText("");
      setImagePreview(null);
      setShowEmoji(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) { console.error(err); }
  };

  const insertEmoji = (emoji) => {
    const input = inputRef.current;
    if (!input) { setText((t) => t + emoji); return; }
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const newText = text.slice(0, start) + emoji + text.slice(end);
    setText(newText);
    setTimeout(() => {
      input.selectionStart = input.selectionEnd = start + emoji.length;
      input.focus();
    }, 0);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file?.type.startsWith("image/")) { toast.error("Images only"); return; }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) handleSendMessage(e);
    if (e.key === "Escape") setShowEmoji(false);
  };

  const canSend = text.trim() || imagePreview;

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
            <span className="text-white font-bold text-sm">Drop to send image</span>
          </div>
        </div>
      )}

      {imagePreview && (
        <div className="msg-img-preview-wrap">
          <img src={imagePreview} alt="Preview" className="msg-img-preview" />
          <button onClick={removeImage} type="button" className="msg-img-remove" aria-label="Remove image">
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      )}

      {showEmoji && (
        <div className="emoji-picker">
          <div className="flex gap-1 mb-3 overflow-x-auto pb-1">
            {EMOJI_CATEGORIES.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(idx)}
                className={`emoji-cat-tab ${activeCategory === idx ? "emoji-cat-tab-active" : ""}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="emoji-grid">
            {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji) => (
              <button key={emoji} type="button" onClick={() => insertEmoji(emoji)} className="emoji-btn">
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="msg-input-form">
        <button
          type="button"
          onClick={() => setShowEmoji((v) => !v)}
          className={`msg-icon-btn ${showEmoji ? "msg-icon-btn-active" : ""}`}
          title="Emoji"
        >
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
          autoComplete="off"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`msg-icon-btn ${imagePreview ? "msg-icon-btn-active" : ""}`}
          title="Attach image"
        >
          <Image className="w-5 h-5" />
        </button>
        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />

        <button type="submit" disabled={!canSend} className="msg-send-btn" title="Send">
          <Send className="w-4 h-4" style={{ transform: "translateX(1px)" }} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
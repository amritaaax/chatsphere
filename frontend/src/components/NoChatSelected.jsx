import { Zap } from "lucide-react";

const FLOATING_BUBBLES = [
  { text: "Hey! What's up? 👋", mine: false, delay: "0s" },
  { text: "Just shipped a new feature 🚀", mine: true, delay: "0.4s" },
  { text: "That's insane fr 🔥", mine: false, delay: "0.8s" },
  { text: "No cap, best day ever 💅", mine: true, delay: "1.2s" },
];

const NoChatSelected = () => {
  return (
    <div className="no-chat-root">

      {/* Subtle grid */}
      <div className="no-chat-grid" />

      <div className="no-chat-content">

        {/* Animated logo */}
        <div className="no-chat-logo">
          <div className="no-chat-logo-ring" />
          <div className="no-chat-logo-inner">
            <Zap className="w-8 h-8 text-white" fill="white" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-white">
            Your chats, <span className="text-gradient">elevated.</span>
          </h2>
          <p className="text-white/40 text-sm max-w-xs mx-auto leading-relaxed">
            Pick a contact from the sidebar and start vibing. Real-time, always fast, built different.
          </p>
        </div>

        {/* Floating preview bubbles */}
        <div className="no-chat-bubbles">
          {FLOATING_BUBBLES.map((b, i) => (
            <div
              key={i}
              className={`no-chat-bubble ${b.mine ? "no-chat-bubble-mine" : "no-chat-bubble-theirs"}`}
              style={{ animationDelay: b.delay }}
            >
              {b.text}
            </div>
          ))}
        </div>

        {/* Feature chips */}
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          {[
            { icon: "⚡", label: "Real-time" },
            { icon: "🔒", label: "Secure" },
            { icon: "😂", label: "Reactions" },
            { icon: "📸", label: "Media" },
            { icon: "🔥", label: "Fast" },
          ].map((chip) => (
            <div key={chip.label} className="no-chat-chip">
              <span>{chip.icon}</span>
              <span className="text-xs font-semibold text-white/50">{chip.label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default NoChatSelected;
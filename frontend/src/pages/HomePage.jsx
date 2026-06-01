import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="home-root">
      <div className="home-blob home-blob-1" />
      <div className="home-blob home-blob-2" />
      <div className="home-blob home-blob-3" />
      <div className="home-layout">
        <div className="home-window">
          <Sidebar />
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
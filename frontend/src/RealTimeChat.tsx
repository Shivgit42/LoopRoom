import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { ThemeToggle } from "./components/ThemeToggle";
import { RoomJoin } from "./components/RoomJoin";
import { ChatRoom } from "./components/ChatRoom";
import { useChatSocket } from "./hooks/useChatSocket";

export default function RealTimeChat() {
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [joined, setJoined] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [chatBubbleColor, setChatBubbleColor] = useState("#2F3132");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { chat, userCount, joinRoom, sendMessage } = useChatSocket(
    joined,
    roomCode,
    name
  );

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    } else {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const storedColor = localStorage.getItem("chatBubbleColor");
    if (storedColor) setChatBubbleColor(storedColor);
  }, []);

  useEffect(() => {
    localStorage.setItem("chatBubbleColor", chatBubbleColor);
  }, [chatBubbleColor]);

  const createRoom = () => {
    const newRoom = uuidv4().slice(0, 6).toUpperCase();
    setRoomCode(newRoom);
    toast.success("Room created successfully!");
  };

  const handleCopyToClipboard = () => {
    const code = roomCode;
    navigator.clipboard.writeText(code);
    toast.success("Room code copied to clipboard!");
  };

  const handleJoinRoom = () => {
    if (!roomCode || !name) {
      toast.error("Please enter a room code and name");
      return;
    }

    joinRoom();
    setJoined(true);
    toast.success("Joined room successfully!");
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessage(message);
    setMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <div className="bg-white dark:bg-[#0a0a0a] text-black dark:text-white flex items-center justify-center min-h-screen transition-colors duration-300">
      {/* Theme Toggle Button */}
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

      {/* Join/Create Room View */}
      {!joined ? (
        <RoomJoin
          name={name}
          setName={setName}
          roomCode={roomCode}
          setRoomCode={setRoomCode}
          createRoom={createRoom}
          joinRoom={handleJoinRoom}
          handleCopyToClipboard={handleCopyToClipboard}
        />
      ) : (
        // Chat Room View
        <ChatRoom
          roomCode={roomCode}
          name={name}
          chat={chat}
          userCount={userCount}
          message={message}
          setMessage={setMessage}
          sendMessage={handleSendMessage}
          handleCopyToClipboard={handleCopyToClipboard}
          messagesEndRef={messagesEndRef}
          chatBubbleColor={chatBubbleColor}
          setChatBubbleColor={setChatBubbleColor}
        />
      )}
    </div>
  );
}

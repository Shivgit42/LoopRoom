import { CopyIcon } from "lucide-react";
import { ChatIcon } from "../icons/ChatIcon";
import type { RefObject } from "react";

interface ChatRoomProps {
  roomCode: string;
  handleCopyToClipboard: () => void;
  userCount: number | null;
  chat: string[];
  message: string;
  setMessage: (v: string) => void;
  sendMessage: () => void;
  name: string;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  chatBubbleColor: string;
  setChatBubbleColor: (color: string) => void;
}

export const ChatRoom = ({
  roomCode,
  handleCopyToClipboard,
  userCount,
  chat,
  message,
  setMessage,
  sendMessage,
  messagesEndRef,
  name,
  chatBubbleColor,
  setChatBubbleColor,
}: ChatRoomProps) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl h-screen flex items-center justify-center">
      <div className="bg-transparent rounded-xl w-full h-auto shadow-xl border border-gray-800/50">
        <div className="flex flex-col p-6 space-y-1">
          <div className="tracking-tight text-xl sm:text-2xl flex gap-2 font-bold items-center">
            <ChatIcon />
            <h1>Real Time Chat</h1>
          </div>
          <div className="text-xs sm:text-sm text-gray-600/90 dark:text-gray-400">
            Temporary room that expires after all users exit
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="colorPicker"
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              Pick your chat color:
            </label>
            <input
              type="color"
              id="colorPicker"
              value={chatBubbleColor}
              onChange={(e) => setChatBubbleColor(e.target.value)}
              className="cursor-pointer w-8 h-8 border-none rounded-full"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-2 mt-6 items-center bg-slate-300/35 dark:bg-gray-500/25 p-4 rounded-md mb-4 text-sm text-black/70 dark:text-gray-400">
            <div className="flex gap-2 items-center">
              Room Code: <strong>{roomCode}</strong>
              <div onClick={handleCopyToClipboard} className="cursor-pointer">
                <CopyIcon width={16} height={16} />
              </div>
            </div>
            <span>Users: {userCount ?? "n/a"}</span>
          </div>

          <div className="h-64 sm:h-80 md:h-96 overflow-y-auto border border-gray-500/25 p-4 rounded-md mb-4">
            {chat.map((msg, idx) => {
              const isSystem = msg.startsWith("[System]:");
              const sender = msg.split(": ")[0];
              const content = msg.split(": ").slice(1).join(": ");

              return (
                <div
                  key={idx}
                  className={`mb-2 ${
                    isSystem
                      ? "text-center text-gray-400 text-sm"
                      : sender === name
                      ? "text-right"
                      : "text-left"
                  }`}
                >
                  <span
                    className={`px-3 py-1 rounded-lg inline-block ${
                      isSystem
                        ? "bg-gray-500/20"
                        : sender === name
                        ? ""
                        : "dark:bg-white dark:text-black bg-black text-white"
                    }`}
                    style={{
                      backgroundColor:
                        !isSystem && sender === name
                          ? chatBubbleColor
                          : undefined,
                      color: !isSystem && sender === name ? "#fff" : undefined,
                    }}
                  >
                    {content}
                  </span>
                  {!isSystem && (
                    <div className="text-xs dark:text-gray-400 text-black/70 mt-1">
                      {sender}
                    </div>
                  )}
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-2 gap-3">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && message.trim()) {
                  sendMessage();
                }
              }}
              className="flex-1 px-4 py-2 rounded-md shadow-sm border bg-white text-black dark:bg-transparent dark:text-white border-gray-500/30"
            />
            <button
              onClick={sendMessage}
              className="w-full sm:w-auto px-8 py-2 bg-black text-white dark:bg-white dark:text-black font-semibold rounded-md hover:bg-black/90 dark:hover:bg-white/90 cursor-pointer"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

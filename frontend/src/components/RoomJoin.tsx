import { CopyIcon } from "../icons/CopyIcon";
import { ChatIcon } from "../icons/ChatIcon";

interface RoomJoinProps {
  name: string;
  setName: (v: string) => void;
  createRoom: () => void;
  roomCode: string;
  setRoomCode: (v: string) => void;
  joinRoom: () => void;
  handleCopyToClipboard: () => void;
}

export const RoomJoin = ({
  name,
  setName,
  createRoom,
  roomCode,
  setRoomCode,
  joinRoom,
  handleCopyToClipboard,
}: RoomJoinProps) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl min-h-screen flex items-center justify-center">
      <div className="bg-transparent rounded-xl w-full h-auto shadow-xl border border-gray-500/30">
        <div className="flex flex-col p-6 space-y-1">
          <div className="tracking-tight text-xl sm:text-2xl flex gap-2 font-bold items-center">
            <ChatIcon />
            <h1>Real Time Chat</h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-600/90 dark:text-gray-400 mb-4">
            Temporary room that expires after all users exit
          </p>

          <div className="sm:pt-2.5 pt-1.5">
            <button
              className="w-full py-2.5 px-4 mb-4 bg-[#0a0a0a] text-white dark:bg-white text-lg dark:text-black rounded-md font-semibold hover:bg-black/90 dark:hover:bg-white/90 cursor-pointer"
              onClick={createRoom}
            >
              Create New Room
            </button>
          </div>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 mb-3 rounded-md shadow-sm bg-white text-black dark:bg-transparent dark:text-white border border-gray-500/30"
          />

          <div className="flex flex-col sm:flex-row sm:gap-2 gap-3">
            <input
              type="text"
              placeholder="Enter Room Code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="flex-1 px-4 py-2 rounded-md shadow-sm bg-white text-black dark:bg-transparent dark:text-white border border-gray-500/30"
            />
            <button
              className="w-full sm:w-auto px-8 py-2 bg-black text-white dark:bg-white dark:text-black rounded-md font-semibold hover:bg-black/90 dark:hover:bg-white/90 cursor-pointer"
              onClick={joinRoom}
            >
              Join Room
            </button>
          </div>

          {roomCode && (
            <div className="flex flex-col justify-center items-center w-full mt-3 p-6 bg-gray-300/30 dark:bg-gray-600/30 rounded-md">
              <p className="text-center text-sm sm:text-md text-black/70 dark:text-gray-400">
                Share this code with your friend
              </p>
              <div className="flex items-center gap-2 text-xl sm:text-2xl pt-2 font-bold tracking-widest">
                {roomCode}
                <div
                  onClick={handleCopyToClipboard}
                  className="cursor-pointer relative top-[1px]"
                >
                  <CopyIcon />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

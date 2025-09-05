import { useCallback, useEffect, useRef, useState } from "react";

export function useChatSocket(joined: boolean, roomCode: string, name: string) {
  const socketRef = useRef<WebSocket | null>(null);

  const [chat, setChat] = useState<string[]>([]);
  const [userCount, setUserCount] = useState<number | null>(null);

  const connectSocket = useCallback(() => {
    const socket = new WebSocket(`ws://${window.location.hostname}:8080`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Connected to WebSocket");
      if (joined && roomCode && name) {
        socket.send(
          JSON.stringify({
            type: "join",
            payload: { roomId: roomCode, name },
          })
        );
      }
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      switch (msg.type) {
        case "chat":
          setChat((prev) => [
            ...prev,
            `${msg.payload.sender}: ${msg.payload.message}`,
          ]);
          break;

        case "users":
          setUserCount(msg.payload.count);
          break;

        case "notification":
          setChat((prev) => [...prev, `[System]: ${msg.payload.message}`]);
          break;

        default:
          console.warn("Unknown message type", msg.type);
      }
    };

    socket.onclose = () => {
      console.warn("WebSocket disconnected. Attempting to reconnect in 3s...");
      setTimeout(connectSocket, 3000);
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      socket.close();
    };
  }, []);

  useEffect(() => {
    connectSocket();
    return () => {
      socketRef.current?.close();
    };
  }, [connectSocket]);

  const joinRoom = useCallback(() => {
    if (!roomCode || !name) return;
    socketRef.current?.send(
      JSON.stringify({
        type: "join",
        payload: { roomId: roomCode, name },
      })
    );
  }, [roomCode, name]);

  const sendMessage = useCallback((message: string) => {
    if (!message.trim() || socketRef.current?.readyState !== WebSocket.OPEN)
      return;
    socketRef.current?.send(
      JSON.stringify({
        type: "chat",
        payload: { message },
      })
    );
  }, []);

  return {
    chat,
    userCount,
    joinRoom,
    sendMessage,
  };
}

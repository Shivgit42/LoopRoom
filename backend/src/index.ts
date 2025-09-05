// import { WebSocketServer, WebSocket } from "ws";

// const wss = new WebSocketServer({ port: 8080 });

// interface User {
//   socket: WebSocket;
//   room: string;
// }

// // let userCount = 0;
// let allSockets: User[] = [];

// wss.on("connection", (socket) => {
//   // userCount += 1;

//   socket.on("message", (message) => {
//     //@ts-ignore
//     const parsedMessage = JSON.parse(message);
//     if (parsedMessage.type === "join") {
//       console.log("user joined to room " + parsedMessage.payload.roomId);
//       allSockets.push({
//         socket,
//         room: parsedMessage.payload.roomId,
//       });
//     }

//     if (parsedMessage.type === "chat") {
//       console.log("user want to chat");
//       const currentUserRoom = allSockets.find((x) => x.socket === socket)?.room;
//       if (currentUserRoom) {
//         allSockets.forEach((user) => {
//           if (user.room === currentUserRoom) {
//             user.socket.send(parsedMessage.payload.message);
//           }
//         });
//       }
//     }
//   });
// });

import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080, host: "0.0.0.0" });

//Rooms and their members
const rooms = new Map<string, Set<WebSocket>>();
/*
{
"room1": Set { WebSocket1, WebSocket2, WebSocket3 },
"room2": Set { WebSocket4, WebSocket5 }
}
*/

//Map each user to a room
const user = new Map<WebSocket, string>();

/*
{
WebSocket1 => "room1",
WebSocket3 => "room1",
WebSocket5 => "room2",
}
*/

const username = new Map<WebSocket, string>();

const messageHistory = new Map<string, { sender: string; message: string }[]>();

interface JoinMessage {
  type: "join";
  payload: {
    roomId: string;
    name: string;
  };
}

interface ChatMessage {
  type: "chat";
  payload: {
    message: string;
  };
}

type MessagePayload = JoinMessage | ChatMessage;

wss.on("connection", (ws: WebSocket) => {
  ws.on("error", console.error);

  ws.on("message", (data) => {
    let reqObj: MessagePayload;

    try {
      reqObj = JSON.parse(data.toString());
    } catch (err) {
      ws.send("Invalid message format");
      return;
    }

    if (reqObj.type === "join") {
      const roomName = reqObj.payload.roomId;
      const name = reqObj.payload.name;

      if (!rooms.has(roomName)) {
        rooms.set(roomName, new Set());
      }

      rooms.get(roomName)?.add(ws);
      user.set(ws, roomName);
      username.set(ws, name);

      ws.send(`You joined room "${roomName}" successfully`);

      const roomUsers = rooms.get(roomName)?.size || 0;
      rooms.get(roomName)?.forEach((member) => {
        member.send(
          JSON.stringify({
            type: "users",
            payload: { count: roomUsers },
          })
        );

        if (member !== ws) {
          member.send(
            JSON.stringify({
              type: "notification",
              payload: { message: `${name} joined the room.` },
            })
          );
        }
      });

      const history = messageHistory.get(roomName) || [];
      history.forEach(({ sender, message }) => {
        ws.send(
          JSON.stringify({
            type: "chat",
            payload: { message, sender },
          })
        );
      });
    }

    if (reqObj.type === "chat") {
      const roomName = user.get(ws);
      const sender = username.get(ws) || "Anonymous";
      const message = reqObj.payload.message;

      if (roomName && message) {
        if (!messageHistory.has(roomName)) {
          messageHistory.set(roomName, []);
        }
        messageHistory.get(roomName)?.push({ sender, message });

        rooms.get(roomName)?.forEach((member) => {
          if (member.readyState === WebSocket.OPEN) {
            try {
              member.send(
                JSON.stringify({
                  type: "chat",
                  payload: { message, sender },
                })
              );
            } catch (e) {
              console.error("Error sending message to a member", e);
            }
          }
        });
      } else {
        ws.send("You are not in any room. Join a room first.");
      }
    }
  });

  ws.on("close", () => {
    const roomName = user.get(ws);
    const name = username.get(ws) || "Someone";

    if (roomName && rooms.has(roomName)) {
      rooms.get(roomName)?.delete(ws);
      user.delete(ws);
      username.delete(ws);

      // Update user count
      const count = rooms.get(roomName)?.size || 0;

      rooms.get(roomName)?.forEach((member) => {
        member.send(
          JSON.stringify({
            type: "users",
            payload: { count },
          })
        );

        member.send(
          JSON.stringify({
            type: "notification",
            payload: { message: `${name} left the room.` },
          })
        );
      });
    }
  });
});

//? notes
// 🧠 Analogy:
// Think of it like a school:

// Question	                                         Map Used	                          Example
// Who are the students in Class A?	                   room 	                  "ClassA" → Set{Alice, Bob}
// Which class is Alice in?	                           user	                        Alice → "ClassA"

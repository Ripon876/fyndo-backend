const { Server } = require("socket.io");
const driver = require("./../database");
const { nanoid } = require("nanoid");
const onlineUsers = {};

function getKey(value) {
  return Object.keys(onlineUsers).find((key) => onlineUsers[key] === value);
}

module.exports.listen = function (server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_BASE,
      methods: ["GET", "POST"],
    },
  });

  // io.use(async (socket, next) => {
  //   console.log("middleware running...");
  //   try {
  //     const cookies = cookie.parse(socket.handshake.headers.cookie);
  //     const user = await jwt.verify(cookies.token, process.env.JWT_SECRET);
  //     if (user.id) {
  //       socket.userId = user.id;
  //       next();
  //     }
  //   } catch (err) {
  //     next(new Error("not authenticated"));
  //   }
  // })

  io.on("connection", async (socket) => {
    socket.on("JOIN", (id) => {
      console.log(id);
      socket.join(id);
      console.log("=================---------------==========");
    });

    socket.on("SEND_MESSAGE", async (rawMsg) => {
      const session = driver.session();
      try {
        const { receiver, sender, conversation, message } = rawMsg;
        const id = nanoid();
        const sentAt = new Date().toISOString();
        const result = await session.run(`
          MATCH (s:User {id: "${sender}"}),(r:User {id: "${receiver}"}), (c:Conversation {id: "${conversation}"})
          OPTIONAL MATCH (c) - [lm:LastMessage] -> (:Message)
          WHERE lm IS NOT NULL 
          DELETE lm
          CREATE (m:Message {id: "${id}",message:"${message}",sentAt: "${sentAt}"}) - [:BelongsTo] -> (c)
          CREATE (s) <- [:Sender] - (m) -[:Receiver]-> (r)
          CREATE (c) - [:LastMessage] -> (m)
          RETURN m{.*,sender: properties(s),receiver: properties(r),conversation: properties(c)} AS message
      `);
        const msg = result.records[0].get("message");
        socket.to(rawMsg.conversation).emit("RECEIVE_MESSAGE", {
          id: msg.id,
          receiver: {
            id: msg.receiver.id,
          },
          message: msg.message,
        });
      } catch (err) {
        console.log(err);
        return null;
      } finally {
        await session.close();
      }
    });

    socket.on("disconnect", () => {
      console.log("client disconnected");
    });
  });

  return io;
};

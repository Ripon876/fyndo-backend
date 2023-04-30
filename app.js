require("dotenv").config();
const express = require("express");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { graphqlHTTP } = require("express-graphql");
const fileUpload = require("express-fileupload");
const port = process.env.PORT;
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
require("./database");
const schema = require("./schema");
const io = require("./socket").listen(server);
const whitelist = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://fyndo.netlify.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors("*"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser("MYMY SECRET SECRET"));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);
// fs.readdirSync("./routes").forEach((file) => {
//   const route = "./routes/" + file;
//   app.use(require(route));
// });


// const io = new Server(server, {
//   cors: {
//     origin: process.env.FRONTEND_BASE,
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   socket.on("JOIN", (id) => {
//     console.log(id);
//     socket.join(id);
//     console.log("=================---------------==========");

//     io.to();
//   });

//   socket.on("SEND_MESSAGE", async (msg) => {
//     const session = driver.session();
//     try {
//       const { receiver, conversation, message } = args;
//       const sender = ctx.req.user.id;
//       const id = nanoid();
//       const sentAt = new Date().toISOString();
//       const result = await session.run(`
//         MATCH (s:User {id: "${sender}"}),(r:User {id: "${receiver}"}), (c:Conversation {id: "${conversation}"})
//         OPTIONAL MATCH (c) - [lm:LastMessage] -> (:Message)
//         WHERE lm IS NOT NULL 
//         DELETE lm
//         CREATE (m:Message {id: "${id}",message:"${message}",sentAt: "${sentAt}"}) - [:BelongsTo] -> (c)
//         CREATE (s) <- [:Sender] - (m) -[:Receiver]-> (r)
//         CREATE (c) - [:LastMessage] -> (m)
//         RETURN m{.*,sender: properties(s),receiver: properties(r),conversation: properties(c)} AS message
//     `);
//       const msg = result.records[0].get("message");

//       return msg;
//     } catch (err) {
//       console.log(err);
//       return null;
//     } finally {
//       await session.close();
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("client disconnected");
//   });
// });

const { authCheck } = require("./middlewares/authCheck");

app.use(
  "/graphql",
  authCheck,
  graphqlHTTP((req) => ({
    schema,
    graphiql: true,
    context: { req, io },
  }))
);
app.use(require("./routes/signupLogin"));
app.use(require("./routes/profile"));
app.get("/", (req, res) => {
  res.send({
    status: "ok",
  });
});

server.listen(port, () => {
  console.log("server started at port " + port);
});

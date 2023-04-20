require("dotenv").config();
const express = require("express");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { graphqlHTTP } = require("express-graphql");

const port = process.env.PORT;
const app = express();
const server = http.createServer(app);
const io = require("./socket").listen(server);
require("./database");
const schema = require("./schema");

const whitelist = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://social-media99.netlify.app",
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

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser("MYMY SECRET SECRET"));

// fs.readdirSync("./routes").forEach((file) => {
//   const route = "./routes/" + file;
//   app.use(require(route));
// });
const { authCheck } = require("./middlewares/authCheck");

app.use(
  "/graphql",
  graphqlHTTP((req) => ({
    schema,
    graphiql: true,
    context: { req },
  }))
);

app.get("/", (req, res) => {
  res.send({
    status: "ok",
  });
});

server.listen(port, () => {
  console.log("server started at port " + port);
});

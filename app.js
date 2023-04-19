require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const port = process.env.PORT || 5000;
const http = require("http");
const server = http.createServer(app);
const io = require("./socket").listen(server);

const mongodbStr = process.env.MONGODB_URI;

console.log("mongodb uri : ", mongodbStr);
mongoose.connect(mongodbStr);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser("MYMY SECRET SECRET"));
// app.use(cors());

const whitelist = [
  "http://localhost:3000",
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

fs.readdirSync("./routes").forEach((file) => {
  const route = "./routes/" + file;
  app.use(require(route));
});

app.get("/", (req, res) => {
  res.send({
    status: "ok",
  });
});

server.listen(port, () => {
  console.log("server started at port " + port);
});

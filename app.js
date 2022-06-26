require('dotenv').config();
var express = require("express");
var mongoose = require("mongoose");
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors')
var port = process.env.PORT || 5000;
var http = require("http");
var server = http.createServer(app);
const io = require('./routes/socket').listen(server);


const User = require('./models/user');
const Thread = require('./models/thread');
const Message = require('./models/message');



mongoose.connect('mongodb://localhost:27017/social-media-backend')


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser('MYMY SECRET SECRET'));
// app.use(cors());




const whitelist = ["http://localhost:3000"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))


var sl_route =  require('./routes/signup_login');
var rt_route =  require('./routes/refreshToken');
var messages = require('./routes/messages');
app.use(sl_route);
app.use(rt_route);
app.use(messages);




app.get("/", (req, res) => {
  res.send("this is the home route");
});

server.listen(port,()=> {
    // console.log('server started at port ' + port);
    console.log('%c server started at port ' + port,'font-weight : bold;color : red;');
});

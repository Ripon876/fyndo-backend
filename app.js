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
var {Server} = require('socket.io');
var io = new Server(server ,{
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

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









io.on('connection', (socket) => {



// socket.join('62b0d61340bdf8edf9b5ace5')  
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');

   
  });


socket.on('room',(thred)=> {
  console.log(thred)
 socket.join(thred);
 console.log('room joined')
})




socket.on("send_message",async (data) => {
// console.log(data)
/*
{
  threadId: '62b0d61340bdf8edf9b5ace5',
  msg: 'dfsd',
  to: {
    name: 'Ruddro Roy',
    username: 'ruddro',
    id: '62b0d53840bdf8edf9b5acc6'
  },
  from: {
    name: 'MD Ripon Islam',
    username: 'ripon',
    id: '62b0d52940bdf8edf9b5acc3'
  }
}
*/

var thread = await Thread.findById(data.threadId);

var  {threadId,...msg} = data;



var message =  await Message.create(msg)

thread.messages.push(message._id);
thread.save();

// console.log(thread._id)

// socket.broadcast.to(,data)
// console.log(message)
console.log('emiting')
 socket.broadcast.to(data.threadId).emit("receive_message", message);
 // socket.to(data.threadId).emit("receive_message", message);


// socket.emit("receive_message", message);



})






});










app.get("/", (req, res) => {
  res.send("this is the home route");
});

server.listen(port,()=> {
    console.log('server started at port ' + port);
});

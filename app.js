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





const onlineUsers = {};

function getKey(value) {
  return Object.keys(onlineUsers).find(key => onlineUsers[key] === value );
}


/*function removeUser(id){

      const thred = getKey(id);
    if(onThreads[thred]){

    var index = onThreads[thred].indexOf(id);
    if (index !== -1) {
        onThreads[thred].splice(index, 1);

     if(getKey(id)){
         removeUser(id)
     }

        
    }
}
}*/

io.on('connection', (socket) => {



// socket.join('62b0d61340bdf8edf9b5ace5')


  console.log('a user connected');


socket.on('disconnect', () => {

 let usr = getKey(socket.id);
  delete onlineUsers[usr];
// console.log(onlineUsers)

});


socket.on('room',(data)=> {
  

if(onlineUsers[data.uId]){
  socket.join(data.thread);
}else{
  onlineUsers[data.uId] = socket.id;
   socket.join(data.thread)
}


   // console.log(onlineUsers)
 console.log('room joined')
});



socket.on('leave_room',(id)=> {

   socket.leave(id);

});


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

// console.log(socket.id)

 var sdfds =  socket.adapter.rooms;
console.log(sdfds.get(data.threadId));
var connectedUsers =  sdfds.get(data.threadId).size;







var thread = await Thread.findById(data.threadId);

var  {threadId,...msg} = data;



var message =  await Message.create(msg)

thread.messages.push(message._id);
thread.save();

// console.log(thread._id)

// socket.broadcast.to(,data)
// console.log(message,threadId)
// console.log('emiting')

if(connectedUsers === 2){
  console.log('both connected');
  socket.broadcast.to(data.threadId).emit("receive_message", data);
}else{
  console.log('one is connected')

 let toUsr = onlineUsers[data.to.id];

    socket.broadcast.to(toUsr).emit("receive_message_not_seen", data);
}


 
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

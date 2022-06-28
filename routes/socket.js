const {Server} = require('socket.io');
const User = require('../models/user');
const Thread = require('../models/thread');
const Message = require('../models/message');



const onlineUsers = {};

function getKey(value) {
  return Object.keys(onlineUsers).find(key => onlineUsers[key] === value );
}




module.exports.listen = function(server){
    var io = new Server(server ,{
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});


io.use((socket, next) => {
   console.log('middleware running...');
if(socket.handshake.headers.cookie){
  next();
}else{
  next(new Error("not authenticated"));
}


   
}).on('connection', (socket) => {

// console.log(socket.handshake.headers.cookie)

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


    return io
}

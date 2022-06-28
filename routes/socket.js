const {Server} = require('socket.io');
const User = require('../models/user');
const Thread = require('../models/thread');
const Message = require('../models/message');
const Post = require('../models/post');



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


// disconnect event
socket.on('disconnect', () => {

 let usr = getKey(socket.id);
  delete onlineUsers[usr];
// console.log(onlineUsers)

});




// room joining event
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



// thread leaving event

socket.on('leave_room',(id)=> {

   socket.leave(id);

});




 // message event 

socket.on("send_message",async (data) => {

    var sdfds =  socket.adapter.rooms;
    // console.log(sdfds.get(data.threadId));
    var connectedUsers =  sdfds.get(data.threadId).size;
    var thread = await Thread.findById(data.threadId);
    var  {threadId,...msg} = data;
    var message =  await Message.create(msg)

    thread.messages.push(message._id);
    thread.save();

    if(connectedUsers === 2){

        console.log('both connected');
        socket.broadcast.to(data.threadId).emit("receive_message", data);

    }else{

        console.log('one is connected')
        let toUsr = onlineUsers[data.to.id];
        socket.broadcast.to(toUsr).emit("receive_message_not_seen", data);

    }


})



// new post create event
socket.on('post',async (data,cb)=> {
    
  /*
  { creator: '62b0d52940bdf8edf9b5acc3', content: '����� }

{
  creator: new ObjectId("62b0d52940bdf8edf9b5acc3"),
  content: '���',
  creationDate: 2022-06-28T13:10:23.954Z,
  _id: new ObjectId("62bafdc6aba8c0c43f77f049"),
  __v: 0
}
  */


try{

  const newPost = await Post.create({creator : data.creator,content : data.content});
  const user = await User.findById(data.creator);
   
   await user.post.push(newPost._id);
   await user.save()
   // console.log(user)


const post = await Post.findById(newPost._id).populate({
       path: 'creator',
       model: User,
      select: ['-password','-post','-threads','-education']
     });
// console.log(post)

  cb({status :   true ,post : post })


}catch(err){
  console.log(err);
  cb({status :   false})

}


});



socket.on('getPost',async (id,cb) => {

   const user = await User.findById(id).populate({ 
     path: 'post',
     populate: {
       path: 'creator',
       model: User,
        select: ['-password','-post','-threads','-education']
     } 
  });

   // console.log(user)

   cb(user.post);

})



});


    return io
}

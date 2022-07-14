const {Server} = require('socket.io');
const User = require('../models/user');
const Thread = require('../models/thread');
const Message = require('../models/message');
const Post = require('../models/post');
const jwt_decode = require("jwt-decode");


const onlineUsers = {};
const activeUsers = [];



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

const token = socket.handshake.headers.cookie.split('s%3A',3)[1];
const userdata =  jwt_decode(token);

 if(!activeUsers.includes(userdata.id)){
    console.log('pusing to active array')
    activeUsers.push(userdata.id);
    onlineUsers[userdata.id] = socket.id;
console.log(activeUsers)

 }










// disconnect event
socket.on('disconnect', () => {

let usr = getKey(socket.id);
const token = socket.handshake.headers.cookie.split('s%3A',3)[1];
// console.log(token)
const userdata =  jwt_decode(token);

const userIndex =  activeUsers.indexOf(userdata.id)
activeUsers.splice(userIndex,1);
console.log(activeUsers)

// console.log('user disconnected',socket.id)
  delete onlineUsers[usr];
// console.log(onlineUsers)

console.log('disconnected')



});


socket.on('loggin',(d)=> {
    console.log(d)
})


/*socket.on('active',(id) => {
 
console.log('active event')

 if(!activeUsers.includes(id)){
    // console.log('pusing to active array')
    activeUsers.push(id);


// socket.emit('sadfdsf33',activeUsers);

 }

    // console.log(activeUsers)
})
*/


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

/*   const user = await User.findById(id).populate({ 
     path: 'post',
     populate: {
       path: 'creator',
       model: User,
        select: ['-password','-post','-threads','-education']
     } 
  });

   // console.log(user)

   cb(user.post);
*/





try{


const posts =  await Post.find({}).populate({
       path: 'creator',
       model: User,
        select: ['-password','-post','-threads','-education','-contacts']
     }).skip(0)
       .limit(10)

/*

const pp = await Post.find({}).populate({
       path: 'creator',
       model: User,
        select: ['-password','-post','-threads','-education']
     }).skip(5)
       .limit(10)
*/

// console.log(pp)


cb(posts);


}catch(err){
  console.log(err);
}


})



socket.on('getProfileInfo',async (id,cb)=>{


  try{


     const user = await User.findById(id).select(["-password",'-threads']).populate({ 
         path: 'post',
         populate: {
           path: 'creator',
           model: User,
            select: ['-password','-post','-threads','-education']
         } 
      })

    // console.log(user);

    cb({status : true,data:  user})

   

  }catch(err){
  
    console.log(err)
    cb({status : false})

  }

})


socket.on('deletePost',async (id,cb)=> {

try{

 const post =  await Post.findByIdAndRemove(id);
 
 cb({status : true})

}catch(err){
  console.log(err);
  cb({status: false})
 
}

})



socket.on('getPostToEdit',async (id,cb)=> {
     

   try{

 const post =  await  Post.findById(id);
// console.log(post)
cb(post)


   }catch(err){
    console.log(err)
   }

})




socket.on("editPost",async (id,content,cb)=> {
  try{
     
   const post =  await Post.findByIdAndUpdate(id,{content: content},{new : true});
   // console.log(post)
    

  const editedPost =  await Post.findById(id).populate({
       path: 'creator',
       model: User,
        select: ['-password','-post','-threads','-education']
     })



    cb({status :  true,post:  editedPost});  
  
  }catch(err){
    cb({status :  false})
  }
})





socket.on('getOldMessages',async (threadId,pageNum,cb) => {
 

try{

    const thred =  await Thread.findById(threadId).populate('messages').skip(0).limit(2);


    let p = pageNum;
    let i = 10;

    let sp;
    let fp = i * ( p - 1) + ( i -1) ;

    p === 1 ? sp = 0 :  sp =   i * ( p - 1 );
 

    let msgs = thred?.messages?.reverse().slice(sp,fp+1);




    if(msgs.length == 0){
          cb({status : false,msg : 'No more old messages',type: 'warning'})
    }else{
          cb({status : true, messages : msgs.reverse()})
    }


}catch(err){
    console.log(err)
   cb({status : false,msg : 'Something went wrong',type: 'error'})

}


})






socket.on('getUserInfo',async (id,cb)=> {

  try{

      var user = await User.findById(id).select(['-password','-post','-threads'])

      // console.log(user);
      cb({status: true, data : user})

  }catch(err){
      console.log(err);
      cb({status : false})
  }

})




socket.on('saveBasicInfo',async(id,data,cb) => {
    try{

        var user  = await User.findByIdAndUpdate(id,data,{new: true}).select(['-password','-post','-threads'])
      
        cb({status : true, data: user})

    }catch(err){

        console.log(err);
        cb({status : false})

    }
})






socket.on('saveContacts',async(id,data,cb) => {
    try{

        var user  = await User.findByIdAndUpdate(id,{contacts : data},{new: true}).select(['-password','-post','-threads'])
       
        cb({status : true, data: user})

    }catch(err){

        console.log(err);
        cb({status : false})

    }
});






socket.on('saveEducationInfo',async(id,data,cb) => {
    try{

        var user  = await User.findByIdAndUpdate(id,{education : data},{new: true}).select(['-password','-post','-threads'])
       
        cb({status : true, data: user})

    }catch(err){

        console.log(err);
        cb({status : false})

    }
});



socket.on('getActiveUsers',(cb)=>{
    cb(activeUsers);
})






});


    return io
}

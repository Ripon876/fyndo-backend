const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Thread = require('../models/thread');
const Message = require('../models/message');



router.get('/friends',async (req,res) => {
    if(req.signedCookies.refreshtoken){
    	// console.log(req.signedCookies.refreshtoken)
	const users = await User.find({});
    	res.json(users)
    }else{
    	res.json({})
    }
});



/*var thred = {
    _id : '1903c1e178fcb45f682d4041',
    users : ['62a056ea4bbd1903c1e178fc','62ac9ac90a54b45f682d4041'],
    messages : []
}
*/
// Thread.create(thred,(t,e)=> {
//     if(e) console.log(e);
//     console.log(t);
// } )



router.post("/thread",async (req,res)=> {

// console.log(req.signedCookies.refreshtoken)
// console.log(req.query.id)



if(req.signedCookies.refreshtoken && req.query.id){

    try{
        const thred =  await Thread.findById(req.query.id).populate('messages').skip(0).limit(2);

        res.status(200).json({status: true,id: thred._id,messages: thred.messages.slice(thred.messages.length-10)}) 
        return;
    }catch(err){
        res.json({status : false})
    }
  
}



    if(req.signedCookies.refreshtoken){
        // console.log(req.signedCookies.refreshtoken)
  

try{

        const oldthread1 = await Thread.find({
            users : req.body.users
        })
        const oldthread2 = await Thread.find({
            users : [req.body.users[1],req.body.users[0]]
        })

        // console.log(oldthread1)
        // console.log(oldthread2)


        if((oldthread1 && oldthread1.length > 0) || (oldthread2 && oldthread2.length > 0)){
           
        var id;


        oldthread1[0]?._id ? id =  oldthread1[0]._id : id =  oldthread2[0]._id;
          


        const thred  = await Thread.findById(id).populate('messages');


        res.status(200).json({status: true,id: id,messages: thred.messages.slice(thred.messages.length-10)})

        }else{

            const thred = await Thread.create({
                users : req.body.users,
                messages : []
            });

            const user1 = await User.findById(req.body.users[0]);
            user1.threads.push(thred._id);
            user1.save();

            const user2 = await User.findById(req.body.users[1]);
            user2.threads.push(thred._id);
            user2.save();

            res.status(200).json({status: true,id: thred._id,messages: thred.messages.slice(thred.messages.length-10)})

        }



}catch(err){
        console.log(req.body)
        console.log(err)
        res.json({status : false})
}








    }else{
        res.json({})
    }
})





module.exports = router;

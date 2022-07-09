const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Thread = require('../models/thread');
const Message = require('../models/message');



router.get('/friends',async (req,res) => {
    if(req.signedCookies.refreshtoken){
    	// console.log(req.signedCookies.refreshtoken)
	const users = await User.find({}).select(['-password','-contacts','-education','-post']);
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

try{

    if(req.signedCookies.refreshtoken && req.query.id){

        const thred =  await Thread.findById(req.query.id).populate('messages').skip(0).limit(2);

        console.log('finding thread using id');
        const user2 = await User.findById(req.body.users[1]).select(['-password','-contacts','-education','-post']);
   
        res.status(200).json({status: true,id: thred._id,messages: thred.messages.slice(thred.messages.length-10),cw : user2}) 
        return;
  


    }else{



        const oldthread1 = await Thread.find({
            users : req.body.users
        })
        const oldthread2 = await Thread.find({
            users : [req.body.users[1],req.body.users[0]]
        })


        if((oldthread1 && oldthread1.length > 0) || (oldthread2 && oldthread2.length > 0)){
           
            var id;
            oldthread1[0]?._id ? id =  oldthread1[0]._id : id =  oldthread2[0]._id;
              
            const thred  = await Thread.findById(id).populate('messages');

            console.log('finding old thread using users')
            const user2 = await User.findById(req.body.users[1]).select(['-password','-contacts','-education','-post']);

            res.status(200).json({status: true,id: id,messages: thred.messages.slice(thred.messages.length-10),cw : user2})

        }else{

            const thred = await Thread.create({
                users : req.body.users,
                messages : []
            });

            const user1 = await User.findById(req.body.users[0]);
            user1.threads.push(thred._id);
            user1.save();

            const user2 = await User.findById(req.body.users[1]).select(['-password','-contacts','-education','-post']);
            user2.threads.push(thred._id);
            user2.save();
            console.log('creating new thread')

            res.status(200).json({status: true,id: thred._id,messages: thred.messages.slice(thred.messages.length-10), cw : user2 })

        }



    }

}catch(err){
    console.log(err)
    res.json({status : false})
}

})


module.exports = router;

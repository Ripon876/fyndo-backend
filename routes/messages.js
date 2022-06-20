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
})


module.exports = router;

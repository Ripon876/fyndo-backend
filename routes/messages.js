const express = require('express');
const router = express.Router();
const User = require('../models/user');



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
